var q = require('q');

require("jsreport").bootstrapper()
    .configure(function(config) {
        config.set("rootDirectory", __dirname)
    })
    .start();
