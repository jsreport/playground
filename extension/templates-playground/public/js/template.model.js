/*! 
 * Copyright(c) 2014 Jan Blaha 
 */ 

define(["app", "core/jaydataModel"], function(app, ModelBase) {
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