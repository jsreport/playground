const Playground = require('./playground.js')
const routes = require('./routes')

module.exports = function (reporter, definition) {
  reporter.playground = Playground(reporter)

  reporter.documentStore.registerEntityType('WorkspaceType', {
    _id: { type: 'Edm.String', key: true },
    shortid: { type: 'Edm.String' },
    isPinned: { type: 'Edm.Boolean' },
    likes: { type: 'Edm.Number' },
    views: { type: 'Edm.Number' },
    default: { type: 'Edm.String' },
    name: { type: 'Edm.String' },
    description: { type: 'Edm.String' },
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

  // reporter.on('after-express-static-configure', (app) => routes(reporter, definition, app))
  reporter.on('express-before-odata', (app) => routes(reporter, definition, app))

  reporter.initializeListeners.add('playground', async () => {
    if (reporter.options.store.provider === 'mongodb') {
      await reporter.documentStore.provider.db.collection('workspaces').createIndex({name: 'text', description: 'text'})
    }

    reporter.documentStore.collection('workspaces').beforeInsertListeners.add('playground', (doc) => {
      doc.modificationDate = doc.modificationDate || new Date()
    })

    reporter.documentStore.collection('workspaces').beforeUpdateListeners.add('playground', (q, u) => {
      if (u.$set && !u.$set.views) {
        u.$set.modificationDate = new Date()
      }
    })

    // listeners securing access just to current workspace entities
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

        if (col.name === 'workspaces') {
          reporter.createError('Workspaces queries not supported')
        }

        if (col.name === 'users') {
          reporter.createError('Users queries not supported')
        }

        query.workspaceId = req.context.workspace._id
      })

      col.beforeInsertListeners.add('playground', col, (doc, req) => {
        if (!req) {
          // some internal calls
          return
        }

        doc.workspaceId = req.context.workspace._id
      })

      col.beforeUpdateListeners.add('playground', col, (query, update, opts, req) => {
        if (!req) {
          return
        }

        if (update.$set.workspaceId && update.$set.workspaceId !== req.context.workspace._id) {
          throw reporter.createError(`Unable to set workspaceId during update`)
        }

        if (update.$set.userId && update.$set.userId !== req.context.userId) {
          throw reporter.createError(`Unable to set userId during update`)
        }

        query.workspaceId = req.context.workspace._id
        update.$set.workspaceId = req.context.workspace._id
      })
    }
  })
}
