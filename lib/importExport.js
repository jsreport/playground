
module.exports = (reporter) => {
  reporter.addRequestContextMetaConfig('workspaceImporting', { sandboxHidden: true })

  reporter.importValidation.beforeEntityValidationListeners.add('playground', (req, validationInfo) => {
    const entity = validationInfo.entity
    const workspace = req.context.workspace

    if (!workspace || workspace.__isInitial) {
      throw new Error('No active workspace, make sure to create and save one before trying to import')
    }

    // just for more specific message
    if (req.context.workspace.userId !== req.context.userId) {
      throw new Error('Current workspace belongs to another user, you need to fork first before trying to import')
    }

    if (entity.workspaceId == null || entity.workspaceId !== workspace._id) {
      const fromOtherWorkspace = (
        entity.workspaceId != null &&
        entity.workspaceId !== workspace._id
      )

      validationInfo.log = `Entity ${validationInfo.importType}: (${
        validationInfo.collectionName
      }) ${validationInfo.nameDisplay}${fromOtherWorkspace ? ' (importing from another workspace)' : ''
      }`
    }
  })

  reporter.import.beforeEntityPersistedListeners.add('playground', (req, entity) => {
    const workspace = req.context.workspace

    if (!workspace || workspace.__isInitial) {
      throw new Error('No active workspace, make sure to create and save one before trying to import')
    }

    // just for more specific message
    if (req.context.workspace.userId !== req.context.userId) {
      throw new Error('Current workspace belongs to another user, you need to fork first before trying to import')
    }

    // entity has new workspace
    entity.workspaceId = workspace._id
  })
}
