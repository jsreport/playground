
module.exports = (reporter, definition) => {
  reporter.addRequestContextMetaConfig('userId', { sandboxReadOnly: true })
  reporter.addRequestContextMetaConfig('clientIp', { sandboxHidden: true })
  reporter.addRequestContextMetaConfig('workspace', { sandboxReadOnly: true })
  reporter.addRequestContextMetaConfig('workspaceImporting', { sandboxHidden: true })
}
