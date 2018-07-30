const Playground = require('./playground.js')
const importExport = require('./importExport')
const routes = require('./routes')

module.exports = function (reporter, definition) {
  reporter.playground = Playground(reporter)

  reporter.documentStore.registerEntityType('WorkspaceType', {
    _id: { type: 'Edm.String', key: true },
    shortid: { type: 'Edm.String' },
    isPinned: { type: 'Edm.Boolean' },
    likes: { type: 'Edm.Int32' },
    views: { type: 'Edm.Int32' },
    default: { type: 'Edm.String' },
    name: { type: 'Edm.String' },
    description: { type: 'Edm.String' },
    userId: { type: 'Edm.String' },
    modificationDate: { type: 'Edm.DateTimeOffset' },
    lastVisitDate: { type: 'Edm.DateTimeOffset' }
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

  reporter.documentStore.registerEntitySet('workspaces', { entityType: 'jsreport.WorkspaceType', internal: true })
  reporter.documentStore.registerEntitySet('likes', { entityType: 'jsreport.LikeType', internal: true })
  reporter.documentStore.registerEntitySet('users', { entityType: 'jsreport.UserType', internal: true })

  importExport(reporter)

  reporter.documentStore.on('before-init', (documentStore) => {
    for (const es of Object.keys(documentStore.model.entitySets)) {
      const entitySet = documentStore.model.entitySets[es]

      const entityType = documentStore.model.entityTypes[entitySet.entityType.replace(documentStore.model.namespace + '.', '')]
      entityType.workspaceId = { type: 'Edm.String' }
    }
  })

  reporter.on('before-express-configure', (app) => {
    app.enable('trust proxy')

    app.use((req, res, next) => {
      if (!req.context.clientIp) {
        req.context.clientIp = req.ip
      }

      if (!req.context.htmlTitle) {
        req.context.htmlTitle = `jsreport playground ${reporter.version}`
      }

      next()
    })
  })

  // reporter.on('after-express-static-configure', (app) => routes(reporter, definition, app))
  reporter.on('express-before-odata', (app) => routes(reporter, definition, app))

  reporter.initializeListeners.add('playground', async () => {
    if (reporter.options.store.provider === 'mongodb') {
      reporter.logger.debug(`Creating workspace indexes`)
      await Promise.all([
        reporter.documentStore.provider.db.collection('workspaces').createIndex({name: 'text', description: 'text'}),
        reporter.documentStore.provider.db.collection('workspaces').createIndex({userId: 1}),
        reporter.documentStore.provider.db.collection('workspaces').createIndex({likes: -1})
      ])

      reporter.logger.debug(`Creating entities indexes`)
      const entities = ['assets', 'data', 'scripts', 'templates', 'xlsxTemplates', 'versions']
      await Promise.all(entities.map((c) => reporter.documentStore.provider.db.collection(c).createIndex({workspaceId: 1})))
    }

    reporter.documentStore.internalCollection('workspaces').beforeInsertListeners.add('playground', (doc) => {
      doc.modificationDate = doc.modificationDate || new Date()
    })

    reporter.documentStore.internalCollection('workspaces').beforeUpdateListeners.add('playground', (q, u) => {
      if (u.$set && !u.$set.views) {
        u.$set.modificationDate = new Date()
      }
    })

    const generalRemoveListener = (col) => (query, req) => {
      if (!req) {
        // some internal calls
        return
      }

      if (req.context.workspace.userId !== req.context.userId) {
        throw reporter.createError(`Unable delete from ${col.name}, you need to fork first.`)
      }

      query.workspaceId = req.context.workspace._id
    }

    const generalFindListener = (col) => (query, select, req) => {
      if (!req) {
        // some internal calls
        return
      }

      query.workspaceId = req.context.workspace._id
    }

    const generalInsertListener = (col) => (doc, req) => {
      if (!req) {
        // some internal calls
        return
      }

      if (!req.context.workspace) {
        throw reporter.createError(`Unable to insert ${col.name} because workspace not set.`)
      }

      if (req.context.workspace.userId !== req.context.userId) {
        throw reporter.createError(`Unable insert into ${col.name}, you need to fork first.`)
      }

      doc.workspaceId = req.context.workspace._id
    }

    const generalUpdateListener = (col) => (query, update, opts, req) => {
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

      // we allow settings to be updated without fork since it gets updated after each render.
      // if it is now allowed, the render fails in the end with error about not being
      // able to update before it needs to fork first
      if (
        req.context.workspace.userId !== req.context.userId &&
        col.name !== 'settings'
      ) {
        throw reporter.createError(`Unable update ${col.name}, you need to fork first.`)
      }

      query.workspaceId = req.context.workspace._id
      update.$set.workspaceId = req.context.workspace._id
    }

    // listeners securing access just to current workspace entities
    for (const name in reporter.documentStore.collections) {
      const col = reporter.documentStore.collections[name]

      col.beforeRemoveListeners.add('playground', col, generalRemoveListener(col))

      col.beforeFindListeners.add('playground', col, generalFindListener(col))

      col.beforeInsertListeners.add('playground', col, generalInsertListener(col))

      col.beforeUpdateListeners.add('playground', col, generalUpdateListener(col))
    }

    reporter.documentStore.internalCollection('workspaces').beforeRemoveListeners.add(
      'playground',
      reporter.documentStore.internalCollection('workspaces'),
      (query, req) => {
        if (!req) {
          // some internal calls
          return
        }

        query.userId = req.context.user._id
      }
    )

    reporter.documentStore.internalCollection('likes').beforeRemoveListeners.add(
      'playground',
      reporter.documentStore.internalCollection('likes'),
      generalRemoveListener(reporter.documentStore.internalCollection('likes'))
    )

    reporter.documentStore.internalCollection('likes').beforeFindListeners.add(
      'playground',
      reporter.documentStore.internalCollection('likes'),
      generalFindListener(reporter.documentStore.internalCollection('likes'))
    )

    reporter.documentStore.internalCollection('likes').beforeInsertListeners.add(
      'playground',
      reporter.documentStore.internalCollection('likes'),
      generalInsertListener(reporter.documentStore.internalCollection('likes'))
    )

    reporter.documentStore.internalCollection('likes').beforeUpdateListeners.add(
      'playground',
      reporter.documentStore.internalCollection('likes'),
      generalUpdateListener(reporter.documentStore.internalCollection('likes'))
    )
  })
}
