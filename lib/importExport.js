
module.exports = (reporter) => {
  reporter.addRequestContextMetaConfig('workspaceImporting', { sandboxHidden: true })

  reporter.import.filteringListeners.add('playground', (req, entity) => {
    const workspace = req.context.workspace

    if (!workspace || workspace.__isInitial) {
      throw new Error('No active workspace, make sure to create and save one before trying to import')
    }

    // just for more specific message
    if (req.context.workspace.userId !== req.context.userId) {
      throw new Error('Cuurent workspace belongs to another user, you need to fork first before trying to import')
    }

    // entity has new workspace
    entity.workspaceId = workspace._id
  })

  // import processing logic for workspaces
  reporter.import.registerProcessing((originalProcess, info = {}) => {
    return async function (req, col, entity) {
      const workspace = req.context.workspace

      if (!workspace || workspace.__isInitial) {
        throw new Error('No active workspace, make sure to create and save one before trying to import')
      }

      const results = await col.find({
        _id: entity._id,
        workspaceId: workspace._id
      })

      // if the entity doesn't exists for this workspace
      // we need to generate a new _id for the entity to
      // avoid getting duplicate index error in mongodb
      if (results.length === 0) {
        entity._id = undefined

        let insertResult

        try {
          insertResult = await col.insert(entity, req)
        } catch (e) {
          const log = `Unable to insert an entity with new workspace during the import: ${e}`

          reporter.logger.warn(log)

          if (info.logs) {
            info.logs.push(log)
          }
        }

        return insertResult
      }

      if (originalProcess) {
        return originalProcess(req, col, entity)
      }
    }
  })

  reporter.importValidation.validationListeners.add('playground', (req, validationInfo) => {
    const entity = validationInfo.entity
    const workspace = req.context.workspace

    if (!workspace || workspace.__isInitial) {
      throw new Error('No active workspace, make sure to create and save one before trying to import')
    }

    // just for more specific message
    if (req.context.workspace.userId !== req.context.userId) {
      throw new Error('Cuurent workspace belongs to another user, you need to fork first before trying to import')
    }

    if (entity.workspaceId == null || entity.workspaceId !== workspace._id) {
      const fromOtherWorkspace = (
        entity.workspaceId != null &&
        entity.workspaceId !== workspace._id
      )

      validationInfo.importType = 'insert'

      validationInfo.log = `Entity insert: (${
        validationInfo.collectionName
      }) ${(entity.name || entity._id)}${fromOtherWorkspace ? ' (importing from another workspace)' : ''
      }`
    }
  })
}
