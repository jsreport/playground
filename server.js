const winston = require('winston')
require('winston-loggly')

if (!process.env.ip && !process.env.stack) {
  console.log('Using local ip address and localdev stack')
  process.env.ip = require('ip').address()
  process.env.stack = 'localdev'
}

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
    // cannot use afterConfigLoaded because it is used in jsreport package
    if (jsreport.options.loggly.token) {
      jsreport.logger.add(winston.transports.Loggly, {
        level: jsreport.options.loggly.level,
        token: jsreport.options.loggly.token,
        subdomain: jsreport.options.loggly.subdomain,
        json: true,
        tags: ['playground']
      })
    }
    // running
  }).catch((e) => {
    // error during startup
    console.error(e.stack)
    process.exit(1)
  })
}
