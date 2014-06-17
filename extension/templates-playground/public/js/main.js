/*! 
 * Copyright(c) 2014 Jan Blaha 
 */ 

define(["jquery", "app", "marionette", "backbone",
        "./template.model", "./template.detail.view",
        "./template.detail.toolbar.view"],
    function($, app, Marionette, Backbone, TemplateModel, TemplateDetailView, ToolbarView) {

        app.on("after-start", function() {
            if (window.location.hash == "") {
                window.location.hash = "/playground";
            }
        });

        return app.module("template", function(module) {
            module.TemplateDetailTooolbarView = ToolbarView;

            var Router = Backbone.Router.extend({
                initialize: function() {
                    var self = this;

                    app.listenTo(app, "template-saved", function(templateModel) {
                        self.navigate("/playground/" + templateModel.get("shortid") + "/" + templateModel.get("version"));
                    });

                },

                routes: {
                    "playground": "playground",
                    "playground/:id(/:version)": "playground"
                },

                playground: function(id, version) {
                    var model = new TemplateModel({ version: version });

                    function show() {
                        app.layout.showToolbarViewComposition(new TemplateDetailView({ model: model }), new ToolbarView({ model: model }));
                    }

                    if (id != null) {
                        model.set("shortid", id);
                        model.fetch({
                            success: function() {
                                show();
                            }
                        });
                    } else {
                        show();
                    }
                }
            });

            module.router = new Router();

            app.on("entity-registration", function(context) {

                var templateAttributes = {
                    '_id': { 'key': true, 'nullable': false, 'computed': true, 'type': 'Edm.String' },
                    'name': { 'type': 'Edm.String' },
                    'modificationDate': { 'type': 'Edm.DateTime' },
                    'engine': { 'type': 'Edm.String' },
                    'recipe': { 'type': 'Edm.String' },
                    'content': { 'type': 'Edm.String' },
                    'shortid': { 'type': 'Edm.String' },
                    'helpers': { 'type': 'Edm.String' },
                    'version' : { 'type': 'Edm.Int32' }
                };

                $data.Entity.extend('$entity.Template', templateAttributes);
                $entity.Template.prototype.toString = function() {
                    return "Template " + (this.name || "");
                };

                context["templates"] = { type: $data.EntitySet, elementType: $entity.Template };
            });

        });
    });