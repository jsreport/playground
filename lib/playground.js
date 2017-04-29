var refererMatcher = /\/studio\/workspace\/(.*)\/(.*)/

module.exports = function (reporter, definition) {
  reporter.documentStore.registerEntityType('ErrorLogType', {
    _id: { type: 'Edm.String', key: true },
    creationDate: { type: 'Edm.DateTimeOffset' },
    message: { type: 'Edm.String' },
    url: { type: 'Edm.String' }
  })

  reporter.documentStore.registerEntitySet('errors', { entityType: 'jsreport.ErrorLogType' })

  reporter.documentStore.registerEntityType('WorskpaceType', {
    _id: { type: 'Edm.String', key: true },
    shortid: { type: 'Edm.String' },
    creationDate: { type: 'Edm.DateTimeOffset' },
    default: { type: 'Edm.String' },
    version: { type: 'Edm.Number' },
    name: { type: 'Edm.String' }
  })

  reporter.documentStore.registerEntitySet('workspaces', { entityType: 'jsreport.WorskpaceType' })

  reporter.documentStore.on('before-init', function (documentStore) {
    for (var key in documentStore.model.entitySets) {
      var entitySet = documentStore.model.entitySets[key]
      if (entitySet.shared) {
        continue
      }

      var entityType = documentStore.model.entityTypes[entitySet.entityType.replace(documentStore.model.namespace + '.', '')]

      entityType.worskpaceShortid = { type: 'Edm.String' }
      entityType.workspaceVersion = { type: 'Edm.Number' }
    }
  })

  reporter.on('express-configure', function (app) {
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
  })

  // fix pagetopdf.com because it is sending just phantom url
  reporter.beforeRenderListeners.insert({ before: 'templates' }, 'playground', function (req) {
    if (req.template && req.template.phantom && req.template.phantom.url) {
      req.template.content = ' '
      req.template.engine = req.template.engine || 'none'
    }
  })

  reporter.initializeListeners.add('playground', function () {
    reporter.documentStore.collections.workspaces.beforeInsertListeners.add('playground', this, function (doc, req) {
      return reporter.documentStore.collections.workspaces.find({ shortid: doc.shortid }).then(function (docs) {
        var max = 1
        docs.forEach(function (d) {
          max = Math.max(max, d.version)
        })
        doc.version = max + 1
      })
    })

    reporter.documentStore.collection('errors').beforeInsertListeners.add('playground', function (doc) {
      doc.creationDate = doc.creationDate || new Date()
    })

    reporter.documentStore.collection('workspaces').beforeInsertListeners.add('playground', function (doc) {
      doc.creationDate = doc.creationDate || new Date()
    })

    for (var key in reporter.documentStore.collections) {
      var col = reporter.documentStore.collections[key]

      col.beforeRemoveListeners.add('playground', col, function (query, req) {
        throw new Error('DELETE is not supported in playground')
      })

      if (col.entitySet.shared || col.entitySet === 'workspaces' || col.entitySet === 'templates') {
        continue
      }

      col.beforeFindListeners.add('playground', col, function (query, req) {
        if (req && req.template && req.template.workspaceShortid) {
          query.workspaceShortid = req.template.workspaceShortid
          query.workspaceVersion = parseInt(req.template.workspaceVersion)
        }

        if (this.name === 'workspaces' || query.workspaceShortid || query._id || query.shortid) {
          return
        }

        if (query.$and && query.$and.length > 0 && query.$and.find((e) => e.workspaceShortid)) {
          return
        }

        if (req.headers.referer) {
          var match = refererMatcher.exec(req.headers.referer)

          // searches from for global scripts and helpers won't work, we just return empty array
          if (!match && (query.isGlobal || query.isSharedHelper)) {
            query.isGlobal = 'invalid'
            query.isSharedHelper = 'invalid'
            return
          }

          // get worskpace id from the browser url
          if (match.length > 2) {
            query.workspaceShortid = match[1]
            query.workspaceVersion = parseInt(match[2])
            return
          }
        }

        throw new Error('global queries are not supported in playground')
      })

      col.beforeInsertListeners.add('playground', col, function (doc, req) {
        if (req && req.headers && req.headers['workspace-shortid']) {
          doc.workspaceShortid = req.headers['workspace-shortid']
          doc.workspaceVersion = parseInt(req.headers['workspace-version'])
        }
      })

      col.beforeUpdateListeners.add('playground', col, function (query, update, req) {
        throw new Error('Update is not supported in playground')
      })
    }

    reporter.afterRenderListeners.add('playground', function (req, res) {
      if (res.headers['Content-Type'] === 'text/html') {
        res.content = Buffer.from(res.content.toString().replace(/http:\/\/localhost:2500/g, 'https://playground.jsreport.net'))
      }
    })
  })
}
