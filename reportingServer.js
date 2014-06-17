/*! 
 * Copyright(c) 2014 Jan Blaha 
 *
 * expressjs server wrapping Reporter.
 */

var path = require("path"),
    express = require('express'),
    _ = require("underscore"),
    winston = require("winston"),
    expressWinston = require("express-winston"),
    http = require('http'),
    https = require('https'),
    join = require("path").join,
    fs = require("fs"),
    Q = require("q"),
    Reporter = require("jsreport").Reporter;


/**
 * Create reporting server based on configuration
 * @param {object} config see config.json
 */

var ReportingServer = function (config) {
    this.config = config;
    Q.longStackSupport = true;
};

ReportingServer.prototype._initReporter = function (app, cb) {
    this.config.express = { app: app };
    (new Reporter(this.config)).init().then(cb);
};

ReportingServer.prototype.start = function () {
    if (!fs.existsSync(path.join(this.config.rootDirectory, "data"))) {
        fs.mkdir(path.join(this.config.rootDirectory, "data"));
    }

    var app = express();

    app.use(require("body-parser")({
        limit: 2 * 1024 * 1024 * 1//2MB
    }));

    app.use(require("method-override")());
    app.use(require("connect-multiparty")());

    if (!winston.loggers.has("jsreport")) {
        var transportSettings = {
            timestamp: true,
            colorize: true,
            level: "debug"
        };

        if (!fs.existsSync("logs")) {
            fs.mkdir("logs");
        }

        var consoleTransport = new (winston.transports.Console)(transportSettings);
        var fileTransport = new (winston.transports.File)({ name: "main", filename: 'logs/reporter.log', maxsize: 10485760, json: false, level: "debug" });
        var errorFileTransport = new (winston.transports.File)({ name: "error", level: 'error', filename: 'logs/error.log', handleExceptions: true, json: false });

        winston.loggers.add('jsreport', {
            transports: [consoleTransport, fileTransport, errorFileTransport]
        });
    }

    var self = this;
    this._initReporter(app, function () {

        if (self.config.iisnode) {
            app.listen(self.config.port || process.env.PORT);
            return;
        }

        var credentials = {
            key: fs.readFileSync(join(self.config.rootDirectory, self.config.certificate.key), 'utf8'),
            cert: fs.readFileSync(join(self.config.rootDirectory, self.config.certificate.cert), 'utf8'),
            rejectUnauthorized: false //support invalid certificates
        };

        https.createServer(credentials, app).listen(self.config.port);
    });
};

module.exports = ReportingServer;
