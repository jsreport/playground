/*! 
 * Copyright(c) 2014 Jan Blaha 
 *
 * Examples extension is creating some sample report templates on the startup.
 */

var join = require("path").join,
    fs = require("fs"),
    Q = require("q");

module.exports = function (reporter, definition) {
    reporter[definition.name] = new Examples(reporter, definition);
};

Examples = function (reporter, definition) {
    var self = this;
    this.reporter = reporter;

    reporter.templates.TemplateType.addMember("isExample", { type: $data.Boolean });

    this.reporter.initializeListener.add(definition.name, this, Examples.prototype.createExamples.bind(this));
};

Examples.prototype.createExamples = function () {
    this.reporter.logger.info("Initializing examples.");
    var self = this;


    function helloWorld(context) {
        return self.reporter.templates.create(context, {
            name: "1. Hello World",
            content: fs.readFileSync(join(__dirname, 'examples/helloFib.html')).toString("utf8"),
            helpers: fs.readFileSync(join(__dirname, 'examples/helloFib.js')).toString("utf8"),
            engine: "jsrender",
            recipe: "html",
            isExample: true
        });
    }

    function phantomPdf(context) {
        return self.reporter.templates.create(context, {
            name: "2. Hello World Phantom Pdf",
            content: fs.readFileSync(join(__dirname, 'examples/helloPhantom.html')).toString("utf8"),
            helpers: fs.readFileSync(join(__dirname, 'examples/helloFib.js')).toString("utf8"),
            engine: "jsrender",
            recipe: "phantom-pdf",
            isExample: true
        });
    }

    function fop(context) {
        return self.reporter.templates.create(context, {
            name: "3. Hello World FOP Pdf",
            content: fs.readFileSync(join(__dirname, 'examples/helloWorld.xml')).toString("utf8"),
            helpers: fs.readFileSync(join(__dirname, 'examples/helloFib.js')).toString("utf8"),
            engine: "jsrender",
            recipe: "fop-pdf",
            isExample: true
        });
    }

    function script(context) {
        var templateObj = {
            name: "4. Scripts extension",
            content: fs.readFileSync(join(__dirname, 'examples/complexScript.html')).toString("utf8"),
            engine: "jsrender",
            recipe: "phantom-pdf",
            isExample: true,
            script: {
                content: fs.readFileSync(join(__dirname, 'examples/complexScript.js')).toString("utf8")
            }
        };

        return self.reporter.templates.create(context, templateObj);
    }

    function data(context) {
        var templateObj = {
            name: "5. Inline Data extension",
            content: fs.readFileSync(join(__dirname, 'examples/inlineData.html')).toString("utf8"),
            engine: "jsrender",
            recipe: "html",
            isExample: true,
            dataItem: {
                dataJson: fs.readFileSync(join(__dirname, 'examples/inlineData.json')).toString("utf8")
            }
        };

        return self.reporter.templates.create(context, templateObj);
    }

    function invoice(context) {
        var templateObj = {
            name: "6. Invoice",
            content: fs.readFileSync(join(__dirname, 'examples/invoice.html')).toString("utf8"),
            helpers: fs.readFileSync(join(__dirname, 'examples/invoiceHelpers.js')).toString("utf8"),
            engine: "jsrender",
            recipe: "html",
            isExample: true,
            dataItem: {
                dataJson: fs.readFileSync(join(__dirname, 'examples/invoice.js')).toString("utf8")
            }
        };

        return self.reporter.templates.create(context, templateObj);
    }

    function library(context) {
        var templateObj = {
            name: "7. Library",
            content: fs.readFileSync(join(__dirname, 'examples/library.html')).toString("utf8"),
            helpers: fs.readFileSync(join(__dirname, 'examples/libraryHelpers.js')).toString("utf8"),
            engine: "handlebars",
            recipe: "phantom-pdf",
            isExample: true,
            dataItem: {
                dataJson: fs.readFileSync(join(__dirname, 'examples/library.js')).toString("utf8")
            }
        };

        return self.reporter.templates.create(context, templateObj);
    }

    function complexReport(context) {
        var templateObj = {
            name: "8. Complex report",
            content: fs.readFileSync(join(__dirname, 'examples/complexReport.html')).toString("utf8"),
            engine: "jsrender",
            recipe: "phantom-pdf",
            isExample: true,
            dataItem: {
                dataJson: fs.readFileSync(join(__dirname, 'examples/complexReport.json')).toString("utf8")
            }
        };

        return self.reporter.templates.create(context, templateObj);
    }

    return self.reporter.dataProvider.startContext().then(function (context) {
        return context.templates.filter(function (t) {
            return t.isExample == true;
        }).toArray()
            .then(function (res) {
                if (res.length > 0) {
                    self.reporter.logger.info("Examples are already present in the db.");
                    return Q();
                }

                return helloWorld(context).then(
                    function () {
                        return phantomPdf(context);
                    })
                    .then(function () {
                        return fop(context);
                    })
                    .then(function () {
                        return script(context);
                    }).then(function () {
                        return data(context);
                    }).then(function () {
                        return invoice(context);
                    }).then(function () {
                        return library(context);
                    }).then(function () {
                        return complexReport(context);
                    }).then(function () {
                        self.reporter.logger.info("Examples successfully created.");
                        return context.saveChanges();
                    });
            });
    });
};
