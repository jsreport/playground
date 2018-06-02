const nanoid = require('nanoid')
const sessions = require('client-sessions')
const passport = require('passport')
const Strategy = require('passport-facebook').Strategy
const slugify = require('slugify')

module.exports = function (reporter, definition) {
  reporter.documentStore.registerEntityType('WorkspaceType', {
    _id: { type: 'Edm.String', key: true },
    shortid: { type: 'Edm.String' },
    default: { type: 'Edm.String' },
    name: { type: 'Edm.String' },
    userId: { type: 'Edm.String' },
    modificationDate: { type: 'Edm.DateTimeOffset' }
  })

  reporter.documentStore.registerEntityType('UserType', {
    _id: { type: 'Edm.String', key: true },
    provider: { type: 'Edm.String' },
    externalId: { type: 'Edm.String' },
    secret: { type: 'Edm.String' },
    username: { type: 'Edm.String' },
    fullName: { type: 'Edm.String' }
  })

  reporter.documentStore.registerEntitySet('workspaces', { entityType: 'jsreport.WorkspaceType' })
  reporter.documentStore.registerEntitySet('users', { entityType: 'jsreport.UserType' })

  reporter.documentStore.on('before-init', (documentStore) => {
    for (const es of Object.keys(documentStore.model.entitySets)) {
      const entitySet = documentStore.model.entitySets[es]

      const entityType = documentStore.model.entityTypes[entitySet.entityType.replace(documentStore.model.namespace + '.', '')]
      entityType.workspaceId = { type: 'Edm.Number' }
    }
  })

  reporter.on('after-express-static-configure', (app) => {
    passport.use(new Strategy({
      clientID: '2205015682872078',
      clientSecret: '212c5a3e91eaaebcec565640528c8417',
      callbackURL: 'http://localhost:5488/login/facebook/return'
    }, (accessToken, refreshToken, profile, cb) => {
      reporter.documentStore.collection('users').findOne({ externalId: profile.id }).then((existingUser) => {
        if (existingUser) {
          return existingUser
        }

        return reporter.documentStore.collection('users').insert({
          username: slugify(profile.displayName, {
            replacement: '.',
            lower: true
          }),
          fullName: profile.displayName,
          externalId: profile.id,
          provider: 'facebook'
        })
      }).then((u) => cb(null, u)).catch(cb)
    }))

    passport.serializeUser((user, cb) => {
      cb(null, user._id)
    })
    passport.deserializeUser((obj, cb) => {
      reporter.documentStore.collection('users').findOne({ _id: obj }).then((u) => cb(null, u)).catch(cb)
    })

    app.use(sessions({
      cookieName: 'session',
      secret: 'blargadeeblargblarg',
      duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
      activeDuration: 1000 * 60 * 5 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
    }))

    app.use(passport.initialize())
    app.use(passport.session())

    app.use((req, res, next) => {
      req.session.anonUserId = req.session.anonUserId || nanoid(32)
      req.context.userId = req.user ? req.user._id : req.session.anonUserId
      next()
    })

    app.use('/w/:user/:shortid*', (req, res, next) => {
      req.url = req.originalUrl.replace(`/w/${req.params.user}/${req.params.shortid}`, '') || '/'

      reporter.documentStore.collection('workspaces').findOne({shortid: req.params.shortid}).then((w) => {
        if (!w) {
          throw reporter.createError('Workspace not found', { weak: true, statusCode: 400 })
        }

        req.context.workspace = w

        if (w.userId) {
          return reporter.documentStore.collection('users').findOne({_id: w.userId}).then((u) => {
            w.user = u
          })
        }
      }).then(() => app.handle(req, res)).catch(next)
    })

    app.post('/logout', (req, res) => {
      req.logout()
      res.redirect('/')
    })

    app.get('/login/facebook', passport.authenticate('facebook'))

    app.get('/login/facebook/return',
      passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res, next) => {
        req.logIn(req.user, (err) => {
          if (err) {
            return next(err)
          }

          req.session.user = req.user

          if (!req.session.lastWorkspace) {
            return res.redirect('/')
          }

          reporter.documentStore.collection('workspaces').update({
            _id: req.session.lastWorkspace._id
          }, { $set: { userId: req.user._id } }).then(() => {
            req.session.lastWorkspace = null
            return res.redirect(`/w/${req.user.username}/${req.session.lastWorkspace.shortid}`)
          }).catch(next)
        })
      })

    app.get('/api/playground/workspace', (req, res) => {
      res.send(req.context.workspace)
    })

    app.post('/api/playground/workspace', (req, res, next) => {
      const col = reporter.documentStore.collection('workspaces')

      function persist () {
        if (req.context.workspace) {
          if (req.context.workspace.userId !== req.context.userId) {
            throw reporter.createError('You must fork')
          }

          return col.update({_id: req.context.workspace._id}, { $set: req.body }).then(() => ({...req.context.workspace, ...req.body}))
        }

        return col.insert({ shortid: nanoid(7), userId: req.context.userId, ...req.body })
      }

      persist().then((w) => {
        req.session.lastWorkspace = w
        res.send(w)
      }).catch(next)
    })

    app.get('/api/playground/user', (req, res) => {
      res.send(req.user)
    })
  })

  reporter.on('express-configure', (app) => require('./routes')(reporter, app))

  reporter.initializeListeners.add('playground', function () {
    reporter.documentStore.collection('workspaces').beforeInsertListeners.add('playground', (doc) => {
      doc.modificationDate = doc.modificationDate || new Date()
    })

    reporter.documentStore.collection('workspaces').beforeUpdateListeners.add('playground', (q, u) => (u.$set.modificationDate = new Date()))

    for (const name in reporter.documentStore.collections) {
      const col = reporter.documentStore.collections[name]

      col.beforeRemoveListeners.add('playground', col, (query, req) => {
        if (!req) {
          // some internal calls
          return
        }

        if (col.name === 'workspaces') {
          query.userId = req.context.user._id
          return
        }

        if (!req.context.workspace) {
          throw reporter.createError(`Unable to delete from ${col.name} because workspace not set.`)
        }

        if (req.context.workspace.userId !== req.context.userId) {
          throw reporter.createError(`Unable to delete from ${col.name} because user id with stored workspace doesn't match`)
        }

        query.workspaceId = req.context.workspace._id
      })

      col.beforeFindListeners.add('playground', col, (query, select, req) => {
        if (!req) {
          // some internal calls
          return
        }

        if (col.name === 'workspaces' || col.name === 'users') {
          return
        }

        // the initial empty workspace use random id and finds 0 entities
        query.workspaceId = req.context.workspace ? req.context.workspace._id : nanoid(32)

        /* if (req.context.user) {
          query.user = req.context.user.username
        } */
      })

      col.beforeInsertListeners.add('playground', col, (doc, req) => {
        if (!req) {
          // some internal calls
          return
        }

        if (!req.context.workspace) {
          throw reporter.createError(`Unable to insert ${col.name} because workspace not set.`)
        }

        doc.workspaceId = req.context.workspace._id
      })

      col.beforeUpdateListeners.add('playground', col, (query, update, opts, req) => {
        if (!req) {
          return
        }

        if (!req.context.workspace) {
          throw reporter.createError(`Unable to update ${col.name} because workspace not set.`)
        }

        if (update.$set.workspaceId && update.$set.workspaceId !== req.context.workspace._id) {
          throw reporter.createError(`Unable to set workspaceId during update`)
        }

        if (update.$set.userId && update.$set.userId !== req.context.userId) {
          throw reporter.createError(`Unable to set userId during update`)
        }

        update.$set.workspaceId = req.context.workspace._id
      })
    }
  })
}
