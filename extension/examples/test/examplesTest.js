var fs = require("fs"),
    assert = require("assert"),
    path = require("path"),
    Statistics = require("../lib/examples.js"),
    describeReporting = require("jsreport").describeReporting;


describeReporting(path.join(__dirname, "../../../"), ["templates-playground", "data-playground", "scripts-playground", "examples"], function (reporter) {

    describe('examples', function () {

        it('shoulb prepare examples', function (done) {
            reporter.examples.createExamples().then(function () {
                return reporter.dataProvider.startContext().then(function (context) {
                    return context.templates.filter(function (t) {  return t.isExample == true; }).toArray().then(function (res) {
                        assert.equal(res.length > 0, true);
                        done();
                    });
                })
            }).catch(done);
        });
    })
});
