define(["jquery", "app", "marionette", "backbone",
        "./images.template.view", "./images.dialog.view", "./images.ref.model", "./images.uploader"],
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
