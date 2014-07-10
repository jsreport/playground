var q = require('q'),
    path = require('path');

require("jsreport").bootstrapper({ pathToExampleConfig: path.join(__dirname, "example.config.json") })
    .configure(function (config) {
        config.set("rootDirectory", __dirname)
    }).start();
