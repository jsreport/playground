var q = require('q'),
    path = require('path');

var options = {
    rootDirectory : require("path").join(__dirname),
    pathToExampleConfig: path.join(__dirname, "example.config.json")
};


require("jsreport").bootstrapper(options).start();
