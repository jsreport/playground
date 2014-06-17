var assert = require("assert"),
    path = require("path"),
    describeReporting = require("jsreport").describeReporting;

describeReporting(path.join(__dirname, "../../../"), ["templates-playground", "data-playground"], function (reporter) {

    describe('data', function () {

        it('should parse json data', function (done) {

            reporter.templates.create(reporter.context, {
                content: "content",
                helpers: "",
                dataItem: {
                    dataJson: "{ \"a\" : \"foo\" }"
                }
            }).then(function (template) {
                var request = {
                    reporter: reporter,
                    template: template,
                    options: { recipe: "html" },
                    context: reporter.context
                };

                return reporter.beforeRenderListeners.fire(request, {}).then(function (req, res) {
                    assert.equal(request.data.a, 'foo');
                    done();
                });
            }).catch(done);
        });
    });
});
