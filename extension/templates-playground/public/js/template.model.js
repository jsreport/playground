/*! 
 * Copyright(c) 2014 Jan Blaha 
 */ 

define(["app", "jquery", "core/basicModel"], function(app, $, ModelBase) {

    var defaultEngine = app.engines.filter(function(e) {
        return e === 'handlebars'
    }).length ? 'handlebars' : 'none'

    var defaultRecipe = app.recipes.filter(function(r) {
        return r === 'phantom-pdf'
    }).length ? 'phantom-pdf' : 'html'

    return ModelBase.extend({
        url: function() {
            return "odata/templates?$filter=shortid eq '" + this.get('shortid') + "' and version eq " + (this.get('version') || 1);
        },
        odata: "templates",

        toString: function() {
            return "Template " + (this.get("name") || "");
        },

        parse: function(data) {
            delete data["@odata.context"];
            delete data["@odata.editLink"];
            delete data["@odata.id"];
            return data;
        },

        defaults: {
            engine: defaultEngine,
            recipe: defaultRecipe
        }
    });
});