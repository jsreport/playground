process.env.extensions_workerDockerManager_discriminatorPath = 'context.clientIp'

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
