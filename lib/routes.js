
module.exports = (reporter, app) => {
  app.get('/workspace/:shortid/:version', function (req, res, next) {
    reporter.documentStore.collection('workspaces').find({
      shortid: req.params.shortid,
      version: parseInt(req.params.version)
    }).then(function (workspaces) {
      if (workspaces.length !== 1) {
        throw new Error('Workspace not found')
      }

      if (!workspaces[0].default) {
        throw new Error('Workspace must have default template')
      }

      req.template = {
        workspaceVersion: req.params.version,
        workspaceShortid: req.params.shortid,
        shortid: workspaces[0].default
      }

      return reporter.render(req).then(function (response) {
        if (response.headers) {
          for (var key in response.headers) {
            if (response.headers.hasOwnProperty(key)) {
              res.setHeader(key, response.headers[key])
            }
          }
        }
        response.stream.pipe(res)
      })
    }).catch(function (e) {
      next(e)
    })
  })
}
