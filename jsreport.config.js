module.exports = {
  name: 'playground',
  dependencies: ['templates', 'import-export', 'express'],
  main: 'lib/main.js',
  optionsSchema: {
    extensions: {
      playground: {
        type: 'object',
        properties: {
          workspaceOpenAllEntities: {
            type: 'boolean',
            default: true
          }
        }
      }
    }
  }
}
