var assert = require("assert"),
    fs = require('fs'),
    path = require("path"),
    Q = require("q"),
    describeReporting = require("jsreport").describeReporting;

describeReporting(path.join(__dirname, "../../../"), ["templates-playground"], function (reporter) {

    describe('templating playground', function () {

        it('handleBefore should find by shortid and version and use template', function (done) {
            var request = {
                template: {},
                context: reporter.context,
                options: { recipe: "html" }
            };

            reporter.templates.create({ content: "foo" }).then(function (t) {
                request.template.shortid = t.shortid;
                request.template.version = t.version;
                return reporter.templates.handleBeforeRender(request, {}).then(function () {
                    assert.equal("foo", request.template.content);
                    done();
                });
            }).catch(done);
        });

        it('deleting template should be rejected', function (done) {
            reporter.templates.create({ content: "foo" })
                .then(function (t) {
                    reporter.context.templates.remove(t);
                    return reporter.context.templates.saveChanges().then(function () {
                        return reporter.context.templates.find(t._id).then(function (templ) {
                            assert.equal("foo", templ.content);
                            done();
                        });
                    });
                }).catch(done);
        });

        it('updating template should be rejected', function (done) {
            reporter.templates.create({ content: "foo" })
                .then(function (t) {
                    reporter.context.templates.attach(t);
                    t.content = "modified";
                    return reporter.context.templates.saveChanges().then(function () {
                        return reporter.context.templates.find(t._id).then(function (templ) {
                            assert.equal("foo", templ.content);
                            done();
                        });
                    });
                }).catch(done);
        });

        it('creating template with same shortid should increase version', function (done) {
            reporter.templates.create({ content: "foo" })
                .then(function (t) {
                    return reporter.templates.create({ content: "foo", shortid: t.shortid });
                })
                .then(function (t) {
                    assert.equal(2, t.version);
                    done();
                });
        });

        it('creating template with different shortid should set version equal 1', function (done) {
            reporter.templates.create({ content: "foo" })
                .then(function (t) {
                    return reporter.templates.create({ content: "foo", shortid: t.shortid + "DIFFERENT" });
                })
                .then(function (t) {
                    assert.equal(1, t.version);
                    done();
                })
                .catch(done);
        });
    });
});