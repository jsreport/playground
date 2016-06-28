define(["jquery", "app", "marionette", "backbone"],
    function($, app, Marionette, Backbone) {

        var module = app.module("examples", function() {

            app.on("menu-render", function(context) {
                var result = "<li class='dropdown' data-step='6' data-intro='Or check out examples for various reporting options.'><a href='#' class='dropdown-toggle' data-toggle='dropdown'>Examples <b class='caret'></b></a><ul class='dropdown-menu'><li class='dropdown-header'>examples</li>";
                module.examples.forEach(function(t) {
                    result += "<li><a href='#/playground/" + t.shortid + "'>" + t.name + "</a></li>";
                });

                result += "</ul>";
                result += "</li>";
                context.result += result;
            });

        });

        app.onStartListeners.add(function(cb) {
            return app.dataProvider.get('odata/templates?$filter=isExample eq true and version eq 1').then(function (res) {
                module.examples = _.sortBy(res, function(t) {
                    return t.name;
                });

                cb()
            });
        });

        return module;
    });1