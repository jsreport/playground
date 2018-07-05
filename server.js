process.env.extensions_workerDockerManager_discriminatorPath = 'context.clientIp'

if (process.env.NODE_ENV === 'jsreport-development') {
  process.env.extensions_studio_extensionsInDevMode = require('./jsreport.config').name
}

const jsreport = require('jsreport')({
  rootDirectory: __dirname
})

if (process.env.JSREPORT_CLI) {
  // export jsreport instance to make it possible to use jsreport-cli
  module.exports = jsreport
} else {
  jsreport.__electron_html_to__ = () => { }

  jsreport.init().then(() => {
    // running
  }).catch((e) => {
    // error during startup
    console.error(e.stack)
    process.exit(1)
  })
}
