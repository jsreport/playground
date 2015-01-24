define('scripts.template.playground.dialog',["marionette", "app", "core/aceBinder", "core/view.base"], function(Marionette, app, aceBinder, ViewBase) {
    return ViewBase.extend({
        template: "scripts-dialog",

        events: {
            "click #saveCommand": "save",
        },
        
        initialize: function() {
            _.bindAll(this, "save");
        },

        onDomRefresh: function() {
            this.contentEditor = ace.edit("contentArea");
            this.contentEditor.setTheme("ace/theme/chrome");
            this.contentEditor.getSession().setMode("ace/mode/javascript");
            this.contentEditor.setOptions({
                enableBasicAutocompletion: true,
                enableSnippets: true
            });

            aceBinder(this.model, "content", this.contentEditor);
        },

        save: function() {
            var self = this;
            this.model.save({
                success: function() {
                    self.trigger("dialog-close");
                }
            });
        }
    });
});
define('scripts.template.playground.model',["app", "core/basicModel", "underscore"], function (app, ModelBase, _) {
    return ModelBase.extend({

        setTemplateModel: function (templateModel) {
            this.templateModel = templateModel;
            this.set("content", templateModel.get("script").content);
        },

        save: function (options) {
            this.templateModel.get("script").content = this.get("content");
            return options.success();
        },
    });
});


define('scripts.template.playground.view',["marionette", "app", "scripts.template.playground.dialog", "scripts.template.playground.model", "core/view.base"], function (Marionette, app, DialogView, Model, ViewBase) {
    return ViewBase.extend({
        tagName: "li",
        template: "scripts-template-playground",
        
        initialize: function () {
            var self = this;
            _.bindAll(this, "isFilled");
        },
        
        setTemplateModel: function (model) {
            this.templateModel = model;

            if (model.get("script") == null)
                model.attributes["script"] = new $entity.Script();
        },
        
        events: {
            "click #scriptCommand": "openDialog"
        },
        
        isFilled: function () {
             return (this.templateModel.get("script") != null) && (this.templateModel.get("script").content != null);
        },
        
        openDialog: function () {
            var self = this;
            var model = new Model();
            model.setTemplateModel(this.templateModel);
            var dialog = new DialogView({
                model: model
            });
            self.listenTo(dialog, "dialog-close", function () {
                self.render();
                self.templateModel.save();
                app.layout.dialog.hide(dialog);
            });
            app.layout.dialog.show(dialog);
        }
    });
});
define(["app", "marionette", "backbone",
        "scripts.template.playground.view", "scripts.template.playground.dialog",
        "scripts.template.playground.model"
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
