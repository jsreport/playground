var ReportingServer = require("./reportingServer");

function getConfigFile() {
    if (process.env.NODE_ENV === "production")
        return "./prod.config.json";

    if (process.env.NODE_ENV === "test")
        return "./test.config.json";

    return "./dev.config.json";
}

var config = require(getConfigFile());
config.rootDirectory = __dirname;
config.NODE_ENV = process.env.NODE_ENV;
config.extensionsManager = {
    supportsUnregistration : false
};
new ReportingServer(config).start(function(err){
    if (!!err) console.error("Error starting application with:",err);
});