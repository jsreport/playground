/*! 
 * Copyright(c) 2014 Jan Blaha 
 *
 * Extension allowing to run custom scripts and modify request before rendering process starts.
 */ 

var shortid = require("shortid"),
    fork = require('child_process').fork,
    _ = require("underscore"),
    join = require("path").join,
    Q = require("q");

module.exports = function (reporter, definition) {
    reporter["scripts"] = new Scripts(reporter, definition);
};

Scripts = function (reporter, definition) {
    this.reporter = reporter;
    
    this.ScriptType = this.reporter.dataProvider.createEntityType("SrciptType", {
        shortid: { type: "string"},
        creationDate: { type: "date" },
        modificationDate: { type: "date" },
        content: { type: "string" },
        name: { type: "string" }
    });

    reporter.templates.TemplateType.addMember("script", { type: this.ScriptType });
    
    this.ScriptType.addEventListener("beforeCreate", Scripts.prototype._beforeCreateHandler.bind(this));
    
    this.reporter.beforeRenderListeners.add(definition.name, this, Scripts.prototype.handleBeforeRender);

    this.allowedModules = ["handlebars", "request-json", "feedparser", "request", "underscore"];
};

Scripts.prototype.create = function(context, script) {
    var entity = new this.ScriptType(script);
    context.scripts.add(entity);
    return context.scripts.saveChanges().then(function() { return Q(entity); });
};

Scripts.prototype.handleBeforeRender = function (request, response) {
    var self = this;
    if (!request.template.scriptId && !(request.template.script != null && request.template.script.content)) {
        this.reporter.logger.info("ScriptId not defined for this template.");
        return Q();
    }

    function FindScript() {
        if (request.template.script != null && request.template.script != "")
            return Q(request.template.script);
        
        self.reporter.logger.debug("Searching for before script to apply - " + request.template.scriptId);

        return request.context.scripts.single(function(s) { return s.shortid == this.id; }, { id: request.template.scriptId });
    }

    return FindScript().then(function(script) {

        script = script.content || script;
        var child = fork(join(__dirname, "scriptEvalChild.js"));
        var isDone = false;

        return Q.nfcall(function(cb) {

            child.on('message', function(m) {
                isDone = true;
                if (m.error) {
                    self.reporter.logger.error("Child process process resulted in error " + JSON.stringify(m.error));
                    self.reporter.logger.error(m);
                    return cb({ message: m.error, stack: m.errorStack });
                }

                self.reporter.logger.info("Child process successfully finished.");

                request.data = m.request.data;
                request.template.content = m.request.template.content;
                request.template.helpers = m.request.template.helpers;

                return cb();
            });

            child.send({
                script: script,
                allowedModules: self.allowedModules,
                request: {
                    data: request.data,
                    template: {
                        content: request.template.content,
                        helpers: request.template.helpers
                    }
                },
                response: response
            });

            self.reporter.logger.info("Child process started.");

            setTimeout(function() {
                if (isDone)
                    return;

                child.kill();
                self.reporter.logger.error("Child process resulted in timeout.");
                return cb({ message: "Timeout error during script execution" });
            }, 60000);
        });
    });
};

Scripts.prototype._beforeCreateHandler = function(args, entity) {
     if (entity.shortid == null)
        entity.shortid = shortid.generate();
    
    entity.creationDate = new Date();
    entity.modificationDate = new Date();
};