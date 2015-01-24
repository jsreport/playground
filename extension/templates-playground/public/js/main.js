/*! 
 * Copyright(c) 2014 Jan Blaha 
 */ 

define('template.model',["app", "core/jaydataModel"], function(app, ModelBase) {
    return ModelBase.extend({
        contextSet: function() { return app.dataContext.templates; },

        fetchQuery: function() {
            return app.dataContext.templates.single(function(t) { return t.shortid == this.id && t.version == this.version; },
                { id: this.get("shortid"), version: this.get("version") == null ? 1 : this.get("version") });
        },

        _initialize: function() {
            this.Entity = $entity.Template;
        },

        defaults: {
            engine: "handlebars",
            recipe: "phantom-pdf"
        }
    });
});
/*! 
 * Copyright(c) 2014 Jan Blaha 
 */ 

define('template.detail.view',["jquery", "app", "core/utils", "core/view.base", "core/aceBinder"],
    function($, app, Utils, LayoutBase, aceBinder) {
        
        return LayoutBase.extend({
            template: "template-detail",
            contentEditor: null,
            helpersEditor: null,
            className: 'template-detail-wrap',

            initialize: function() {
                var self = this;

                this.listenTo(this.model, "sync", function() {
                    if (self.viewRendered)
                        return;
                    
                    self.render();
                    self.viewRendered = true;
                });
                
                this.listenTo(this, "close", function() {
                    $(".side-nav-right").show();
                });
            },

            events: {
                "click #previewPane": "triggerPreview"
            },

            onDomRefresh: function() {
                var self = this;
                $(".side-nav-right").hide();

                var langTools = ace.require("ace/ext/language_tools");

                //var dataCompleter = {
                //    getCompletions: function(editor, session, pos, prefix, callback) {
                //        if (prefix.length === 0) {
                //            return callback(null, []);
                //        }
                //        // wordList like [{"word":"flow","freq":24,"score":300,"flags":"bc","syllables":"1"}]
                //        return callback(null, [
                //            { name: "jsreport", value: "jsreport", score: 300, meta: "jsreport" }]
                //        );
                //    }
                //};
                
                //langTools.addCompleter(dataCompleter);
                
                
                this.contentEditor = ace.edit("htmlArea");
                this.contentEditor.setTheme("ace/theme/chrome");
                this.contentEditor.getSession().setMode("ace/mode/handlebars");
                this.contentEditor.setOptions({
                     enableBasicAutocompletion: true,
                     enableSnippets: true
                });

                aceBinder(this.model, "content", this.contentEditor);
             

                this.helpersEditor = ace.edit("helpersArea");
                this.helpersEditor.setTheme("ace/theme/chrome");
                this.helpersEditor.getSession().setMode("ace/mode/javascript");
                this.helpersEditor.setOptions({
                     enableBasicAutocompletion: true,
                     enableSnippets: true
                });
                
                aceBinder(this.model, "helpers", this.helpersEditor);

                self.$el.find("#previewFrameWrap").contents().find('html').html(
                    "<iframe name='previewFrame' frameborder='0' allowtransparency='true' allowfullscreen='true' style='width: 100%; height: 100%;'></iframe>");


                self.$el.find("[name=previewFrame]").on("load", function() {
                    self.$el.find(".preview-loader").hide();
                    //http://connect.microsoft.com/IE/feedback/details/809377/ie-11-load-event-doesnt-fired-for-pdf-in-iframe
                    //$(this).show();
                });

                self.listenTo(app.layout, "dialog-opening", function() {
                    self.$el.find("[name=previewFrame]").hide();
                });

                self.listenTo(app.layout, "dialog-closing", function() {
                    self.$el.find("[name=previewFrame]").show();
                });


                this.$el.find(".split-pane").splitPane();
            },
            triggerPreview: function() {
                this.trigger("preview");
            },

            validateLeaving: function() {
                return !this.model.hasChangesSyncLastSync();
            }
        });
    });
define('template.embed.dialog',["marionette", "app", "core/view.base",], function (Marionette, app, ViewBase) {
    return ViewBase.extend({
        template: "template-embed",
        
        initialize: function() {
            var self = this;

            this.listenTo(this.model, "change", function() {
                self.render();
            });
        },
    });
});
/*! 
 * Copyright(c) 2014 Jan Blaha 
 */ 

define('template.detail.toolbar.view',["jquery", "app", "core/utils", "core/view.base", "underscore", "core/listenerCollection",
        "template.embed.dialog", "core/basicModel", "introJs"],
    function($, app, Utils, LayoutBase, _, ListenerCollection, EmbedDialog, BasicModel, introJs) {
        return LayoutBase.extend({
            template: "template-detail-toolbar",

            initialize: function() {
                var self = this;

                $(document).on('keydown.template-detail', this.hotkey.bind(this));

                this.beforeRenderListeners = new ListenerCollection();
                this.listenTo(this.model, "sync", function() {
                    if (self.viewRendered)
                        return;

                    self.render();
                    self.viewRendered = true;

                    self.listenTo(self.contentView, "preview", function() {
                        self.preview();
                    });
                });

                this.listenTo(this, "render", function() {

                    if (!localStorage.getItem("beenHere")) {
                        localStorage.setItem("beenHere", "true");

                        var dialog = $.dialog({
                            header: "Introduction",
                            content: $.render["template-detail-intro"](self.model.toJSON(), self),
                            hideButtons: true
                        }).on('hidden.bs.modal', function() {
                            dialog.off('hidden.bs.modal');
                            introJs().start();
                        });
                    }

                    var context = {
                        template: self.model,
                        extensionsRegion: self.extensionsRegion,
                        view: self
                    };
                    app.trigger("template-extensions-render", context);

                    var contextToolbar = {
                        template: self.model,
                        region: self.extensionsToolbarRegion,
                        view: self
                    };
                    app.trigger("template-extensions-toolbar-render", contextToolbar);
                });

                _.bindAll(this, "preview", "previewNewPanel", "getBody", "onClose");
            },

            getRecipes: function() {
                return app.recipes;
            },

            getEngines: function() {
                return app.engines;
            },

            regions: {
                extensionsRegion: {
                    selector: "#extensionsBox",
                    regionType: Marionette.MultiRegion
                },
                extensionsToolbarRegion: {
                    selector: "#extensionsToolbarBox",
                    regionType: Marionette.MultiRegion
                }
            },

            events: {
                "click #saveCommand": "save",
                "click #previewCommand": "preview",
                "click #previewNewTabCommand": "previewNewPanel",
                "click #apiHelpCommnand": "apiHelp",
                "click #embedCommand": "embed"
            },

            save: function(e) {
                var self = this;

                if (!this.validate())
                    return;

                this.model.originalEntity = new $entity.Template();
                this.model.set("_id", null);

                this.model.save({}, {
                    success: function() {
                        app.trigger("template-saved", self.model);
                    }
                });
            },

            addInput: function(form, name, value) {
                var input = document.createElement("input");
                input.type = "hidden";
                input.name = name;
                input.value = value;
                form.appendChild(input);
            },

            previewNewPanel: function() {
                this._preview("_blank");
                this.contentView.$el.find(".preview-loader").hide();
            },

            preview: function() {
                this._preview("previewFrame");
            },

            _preview: function(target) {
                this.contentView.$el.find(".preview-loader").show();
                //http://connect.microsoft.com/IE/feedback/details/809377/ie-11-load-event-doesnt-fired-for-pdf-in-iframe
                //this.contentView.$el.find("[name=previewFrame]").hide();

                var mapForm = document.createElement("form");
                mapForm.target = target;
                mapForm.method = "POST";
                mapForm.action = app.serverUrl + "api/report";

                var uiState = this.getUIState();

                var request = { template: uiState, options: { preview: true} };
                var self = this;
                this.beforeRenderListeners.fire(request, function(er) {
                    if (er) {
                        self.contentView.$el.find(".preview-loader").hide();
                        app.trigger("error", { responseText: er });
                        return;
                    }

                    function addBody(path, body) {
                        if (body == null)
                            return;

                        if (body.initData != null)
                            body = body.initData;

                        for (var key in body) {
                            if ($.isPlainObject(body[key])) {
                                addBody(path + key + "[", body[key]);
                            } else {
                                if (body[key] !== undefined && !(body[key] instanceof Array))
                                    self.addInput(mapForm, path + key + "]", body[key]);
                            }
                        }
                    }

                    addBody("template[", uiState);
                    if (request.options != null)
                        addBody("options[", request.options);

                    if (request.data != null)
                        self.addInput(mapForm, "data", request.data);

                    document.body.appendChild(mapForm);
                    mapForm.submit();
                });
            },

            getUIState: function() {

                function justNotNull(o) {
                    var clone = {};
                    for (var key in o) {
                        if (o[key] != null)
                            clone[key] = o[key];
                    }

                    return clone;
                }

                var state = {};
                var json = this.model.toJSON();
                for (var key in json) {
                    if (json[key] != null) {
                        if (json[key].initData != null)
                            state[key] = justNotNull(json[key].toJSON());
                        else
                            state[key] = json[key];
                    }
                }

                state.content = state.content || " ";
                state.helpers = state.helpers || "";
                return state;
            },

            onValidate: function() {
                var res = [];

                if (this.model.get("name") == null || this.model.get("name") == "")
                    res.push({
                        message: "Name cannot be empty"
                    });

                if (this.model.get("recipe") == null)
                    res.push({
                        message: "Recipe must be selected"
                    });

                return res;
            },

            getBody: function() {
                var properties = [];
                properties.push({ key: "content", value: "..." });
                properties.push({ key: "helpers", value: "..." });
                properties.push({ key: "recipe", value: "..." });

                this.model.trigger("api-overrides", function(key, value) {
                    value = value || "...";
                    properties.push({ key: key, value: _.isObject(value) ? JSON.stringify(value, null, 2) : "..." });

                });
                return properties;
            },

            apiHelp: function() {
                $.dialog({
                    header: "jsreport API",
                    content: $.render["template-detail-api"](this.model.toJSON(), this),
                    hideSubmit: true
                });
            },

            embed: function() {
                var model = new BasicModel(this.model.toJSON());
                model.set({ fileInput: true, dataArea: true });
                var dialog = new EmbedDialog({ model: model });
                app.layout.dialog.show(dialog);
            },

            hotkey: function(e) {
                if (e.ctrlKey && e.which === 83) {
                    this.save();
                    e.preventDefault();
                    return false;
                }

                if (e.which === 119) {
                    this.preview();
                    e.preventDefault();
                    return false;
                }
            },

            onClose: function() {
                $(document).off(".template-detail");
            }
        });
    });
/*! 
 * Copyright(c) 2014 Jan Blaha 
 */ 

define(["jquery", "app", "marionette", "backbone",
        "template.model", "template.detail.view",
        "template.detail.toolbar.view"],
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
