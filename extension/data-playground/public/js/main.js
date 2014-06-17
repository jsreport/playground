define(["app", "marionette", "backbone", "./data.template.playground.view", "./data.template.playground.dialog"],
    function(app, Marionette, Backbone, TemplatePlaygroundView, TemplatePlaygroundDialog) {

        app.module("data", function(module) {

            app.on("template-extensions-render", function(context) {
                var view = new TemplatePlaygroundView();
                view.setTemplateModel(context.template);
                context.extensionsRegion.show(view, "data");
            });

            app.on("entity-registration", function(context) {

                $data.Class.define("$entity.DataItem", $data.Entity, null, {
                    'dataJson': { 'type': 'Edm.String' }
                }, null);

                $entity.DataItem.prototype.toString = function() {
                    return "DataItem " + (this.name || "");
                };

                $entity.Template.addMember("dataItem", { 'type': "$entity.DataItem" });
            });
        });
    });