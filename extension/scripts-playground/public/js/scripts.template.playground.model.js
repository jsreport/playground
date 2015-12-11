define(["app", "core/basicModel", "underscore"], function (app, ModelBase, _) {
    return ModelBase.extend({

        setTemplateModel: function (templateModel) {
            this.templateModel = templateModel;
            templateModel.set("script", templateModel.get("script") || {}, {silent: true});
            this.set("content", templateModel.get("script").content);
        },

        save: function (options) {
            this.templateModel.get("script").content = this.get("content");
            return options.success();
        },
    });
});

