const winston = require('winston')
require('winston-loggly-bulk')
const packageJson = require('./package.json')
const jsreportPackageJson = require(require.resolve('jsreport/package.json'))

if (!process.env.ip && !process.env.stack) {
  console.log('Using local ip address and localdev stack')
  process.env.ip = require('ip').address()
  process.env.stack = 'localdev'
}

const REQUEST_DISCRIMINATOR = 'context.clientIp'

process.env.extensions_dockerWorkers_discriminatorPath = REQUEST_DISCRIMINATOR

if (process.env.NODE_ENV === 'jsreport-development') {
  process.env.extensions_studio_extensionsInDevMode = require('./jsreport.config').name
}

let reporter = require('jsreport')({
  rootDirectory: __dirname,
  discover: false
})

const extensionsToUse = Object.keys(jsreportPackageJson.dependencies).filter((extName) => {
  return extName !== '@jsreport/jsreport-core' && (extName.startsWith('@jsreport/jsreport-') || extName.startsWith('jsreport-'))
})

Object.keys(packageJson.dependencies).forEach((extName) => {
  if (
    (extName.startsWith('@jsreport/jsreport-') || extName.startsWith('jsreport-')) &&
    !extensionsToUse.includes(extName)
  ) {
    extensionsToUse.push(extName)
  }
})

for (const extName of extensionsToUse) {
  reporter = reporter.use(require(extName)())
}

// use playground extension
reporter.use(require('./')())

if (process.env.JSREPORT_CLI) {
  // export jsreport instance to make it possible to use jsreport-cli
  module.exports = reporter
} else {
  reporter.__electron_html_to__ = () => { }

  reporter.init().then(() => {
    // cannot use afterConfigLoaded because it is used in jsreport package
    if (reporter.options.loggly.token) {
      reporter.logger.add(new winston.transports.Loggly({
        level: reporter.options.loggly.level,
        token: reporter.options.loggly.token,
        subdomain: reporter.options.loggly.subdomain,
        json: true,
        tags: ['playground']
      }))
    }
    // running
  }).catch((e) => {
    // error during startup
    console.error(e.stack)
    process.exit(1)
  })
}
