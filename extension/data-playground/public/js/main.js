define('data.template.playground.dialog',["marionette", "app", "core/view.base", "core/aceBinder"], function(Marionette, app, ViewBase, aceBinder) {
    return ViewBase.extend({
        template: "data-dialog",

        events: {
            "click #saveCommand": "save",
        },

        initialize: function() {
            _.bindAll(this, "save");
        },

        onDomRefresh: function() {

            this.contentEditor = ace.edit("contentArea");
            this.contentEditor.setTheme("ace/theme/chrome");
            this.contentEditor.getSession().setMode("ace/mode/json");
            this.contentEditor.setOptions({
                enableBasicAutocompletion: true,
                enableSnippets: true
            });

            aceBinder(this.model, "dataJson", this.contentEditor);
        },

        save: function(s, e) {

            if (this.model.get("dataJson") != null && this.model.get("dataJson") !== "") {
                try {
                    var json = JSON.parse(this.model.get("dataJson"));
                } catch(e) {
                    alert("You must enter a valid JSON. e.g. { \"propertName\": \"propertyValue\"} ");
                    return;
                }
            }

            var self = this;
          
            this.model.save({
                success: function() {
                    self.trigger("dialog-close");
                }
            });
        }
    });
});
define('data.template.playground.model',["app", "core/basicModel", "underscore"], function (app, ModelBase, _) {
   
    return ModelBase.extend({
        setTemplateModel: function (templateModel) {
            this.templateModel = templateModel;
            
            this.set("dataJson", templateModel.get("dataItem").dataJson);
        },
        
        save: function (options) {
            this.templateModel.get("dataItem").dataJson = this.get("dataJson");
            return options.success();
        }
    });
});
define('data.template.playground.view',["app", "marionette", "core/view.base", "core/utils", "data.template.playground.dialog", "data.template.playground.model"], function (app, Marionette, ViewBase, Utils, DialogView, Model) {
    return ViewBase.extend({
        tagName: "li",
        template: "data-template-extension-playground",
        
        initialize: function () {
            _.bindAll(this, "isFilled");
        },

        events: {
            "click #dataItemCommand": "openDialog"
        },
        
        isFilled: function () {
            return (this.templateModel.get("dataItem") != null) && (this.templateModel.get("dataItem").dataJson != null);
        },
        
        setTemplateModel: function (model) {
            this.templateModel = model;

            if (model.get("dataItem") == null)
                model.attributes["dataItem"] = new $entity.DataItem();
        },
        

        openDialog: function () {
            var self = this;
            var model = new Model();
            model.setTemplateModel(this.templateModel);
            var dialog = new DialogView({ model: model });
            self.listenTo(dialog, "dialog-close", function() {
                self.render();
                self.templateModel.save();
                app.layout.dialog.hide(dialog);
            });
            
            app.layout.dialog.show(dialog);
        }
    });
});


define(["app", "marionette", "backbone", "data.template.playground.view", "data.template.playground.dialog"],
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
