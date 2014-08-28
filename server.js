var path = require('path');

require("jsreport").bootstrapper({
    rootDirectory : require("path").join(__dirname)
}).start();
