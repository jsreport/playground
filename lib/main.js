const nanoid = require('nanoid')
const sessions = require('client-sessions')
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const TwitterStrategy = require('passport-twitter').Strategy
const slugify = require('slugify')
const Playground = require('./playground.js')
const Promise = require('bluebird')

module.exports = function (reporter, definition) {
  const playground = Playground(reporter)

  reporter.documentStore.registerEntityType('WorkspaceType', {
    _id: { type: 'Edm.String', key: true },
    shortid: { type: 'Edm.String' },
    isPinned: { type: 'Edm.Boolean' },
    likes: { type: 'Edm.Number' },
    views: { type: 'Edm.Number' },
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

  reporter.documentStore.registerEntityType('LikeType', {
    _id: { type: 'Edm.String', key: true },
    workspaceId: { type: 'Edm.String' },
    userId: { type: 'Edm.String' }
  })

  reporter.documentStore.registerEntitySet('workspaces', { entityType: 'jsreport.WorkspaceType' })
  reporter.documentStore.registerEntitySet('users', { entityType: 'jsreport.UserType' })
  reporter.documentStore.registerEntitySet('likes', { entityType: 'jsreport.LikeType' })

  reporter.documentStore.on('before-init', (documentStore) => {
    for (const es of Object.keys(documentStore.model.entitySets)) {
      const entitySet = documentStore.model.entitySets[es]

      const entityType = documentStore.model.entityTypes[entitySet.entityType.replace(documentStore.model.namespace + '.', '')]
      entityType.workspaceId = { type: 'Edm.Number' }
    }
  })

  reporter.on('after-express-static-configure', (app) => {
    passport.use(new FacebookStrategy({
      clientID: definition.options.facebook.clientID,
      clientSecret: definition.options.facebook.clientSecret,
      callbackURL: 'http://localhost:5488/login/facebook/return'
    }, (accessToken, refreshToken, profile, cb) => {
      Promise.resolve(playground.findOrInsertUser({
        username: slugify(profile.displayName, {
          replacement: '.',
          lower: true
        }),
        fullName: profile.displayName,
        externalId: profile.id,
        provider: 'facebook'
      })).asCallback(cb)
    }))

    passport.use(new TwitterStrategy({
      consumerKey: definition.options.twitter.consumerKey,
      consumerSecret: definition.options.twitter.consumerSecret,
      callbackURL: 'http://localhost:5488/login/twitter/return'
    }, (token, tokenSecret, profile, cb) => {
      Promise.resolve(playground.findOrInsertUser({
        username: profile.username,
        fullName: profile.displayName,
        externalId: profile.id,
        provider: 'twitter'
      })).asCallback(cb)
    }))

    passport.serializeUser((user, cb) => cb(null, user._id))
    passport.deserializeUser((obj, cb) => Promise.resolve(playground.findUser({ _id: obj })).asCallback(cb))

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

      playground.findWorkspace({shortid: req.params.shortid}).then((w) => {
        if (!w) {
          throw reporter.createError('Workspace not found', { weak: true, statusCode: 400 })
        }

        req.context.workspace = w
        req.context.htmlTitle = w.name
      }).then(() => app.handle(req, res)).catch(next)
    })

    app.post('/logout', (req, res) => {
      req.logout()
      res.redirect('/')
    })

    app.get('/login/facebook', passport.authenticate('facebook'))
    app.get('/login/twitter', passport.authenticate('twitter'))

    app.get('/login/:provider/return', (req, res, next) =>
      passport.authenticate(req.params.provider, { failureRedirect: '/login' })(req, res, next), (req, res, next) => {
      req.logIn(req.user, (err) => {
        if (err) {
          return next(err)
        }

        req.session.user = req.user

        if (!req.session.lastWorkspace) {
          return res.redirect('/')
        }

        playground.changeWorkspaceOwner(req.session.lastWorkspace._id, req.user._id).then(() => {
          if (!req.session.lastWorkspace) {
            res.redirect('/')
          } else {
            res.redirect(`/w/${req.user.username}/${req.session.lastWorkspace.shortid}`)
          }
          req.session.lastWorkspace = null
        }).catch(next)
      })
    })

    app.get('/api/playground/workspace', (req, res, next) => {
      (async () => {
        if (!req.context.workspace) {
          return res.send()
        }

        await playground.loadWorkspace(req.context.workspace, req.user, req.context.userId)
        res.send(req.context.workspace)
      })().catch(next)
    })

    app.post('/api/playground/like', (req, res, next) => {
      (async () => {
        if (!req.user) {
          throw new Error('User must be logged in to create like')
        }

        if (!req.context.workspace) {
          throw new Error('Workspace not loaded')
        }

        await playground.addLike(req.context.workspace, req.user)
        res.send()
      })().catch(next)
    })

    app.delete('/api/playground/like', (req, res, next) => {
      (async () => {
        if (!req.user) {
          throw new Error('User must be logged in to delete like')
        }

        if (!req.context.workspace) {
          throw new Error('Workspace not loaded')
        }

        await playground.removeLike(req.context.workspace, req.user)
        res.send()
      })().catch(next)
    })

    app.post('/api/playground/workspace', (req, res, next) => {
      playground.saveWorkspace(req.body, req.context.workspace, req.context.userId).then((w) => {
        w = {...w, user: req.user}
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

    reporter.documentStore.collection('workspaces').beforeUpdateListeners.add('playground', (q, u) => {
      if (u.$set && !u.$set.views) {
        u.$set.modificationDate = new Date()
      }
    })

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
          if (col.name === 'settings') {
            // the workspaces was not yet created and user runs a template
            // we want to skip storing request logs
            opts.upsert = false
            query.workspaceId = nanoid(32)
            return
          }

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
