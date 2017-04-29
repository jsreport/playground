process.env.NODE_ENV = 'production'

var path = require('path')
var jsreport = require('jsreport')({tempDirectory: path.join(__dirname, 'temp')})

jsreport.init().then(function () {
  console.log('running')
}).catch(function (e) {
  console.error(e)
})
