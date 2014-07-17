define(["app", "marionette", "backbone",
        "./scripts.template.playground.view", "./scripts.template.playground.dialog",
        "./scripts.template.playground.model"
    ],
    function(app, Marionette, Backbone,  PlaygroundTemplateView, PlaygroundTemplateDialog, PlaygroundTemplateModel) {

        app.on("template-extensions-render", function(context) {
            var view = new PlaygroundTemplateView();
            view.setTemplateModel(context.template);
            context.extensionsRegion.show(view, "scripts");
        });

        app.on("entity-registration", function(context) {

            $data.Class.define("$entity.Script", $data.Entity, null, {
                'content': { 'type': 'Edm.String' }
            }, null);

            $entity.Template.addMember("script", { 'type': "$entity.Script" });

            $entity.Script.prototype.toString = function() {
                return "Script";
            };
        });
    });