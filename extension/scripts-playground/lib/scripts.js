/*! 
 * Copyright(c) 2014 Jan Blaha 
 *
 * Extension allowing to add custom javascript hooks into the rendering process.
 */

var shortid = require("shortid"),
  _ = require("underscore"),
  path = require("path"),
  q = require("q"),
  extend = require("node.extend");

var Scripts = function(reporter, definition) {
  this.reporter = reporter;
  this.definition = definition;
  this.definition.options.timeout = this.definition.options.timeout || 30000;

  this._defineEntities();

  this.reporter.beforeRenderListeners.add(definition.name, this, Scripts.prototype.handleBeforeRender);
  this.reporter.afterRenderListeners.add(definition.name, this, Scripts.prototype.handleAfterRender);

  this.allowedModules = this.definition.options.allowedModules || ["handlebars", "request-json", "feedparser", "request", "underscore", "constants", "sendgrid"];
};

Scripts.prototype.handleAfterRender = function(request, response) {
  if (!request.parsedScript)
    return q();

  var self = this;

  return q.ninvoke(request.reporter.scriptManager, 'execute', {

      script: request.parsedScript,
      allowedModules: self.allowedModules,
      method: "afterRender",
      request: {
        data: request.data,
        template: {
          content: request.template.content,
          helpers: request.template.helpers
        },
        options: request.options,
        headers: request.headers
      },
      response: {
        headers: response.headers,
        content: response.content
      }
    }, {
    execModulePath: path.join(__dirname, "scriptEvalChild.js"),
    timeout: self.definition.options.timeout
  }).then(function(body) {
    if (body.error) {
      body.error.weak = true
      return q.reject(body.error)
    }

    response.headers = body.response.headers;
    response.result = new Buffer(body.response.content);
  });
};

Scripts.prototype.handleBeforeRender = function(request, response) {
  var self = this;

  if (!request.template.script || (!request.template.script.shortid && !request.template.script.content)) {
    self.reporter.logger.debug("Script not defined for this template.");
    return q();
  }


  var script = request.template.script.content;

  request.parsedScript = script;

  return q.ninvoke(request.reporter.scriptManager, 'execute', {

    script: script,
    allowedModules: self.allowedModules,
    method: "beforeRender",
    request: {
      data: request.data,
      template: request.template,
      headers: request.headers,
      options: request.options
    },
    response: response
  }, {
    execModulePath: path.join(__dirname, "scriptEvalChild.js"),
    timeout: self.definition.options.timeout
  }).then(function(body) {
    if (body.error) {
      body.error.weak = true
      return q.reject(body.error)
    }

    if (body.cancelRequest) {
      var error = new Error("Rendering request canceled  from the script " + body.additionalInfo);
      error.weak = true;
      return q.reject(error);
    }

    if (!body.shouldRunAfterRender) {
      request.parsedScript = null;
    }

    function merge(obj, obj2) {
      for (var key in obj2) {
        if (typeof obj2[key] === undefined)
          continue;

        if (typeof obj2[key] !== 'object' || typeof obj[key] === 'undefined') {
          obj[key] = obj2[key];
        } else {
          merge(obj[key], obj2[key]);
        }
      }
    }

    merge(request, body.request);
    return response;
  });
};

Scripts.prototype._defineEntities = function() {
  this.ScriptRefType = this.reporter.documentStore.registerComplexType("ScriptRefType", {
    content: {type: "Edm.String"},
    shortid: {type: "Edm.String"}
  });

  this.reporter.documentStore.model.entityTypes['TemplateType'].script = {type: 'jsreport.ScriptRefType'};
};

module.exports = function(reporter, definition) {
  reporter['scripts'] = new Scripts(reporter, definition);
};