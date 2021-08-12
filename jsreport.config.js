module.exports = {
  name: 'playground',
  dependencies: ['import-export', 'express'],
  main: 'lib/main.js',
  worker: './lib/worker.js',
  optionsSchema: {
    extensions: {
      playground: {
        type: 'object',
        properties: {
          baseUrl: {
            type: 'string'
          },
          facebook: {
            type: 'object'
          },
          twitter: {
            type: 'object'
          },
          github: {
            type: 'object'
          },
          disableRouteLogging: {
            type: 'boolean',
            default: false
          },
          adminUserId: {
            type: 'string'
          },
          workspaceOpenAllEntities: {
            type: 'boolean',
            default: true
          }
        }
      }
    }
  },
  requires: {
    core: '2.x.x',
    studio: '2.x.x'
  }
}
