/*! 
 * Copyright(c) 2014 Jan Blaha 
 * 
 * Core extension responsible for storing, versioning and loading report templates for render request..
 */

var shortid = require("shortid"),
    events = require("events"),
    util = require("util"),
    _ = require("underscore"),
    Q = require("q"),
    extend = require("node.extend");

module.exports = function (reporter, definition) {
    reporter["templates"] = new Templating(reporter, definition);
};

var Templating = function (reporter, definition) {
    var self = this;
    this.name = "templates";
    this.reporter = reporter;
    this.definition = definition;
    this._versionCache = [];
    this.updateEnabled = false;

    this._defineEntities();
    this._defineEntitySets();

    this.reporter.initializeListener.add('templates', function () {
        var col = self.reporter.documentStore.collection('templates');
        col.beforeUpdateListeners.add('templates', Templating.prototype._beforeUpdateHandler.bind(self));
        col.beforeInsertListeners.add('templates', Templating.prototype._beforeCreateHandler.bind(self));
        col.beforeRemoveListeners.add('templates', Templating.prototype._beforeDeleteHandler.bind(self));
    });

    this.reporter.beforeRenderListeners.add(definition.name, Templating.prototype.handleBeforeRender.bind(this));

    this.reporter.initializeListener.add(definition.name, this, function () {
        return self.reporter.documentStore.collection('templateVersions').find({}).then(function(res) {
            res.forEach(function(r) {
                self._versionCache[r.shortid] = r;
            });
        });
    });
};

util.inherits(Templating, events.EventEmitter);

Templating.prototype.handleBeforeRender = function (request, response) {

    if (request.template.content || (request.template.phantom && request.template.phantom.url)) {
        request.template.content = request.template.content || "";
        request.template.engine = request.template.engine || 'handlebars';
        return;
    }

    return this.reporter.documentStore.collection('templates').find({shortid: request.template.shortid, version: request.template.version }).then(function(res) {
        extend(true, res[0], request.template);
        request.template = template;
    });
};

Templating.prototype._beforeUpdateHandler = function () {
    throw new Error('No updates allowed in playground');
};

Templating.prototype._beforeCreateHandler = function (entity) {
    if (entity.shortid == null)
        entity.shortid = shortid.generate();

    entity.modificationDate = new Date();

    return this._increaseVersion(entity);
};

Templating.prototype._beforeDeleteHandler = function (args, entity) {
    throw new Error('No deletes allowed in playground');
};

Templating.prototype._defineEntities = function () {

    this.TemplateVersionType = this.reporter.documentStore.registerEntityType("TemplateVersionType", {
        _id: { type: "Edm.String", key: true },
        shortid: { type: "Edm.String" },
        lastVersion: { type: "Edm.Number" }
    });

    this.TemplateType = this.reporter.documentStore.registerEntityType("TemplateType", {
        _id: { type: "Edm.String", key: true },
        shortid: { type: "Edm.String" },
        name: { type: "Edm.String" },
        content: { type: "Edm.String" },
        recipe: { type: "Edm.String" },
        helpers: { type: "Edm.String" },
        engine: { type: "Edm.String" },
        modificationDate: { type: "Edm.StringDateTimeOffset" },
        version: { type: "Edm.Number" }
    });
};

Templating.prototype._increaseVersion = function (entity) {
    var templateVersion = this._versionCache[entity.shortid];

    if (templateVersion) {
        entity.version = ++templateVersion.lastVersion;
        return this.reporter.documentStore.collection('templateVersions').update({shortid: templateVersion.shortid}, { $set: {lastVersion: entity.version}});
    }

    entity.version = 1;
    templateVersion = { shortid: entity.shortid, lastVersion: 1};
    this._versionCache[entity.shortid] = templateVersion;
    return this.reporter.documentStore.collection('templateVersions').insert(templateVersion);
};

Templating.prototype._defineEntitySets = function () {
    this.reporter.documentStore.registerEntitySet('templates', { entityType: 'jsreport.TemplateType' });
    this.reporter.documentStore.registerEntitySet('templateVersions', { entityType: 'jsreport.TemplateVersionType' });
};