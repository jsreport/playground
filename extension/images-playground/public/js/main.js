define('images.dialog.view',["marionette", "app", "jquery", "core/view.base"], function (Marionette, app, $, ViewBase) {
    return ViewBase.extend({
        template: "images-dialog",

        initialize: function() {
            this.listenTo(this.collection, "add", this.render);
        },

        events: {
            "click #saveCommand": "save"
        },

        onDomRefresh: function () {
            var self = this;

            self.Uploader = new $(self.$el.find('#fine-uploader')).fineUploader({
                element: self.$el.find('#fine-uploader'),
                request: {
                    endpoint: function() { return app.serverUrl + 'api/image'; }
                },
                text: {
                    uploadButton: '<button type="button" class="btn btn-xs btn-primary">Upload image</button>'
                },
                multiple: false,
                forceMultipart: true,
                autoUpload: true,
                validation: {
                    allowedExtensions: ['jpg', 'jpeg', 'JPG', 'JPEG', 'png', 'gif'],
                    acceptFiles: 'image/*',
                    sizeLimit: 2097152
                }
            }).on("complete", function(event, id, filename, response) {
                self.collection.addImageRef($.extend(response, { name: filename, imageId: response._id }));
            });

        },
        
        getUrl: function(imgRef) {
            return window.location.protocol + "//" + window.location.host + "/api/image/" + imgRef.shortid;
        },

        save: function () {
            var self = this;
            this.collection.save({});
            this.trigger("dialog-close");
        }
    });
});
define('images.ref.model',["app", "core/dataGrid"], function (app, DataGrid) {

    var ImageRefModel = Backbone.Model.extend({
    });

    return Backbone.Collection.extend({
        initialize: function () {
            var self = this;
        },
        
        setTemplateModel: function (templateModel) {
            this.templateModel = templateModel;
            
            if (templateModel.get("images") != null) {
                this.add(templateModel.get("images").map(function(m) {
                    return m;
                }));
            }
        },
        
        fetch: function(opt) {
            opt.success();
        },
        
        addImageRef: function (imageRef) {
            this.add(imageRef);
        },
        
        save: function (opt) {
            this.templateModel.set("images", this.toJSON().map(function(m) {
                return new $entity.ImageRef({
                    name: m.name,
                    shortid: m.shortid,
                    imageId: m.imageId
                });
            }));
        },

        model: ImageRefModel
    });
});


define('images.template.view',["marionette", "app", "images.dialog.view", "images.ref.model", "core/view.base"], function (Marionette, app, DialogView, Model, ViewBase) {
    return ViewBase.extend({
        tagName: "li",
        template: "images-template",

        initialize: function () {
            var self = this;
            _.bindAll(this, "isFilled");
        },

        setTemplateModel: function (model) {
            this.templateModel = model;
        },

        events: {
            "click #imagesCommand": "openDialog",
        },

        isFilled: function () {
            return this.templateModel.get("images") && this.templateModel.get("images").length != 0;
        },
            
     
        openDialog: function () {
            var self = this;
            var model = new Model();
            model.setTemplateModel(this.templateModel);
            model.fetch({
                success: function () {
                    var dialog = new DialogView({
                        collection: model
                    });
                    self.listenTo(dialog, "dialog-close", function () { self.render(); });
                    app.layout.dialog.show(dialog);
                }
            });
        }
    });
});
define('images.uploader',["jquery", "app"],
    function($, app) {

        $.fn.imageUploader = function(options) {
            var self = this;

            if (this.length == 0)
                return this;

            var uploader = new $(this).fineUploader({
                element: this,
                request: {
                    endpoint: function() {
                        return app.serverUrl + 'api/image/' + (options.getId != null ? options.getId() : "");
                    },
                },
                multiple: false,
                forceMultipart: true,
                autoUpload: true,
                validation: {
                    allowedExtensions: ['jpg', 'jpeg', 'JPG', 'JPEG', 'png', 'gif'],
                    acceptFiles: 'image/*',
                    sizeLimit: 2097152,
                },
            }).on("complete", function(event, id, filename, response) {
                options.complete(response);
            });

            return $.extend(uploader, {
                open: function() {
                    self.find('input[type=file]').trigger('click');
                }
            });
        };

        $.extend({
            imageUploader: $.fn.imageUploader,
        });
    });
define(["jquery", "app", "marionette", "backbone",
        "images.template.view", "images.dialog.view", "images.ref.model", "images.uploader"],
    function ($, app, Marionette, Backbone, TemplateView) {

        app.on("template-extensions-render", function (context) {
            var view = new TemplateView();
            view.setTemplateModel(context.template);
            context.extensionsRegion.show(view);
        });


        app.on("entity-registration", function (context) {

            $data.Class.define("$entity.ImageRef", $data.Entity, null, {
                "name": { 'type': 'Edm.String' },
                "shortid": { 'type': 'Edm.String' },
                "imageId": { 'type': 'Edm.String' }
            }, null);

            $entity.Template.addMember("images", { type: "Array", elementType: "$entity.ImageRef" });

            $data.Class.define("$entity.Image", $data.Entity, null, {
                '_id': { 'key': true, 'nullable': false, 'computed': true, 'type': 'Edm.String' },
                "shortid": { 'type': 'Edm.String' },
                "name": { 'type': 'Edm.String' },
                "creationDate": { type: "date" },
                "modificationDate": { type: "date" }
            }, null);

            $entity.Image.prototype.toString = function () {
                return "Image " + (this.name || "");
            };

            context["images"] = { type: $data.EntitySet, elementType: $entity.Image };
        });
    });

