var assert = require("assert"),
    path = require("path"),
    describeReporting = require("jsreport").describeReporting,
    Q = require("q");


describeReporting(path.join(__dirname, "../../../"), ["html", "templates-playground", "scripts-playground"], function (reporter) {

    describe('scripts', function () {

        it('shoulb be able to modify request.data', function (done) {
            var response = {};
            var request = {
                context: reporter.context,
                reporter: reporter,
                template: { script: { content: "request.data = 'xxx'; done()" }}
            };
            reporter.scripts.handleBeforeRender(request, response).then(function () {
                assert.equal('xxx', request.data);
                done();
            }).catch(done);
        });

        it('shoulb be able to modify request.template.content', function (done) {
            var response = {};
            var request = {
                context: reporter.context,
                reporter: reporter,
                template: { script: { content: "request.template.content = 'xxx'; done()" }}
            };

            reporter.scripts.handleBeforeRender(request, response).then(function () {
                assert.equal('xxx', request.template.content);
                done();
            }).catch(done);
        });

        it('shoulb be able to use linked modules', function (done) {
            var scriptContent = "var h = require('handlebars'); " +
                "var compiledTemplate = h.compile('foo'); " +
                "request.template.content = compiledTemplate();" +
                "done();";
            var response = {};
            var request = {
                context: reporter.context,
                reporter: reporter,
                template: { script: { content: scriptContent }}
            };

            reporter.scripts.handleBeforeRender(request, response).then(function () {
                assert.equal('foo', request.template.content);
                done();
            }).catch(done);
        });

        it('shoulb not be able to read local files', function (done) {
            var scriptContent = "var fs = require('fs'); " +
                "fs.readdir('d:\', function(err, files) { response.filesLength = files.length; done(); });";
            var response = {};
            var request = {
                context: reporter.context,
                reporter: reporter,
                template: { script: { content: scriptContent }}
            };

            reporter.scripts.handleBeforeRender(request, response).fail(function () {
                assert.equal(response.filesLength == null, true);
                done();
            }).catch(done);
        });
    });
});