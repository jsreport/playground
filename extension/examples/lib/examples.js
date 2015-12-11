/*! 
 * Copyright(c) 2014 Jan Blaha 
 *
 * Examples extension is creating some sample report templates on the startup.
 */

var join = require("path").join,
  fs = require("fs"),
  Q = require("q");

module.exports = function(reporter, definition) {
  reporter[definition.name] = new Examples(reporter, definition);
};

Examples = function(reporter, definition) {
  var self = this;
  this.reporter = reporter;

  reporter.documentStore.model.entityTypes['TemplateType'].isExample = {type: 'Edm.Boolean'};

  this.reporter.initializeListener.add(definition.name, this, Examples.prototype.createExamples.bind(this));
};

Examples.prototype.createExamples = function() {
  this.reporter.logger.info("Initializing examples.");
  var self = this;


  function helloWorld() {
    return self.reporter.documentStore.collection('templates').insert({
      name: "1. Hello World",
      content: fs.readFileSync(join(__dirname, 'examples/helloFib.html')).toString("utf8"),
      helpers: fs.readFileSync(join(__dirname, 'examples/helloFib.js')).toString("utf8"),
      engine: "jsrender",
      recipe: "html",
      isExample: true
    });
  }

  function phantomPdf() {
    return self.reporter.documentStore.collection('templates').insert({
      name: "2. Hello World Phantom Pdf",
      content: fs.readFileSync(join(__dirname, 'examples/helloPhantom.html')).toString("utf8"),
      helpers: fs.readFileSync(join(__dirname, 'examples/helloFib.js')).toString("utf8"),
      engine: "jsrender",
      recipe: "phantom-pdf",
      isExample: true
    });
  }

  function fop() {
    return self.reporter.documentStore.collection('templates').insert({
      name: "3. Hello World FOP Pdf",
      content: fs.readFileSync(join(__dirname, 'examples/helloWorld.xml')).toString("utf8"),
      helpers: fs.readFileSync(join(__dirname, 'examples/helloFib.js')).toString("utf8"),
      engine: "jsrender",
      recipe: "fop-pdf",
      isExample: true
    });
  }

  function script() {
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

    return self.reporter.documentStore.collection('templates').insert(templateObj);
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

    return self.reporter.documentStore.collection('templates').insert(templateObj);
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

    return self.reporter.documentStore.collection('templates').insert(templateObj);
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

    return self.reporter.documentStore.collection('templates').insert(templateObj);
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

    return self.reporter.documentStore.collection('templates').insert(templateObj);
  }

  return self.reporter.documentStore.collection('templates').find({isExample: true}).then(function(results) {
    if (results.length > 0) {
      self.reporter.logger.info("Examples are already present in the db.");
      return Q();
    }

    return helloWorld().then(
      function() {
        return phantomPdf();
      })
      .then(function() {
        return fop();
      })
      .then(function() {
        return script();
      }).then(function() {
        return data();
      }).then(function() {
        return invoice();
      }).then(function() {
        return library();
      }).then(function() {
        return complexReport();
      }).then(function() {
        self.reporter.logger.info("Examples successfully created.");
      });
  });
}
