
const sessions = require('client-sessions')
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const TwitterStrategy = require('passport-twitter').Strategy
const slugify = require('slugify')
const Promise = require('bluebird')
const nanoid = require('nanoid')

module.exports = (reporter, definition, app) => {
  const playground = reporter.playground

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

  app.post('/api/playground/workspace', async (req, res, next) => {
    try {
      let w = await playground.saveWorkspace(req.body, req.context.workspace, req.context.userId)
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

  app.get('/api/playground/workspaces/:type/:pageNumber', async (req, res, next) => {
    try {
      const ws = await playground.listWorkspaces(req.params.type, req.params.pageNumber, req.context.userId)
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
}
