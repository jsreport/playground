define(["app", "core/basicModel", "underscore"], function (app, ModelBase, _) {
   
    return ModelBase.extend({
        setTemplateModel: function (templateModel) {
            this.templateModel = templateModel;
            this.templateModel.set('dataItem', this.templateModel.get('dataItem') || {}, { silent: true});
            this.set("dataJson", templateModel.get("dataItem").dataJson);
        },
        
        save: function (options) {
            this.templateModel.get("dataItem").dataJson = this.get("dataJson");
            return options.success();
        }
    });
});