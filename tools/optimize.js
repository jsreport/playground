var path = require('path')
var fs = require('fs')
var requirejs = require('requirejs')

var cwd = process.cwd()

var commonPath = {
  jquery: 'empty:',
  marionette: 'empty:',
  async: 'empty:',
  underscore: 'empty:',
  toastr: 'empty:',
  deferred: 'empty:',
  app: 'empty:',
  backbone: 'empty:',
  ace: 'empty:',
  introJs: 'empty:',
  'ace/ace': 'empty:',
  'core/basicModel': 'empty:',
  'core/aceBinder': 'empty:',
  'core/view.base': 'empty:',
  'core/dataGrid': 'empty:',
  'jsrender.bootstrap': 'empty:',
  'core/utils': 'empty:',
  'core/listenerCollection': 'empty:'
}

var extensions = ['data-playground', 'images-playground', 'scripts-playground', 'templates-playground'];

if (fs.existsSync(path.join(cwd, 'public/js/main_dev.js'))) {
  var options = {
    paths: commonPath,
    baseUrl: path.join(cwd, 'public/js'),
    out: path.join(cwd, '/public/js/main.js'),
    optimize: 'none',
    name: 'main_dev',
    onBuildWrite: function (moduleName, path, contents) {
      var regExp = new RegExp('\"[.]/', 'g')
      return contents.replace("define('main_dev',", 'define(').replace(regExp, '\"')
    }
  }

  requirejs.optimize(options)
}
