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

    this.TemplateType.addEventListener("beforeCreate", Templating.prototype._beforeCreateHandler.bind(this));
    this.TemplateType.addEventListener("beforeUpdate", Templating.prototype._beforeUpdateHandler.bind(this));
    this.TemplateType.addEventListener("beforeDelete", Templating.prototype._beforeDeleteHandler.bind(this));

    this.reporter.beforeRenderListeners.add(definition.name, Templating.prototype.handleBeforeRender.bind(this));

    this.reporter.initializeListener.add(definition.name, this, function () {
        return self.reporter.dataProvider.startContext().then(function (context) {
            context.templateVersions.toArray().then(function (res) {
                res.forEach(function (r) {
                    self._versionCache[r.shortid] = r;
                });
            });
        });
    });
};

util.inherits(Templating, events.EventEmitter);

Templating.prototype.handleBeforeRender = function (request, response) {

    if (request.template._id == null && request.template.shortid == null) {
        request.template.content = request.template.content || "";
        return;
    }

    return request.context.templates.single(
        function (t) {
            return t.shortid == this.shortid && t.version == this.version;
        },
        { shortid: request.template.shortid, version: request.template.version }).then(function (template) {
            extend(true, template, request.template);
            request.template = template;
        }, function () {
            throw new Error("Unable to find specified template: " + (request.template._id != null ? request.template._id : request.template.shortid));
        });
};

Templating.prototype.create = function (context, tmpl) {
    if (tmpl == null) {
        tmpl = context;
        context = this.reporter.context;
    }

    var template = new this.TemplateType(tmpl);
    template.isLatest = true;
    context.templates.add(template);

    return context.templates.saveChanges().then(function () {
        return Q(template);
    });
};

Templating.prototype._beforeUpdateHandler = function (args, entity) {
    return false;
};

Templating.prototype._beforeCreateHandler = function (args, entity) {
    if (entity.shortid == null)
        entity.shortid = shortid.generate();

    this._increaseVersion(entity);

    entity.modificationDate = new Date();
};

Templating.prototype._beforeDeleteHandler = function (args, entity) {
    return false;
};

Templating.prototype._defineEntities = function () {

    this.TemplateVersionType = this.reporter.dataProvider.createEntityType("TemplateVersionType", {
        _id: { type: "id", key: true, computed: true, nullable: false },
        shortid: { type: "string" },
        lastVersion: { type: "int" }
    });

    this.TemplateType = this.reporter.dataProvider.createEntityType("TemplateType", {
        _id: { type: "id", key: true, computed: true, nullable: false },
        shortid: { type: "string" },
        name: { type: "string" },
        content: { type: "string" },
        recipe: { type: "string" },
        helpers: { type: "string" },
        engine: { type: "string" },
        modificationDate: { type: "date" },
        version: { type: "int" }
    });
};

Templating.prototype._increaseVersion = function (entity) {
    var templateVersion = this._versionCache[entity.shortid];

    if (templateVersion != null) {
        entity.context.templateVersions.attach(templateVersion);
    } else {
        templateVersion = new this.TemplateVersionType({ shortid: entity.shortid, lastVersion: 0 });
        entity.context.templateVersions.add(templateVersion);
        this._versionCache[entity.shortid] = templateVersion;
    }

    entity.version = ++this._versionCache[entity.shortid].lastVersion;
};

Templating.prototype._defineEntitySets = function () {
    this.reporter.dataProvider.registerEntitySet("templates", this.TemplateType);
    this.reporter.dataProvider.registerEntitySet("templateVersions", this.TemplateVersionType);
};