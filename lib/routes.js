
const morgan = require('morgan')
const sessions = require('client-sessions')
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const TwitterStrategy = require('passport-twitter').Strategy
const GitHubStrategy = require('passport-github').Strategy
const slugify = require('slugify')
const ObjectId = require('mongodb').ObjectId
const pkg = require('../package.json')
const nanoid = require('nanoid')

module.exports = (reporter, definition, app) => {
  app.use('/w/:user/:shortid*', (req, res, next) => {
    req.context.workspaceRoute = req.context.workspaceRoute || { logged: false }
    next()
  })

  if (definition.options.disableRouteLogging !== true) {
    addRequestStartEndLog(app)
  }

  const playground = reporter.playground

  passport.use(new GitHubStrategy({
    clientID: definition.options.github.clientID,
    clientSecret: definition.options.github.clientSecret,
    callbackURL: (definition.options.baseUrl || 'http://localhost:5488') + '/login/github/return'
  }, (accessToken, refreshToken, profile, cb) => {
    playground.findOrInsertUser({
      username: profile.username,
      fullName: profile.displayName,
      externalId: profile.id,
      provider: 'github'
    }).then(r => cb(null, r)).catch(e => cb(e))
  }))

  passport.use(new FacebookStrategy({
    clientID: definition.options.facebook.clientID,
    clientSecret: definition.options.facebook.clientSecret,
    callbackURL: (definition.options.baseUrl || 'http://localhost:5488') + '/login/facebook/return'
  }, (accessToken, refreshToken, profile, cb) => {
    playground.findOrInsertUser({
      username: slugify(profile.displayName, {
        replacement: '.',
        lower: true
      }),
      fullName: profile.displayName,
      externalId: profile.id,
      provider: 'facebook'
    }).then(r => cb(null, r)).catch(e => cb(e))
  }))

  passport.use(new TwitterStrategy({
    consumerKey: definition.options.twitter.consumerKey,
    consumerSecret: definition.options.twitter.consumerSecret,
    callbackURL: (definition.options.baseUrl || 'http://localhost:5488') + '/login/twitter/return'
  }, (token, tokenSecret, profile, cb) => {
    playground.findOrInsertUser({
      username: profile.username,
      fullName: profile.displayName,
      externalId: profile.id,
      provider: 'twitter'
    }).then(r => cb(null, r)).catch(e => cb(e))
  }))

  passport.serializeUser((user, cb) => cb(null, user._id))
  passport.deserializeUser((obj, cb) => {
    playground.findUser({ _id: obj }).then(r => cb(null, r)).catch(e => cb(e))
  })

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
    req.session.anonUserId = req.session.anonUserId || new ObjectId()
    req.context.userId = req.user ? req.user._id : req.session.anonUserId
    next()
  })

  app.use('/w/:user/:shortid*', (req, res, next) => {
    const shortid = req.params.shortid.indexOf('?') === -1 ? req.params.shortid : req.params.shortid.slice(0, req.params.shortid.indexOf('?'))
    const unmodifiedOriginalUrl = req.originalUrl

    // we remove the /w/anon/shortid from the url and forward to process the rest
    // we can't use req.param.shortid for matching what to remove, because it contains url decoded values like %7E which gets decoded into ~
    // wrong replace leads to infinite loop and OOM!
    req.url = req.originalUrl.replace(/\/w\/[^/]+\/[^/?#]+/, '') || '/'

    req.url = req.url[0] !== '/' ? `/${req.url}` : req.url

    // avoid endless loop for w/anon/jFQ~ECFR/w/anon/jFQ~ECFR
    req.originalUrl = req.url
    // req.originalUrl is always req.baseUrl + req.url so we normalize the .baseUrl here too
    req.baseUrl = ''

    playground.findWorkspace({ shortid: shortid }).then((w) => {
      if (!w) {
        return res.status(404).send(`
        <html>
        <head>
          <title>Workspace Not Found</title>
        </head>
        <body>
          <h1>Workspace Not Found</h1>
          <p>Sorry, but the workspace you were trying to view does not exist.</p>
          <p><a href='https://playground.jsreport.net'>open playground dashboard</a></p>
        </body>
        </html>
        `)
      }

      req.context.http = req.context.http || {}
      req.context.http.baseUrl = `${req.protocol}://${req.get('host')}/w/${req.params.user}/${shortid}`
      req.context.workspace = w
      req.context.workspaceRoute.url = unmodifiedOriginalUrl
      req.context.htmlTitle = w.name === 'untitled' ? 'jsreport playground' : w.name

      app.handle(req, res)
    }).catch(next)
  })

  app.use((req, res, next) => {
    if (!req.context.workspace) {
      // there is always a single current workspace for session
      // if the workspace was not yet created, we use this "stub"
      // which lives just in session until it is saved by user
      req.context.workspace = req.session.workspace = req.session.workspace || {
        _id: new ObjectId(),
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

  app.post('/account/delete', async (req, res, next) => {
    if (!req.user) {
      return res.status(401).end('This action requires user to be authenticated')
    }

    try {
      await playground.deleteUser(req.user._id)

      req.session.lastWorkspace = null
      req.logout()
      res.redirect('/')
    } catch (error) {
      next(error)
    }
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
    res.send(pkg.version)
  })
}

function addRequestStartEndLog (app) {
  app.use((req, res, next) => {
    req.id = req.id || nanoid()
    next()
  })

  morgan.token('id', (req) => req.id)

  morgan.token('currentUrl', (req) => {
    if (req.context && req.context.workspaceRoute != null) {
      return req.context.workspaceRoute.url
    }

    return req.url
  })

  morgan.token('workspace', (req, res) => {
    if (req.context.workspace) {
      if (req.context.workspace.__isInitial) {
        return `${req.context.workspace._id}(initial)`
      } else {
        return req.context.workspace._id
      }
    }

    return '<none>'
  })

  // middleware to log request start/end into process.stdout
  const morganSkip = (end) => (req, res) => {
    if (req.url.endsWith('/__webpack_hmr') || req.url.endsWith('/favicon.ico')) {
      return true
    } else if (req.context.workspaceRoute != null) {
      // the logic here prevents duplicated logs for morgan logs
      // when workspace routes are hit
      const wasRewrote = Object.prototype.hasOwnProperty.call(req.context.workspaceRoute, 'url')

      if (!wasRewrote) {
        return true
      }

      if (!end) {
        return false
      }

      const willSkip = Boolean(req.context.workspaceRoute.logged)

      if (!willSkip) {
        req.context.workspaceRoute.logged = true
      }

      return willSkip
    }
  }

  app.use(morgan(':id :method :currentUrl w=:workspace d=:date[iso] START', {
    immediate: true,
    skip: morganSkip(),
    stream: process.stdout
  }))

  app.use(morgan(':id :method :currentUrl w=:workspace d=:date[iso] status=:status time=:response-time ms END', {
    skip: morganSkip(true),
    stream: process.stdout
  }))
}
