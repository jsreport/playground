
const sessions = require('client-sessions')
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const TwitterStrategy = require('passport-twitter').Strategy
const GitHubStrategy = require('passport-github').Strategy
const slugify = require('slugify')
const Promise = require('bluebird')
const ObjectID = require('mongodb').ObjectID

module.exports = (reporter, definition, app) => {
  const playground = reporter.playground

  reporter.addRequestContextMetaConfig('userId', { sandboxReadOnly: true })
  reporter.addRequestContextMetaConfig('clientIp', { sandboxHidden: true })
  reporter.addRequestContextMetaConfig('workspace', { sandboxReadOnly: true })

  passport.use(new GitHubStrategy({
    clientID: definition.options.github.clientID,
    clientSecret: definition.options.github.clientSecret,
    callbackURL: (definition.options.baseUrl || 'http://localhost:5488') + '/login/github/return'
  }, (accessToken, refreshToken, profile, cb) => {
    Promise.resolve(playground.findOrInsertUser({
      username: profile.username,
      fullName: profile.displayName,
      externalId: profile.id,
      provider: 'github'
    })).asCallback(cb)
  }))

  passport.use(new FacebookStrategy({
    clientID: definition.options.facebook.clientID,
    clientSecret: definition.options.facebook.clientSecret,
    callbackURL: (definition.options.baseUrl || 'http://localhost:5488') + '/login/facebook/return'
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
    callbackURL: (definition.options.baseUrl || 'http://localhost:5488') + '/login/twitter/return'
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
    duration: 24 * 60 * 60 * 1000,
    activeDuration: 1000 * 60 * 5
  }))

  app.use(passport.initialize())
  app.use(passport.session())

  // support old links
  app.get('/studio/workspace/:shortid/:version', (req, res, next) => {
    // attach also ?embed=1
    const queryParts = req.url.split('?')
    const query = queryParts.length === 2 ? '?' + queryParts[1] : ''
    res.redirect(`/w/anon/${req.params.shortid}-${req.params.version}${query}`)
  })

  app.use((req, res, next) => {
    req.session.anonUserId = req.session.anonUserId || new ObjectID()
    req.context.userId = req.user ? req.user._id : req.session.anonUserId
    next()
  })

  app.use('/w/:user/:shortid*', (req, res, next) => {
    const shortid = req.params.shortid.indexOf('?') === -1 ? req.params.shortid : req.params.shortid.slice(0, req.params.shortid.indexOf('?'))

    req.url = req.originalUrl.replace(`/w/${req.params.user}/${req.params.shortid}`, '') || '/'
    req.url = req.url[0] !== '/' ? `/${req.url}` : req.url

    // studio for some reason always redirect to url ending with /
    // this is workaround to avoid unnecesary redirects which could be bad for SEO
    if (req.url === '/' && !req.originalUrl.endsWith('/')) {
      req.originalUrl += '/'
    }

    playground.findWorkspace({shortid: shortid}).then((w) => {
      if (!w) {
        throw reporter.createError('Workspace not found', { weak: true, statusCode: 400 })
      }

      req.context.workspace = w
      req.context.htmlTitle = w.name === 'untitled' ? 'jsreport playground' : w.name
    }).then(() => app.handle(req, res)).catch(next)
  })

  app.use((req, res, next) => {
    if (!req.context.workspace) {
      // there is always a single current workspace for session
      // if the workspace was not yet created, we use this "stub"
      // which lives just in session until it is saved by user
      req.context.workspace = req.session.workspace = req.session.workspace || {
        _id: new ObjectID(),
        __isInitial: true,
        userId: req.context.userId
      }
    }

    next()
  })

  app.post('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })

  app.get('/login/facebook', passport.authenticate('facebook'))
  app.get('/login/twitter', passport.authenticate('twitter'))
  app.get('/login/github', passport.authenticate('github'))

  app.get('/login/:provider/return', (req, res, next) =>
    passport.authenticate(req.params.provider, { failureRedirect: '/' })(req, res, next), (req, res, next) => {
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
      if (!req.context.workspace || req.context.workspace.__isInitial) {
        return res.send(req.context.workspace)
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

  app.post('/api/playground/workspace', async (req, res, next) => {
    try {
      req.session.workspace = null
      let w = await playground.saveWorkspace(req.body, req.context.workspace, req.context.userId, req.context.userId === req.session.anonUserId)
      w = await playground.loadWorkspace(w, req.user, req.context.userId)
      req.session.lastWorkspace = w
      res.send(w)
    } catch (e) {
      next(e)
    }
  })

  app.get('/api/playground/user', (req, res) => {
    res.send(req.user)
  })

  app.delete('/api/playground/workspaces/:workspaceId/remove', async (req, res, next) => {
    try {
      const workspaceId = req.params.workspaceId

      if (!req.user) {
        throw new Error('User must be logged in to remove workspace')
      }

      if (req.context.workspace && req.context.workspace._id === workspaceId) {
        req.session.workspace = null
      }

      await playground.removeWorkspace(workspaceId, req.user._id)

      res.end()
    } catch (e) {
      next(e)
    }
  })

  app.get('/api/playground/workspaces/popular', async (req, res, next) => {
    try {
      const ws = await playground.listPopularWorkspaces()
      res.send(ws)
    } catch (e) {
      next(e)
    }
  })

  app.get('/api/playground/workspaces/examples', async (req, res, next) => {
    try {
      const ws = await playground.listUserWorkspaces(definition.options.adminUserId)
      res.send(ws)
    } catch (e) {
      next(e)
    }
  })

  app.get('/api/playground/workspaces/user/:userId', async (req, res, next) => {
    try {
      const ws = await playground.listUserWorkspaces(req.params.userId)
      res.send(ws)
    } catch (e) {
      next(e)
    }
  })

  app.get('/api/playground/search', async (req, res, next) => {
    try {
      const ws = await playground.searchWorkspaces(decodeURIComponent(req.query.q))
      res.send(ws)
    } catch (e) {
      next(e)
    }
  })

  app.get('/version', (req, res) => {
    res.send(require('../package.json').version)
  })
}
