process.env.NODE_ENV = 'production'

var path = require('path')
var jsreport = require('jsreport')({ tempDirectory: path.join(__dirname, 'temp')})


jsreport.init().then(function () {
  console.log('running')

  // doing a first render in electron-pdf recipe to "warm-up" the process
  // since starting our electron process on single core windows takes 100% CPU,
  // this render is just to prevent other users experimenting a blocking render
  console.log('doing a first render on electron-pdf recipe..')

  jsreport.render({
	template: {
	  content: "hi",
	  engine: "handlebars",
	  recipe: "electron-pdf",
	  workspaceShortid: 'HJVhE0QP',
	  workspaceVersion: 804
	},
	headers: {}
  }).then(function() {
	console.log('first render in electron-pdf recipe ended successfully')
  }).catch(function(err) {
	console.log('first render in electron-pdf recipe has an error:', err.message)
  })
}).catch(function (e) {
  console.error(e)
})
