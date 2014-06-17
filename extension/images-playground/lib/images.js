/*! 
 * Copyright(c) 2014 Jan Blaha 
 *
 * Images extension allows to upload images into mongo and reference them from the templates
 */

var shortid = require("shortid"),
    fs = require("fs"),
    _ = require("underscore"),
    Q = require("q"),
    asyncReplace = require("async-replace");

module.exports = function (reporter, definition) {
    reporter["images"] = new Images(reporter, definition);
};

Images = function (reporter, definition) {
    this.reporter = reporter;

    this._defineEntitySets();

    reporter.templates.TemplateType.addEventListener("beforeCreate", function (args, template) {
        template.images = template.images || [];
    });

    this.ImageType.addEventListener("beforeCreate", function (args, entity) {
        entity.creationDate = new Date();
        entity.modificationDate = new Date();
    });

    this.ImageType.addEventListener("beforeUpdate", function (args, entity) {
        entity.modificationDate = new Date();
    });

    this.reporter.on("express-configure", Images.prototype._configureExpress.bind(this));
    this.reporter.beforeRenderListeners.add(definition.name, this, Images.prototype.handleBeforeRender.bind(this));
};

Images.prototype.upload = function (context, name, contentType, content, shortidVal) {
    var self = this;
    this.reporter.logger.info("uploading image " + name);

    function findOrCreate(context) {
        if (shortidVal == null) {
            var image = new self.ImageType({
                name: name,
                contentType: contentType,
                content: content,
                shortid: shortid.generate()
            });
            context.images.add(image);
            return Q(image);
        } else {
            return context.images.single(function (i) {
                return i.shortid == this.id;
            }, { id: shortidVal }).then(function (img) {
                context.images.attach(img);
                img.content = content;
                img.contentType = contentType;
                img.name = name;
                return Q(img);
            });
        }
    }

    return findOrCreate(context).then(function (img) {
        return context.images.saveChanges().then(function () {
            return Q(img);
        });
    });
};

Images.prototype.handleBeforeRender = function (request, response) {

    function convert(str, p1, offset, s, done) {

        request.context.images.filter(function (t) {
            return t.name == this.name;
        }, { name: p1 }).toArray().then(function (res) {
            if (res.length < 1)
                return done(null);

            var imageData = "data:" + res[0].contentType + ";base64," + res[0].content.toString('base64');
            done(null, imageData);
        });
    }

    var test = /{#image ([^{}]+)+}/g;

    return Q.nfcall(asyncReplace, request.template.content, test, convert).then(function (result) {
        request.template.content = result;
    });
};

Images.prototype._configureExpress = function (app) {
    var self = this;

    app.use("/api/image", function (req, res, next) {
        self.reporter.dataProvider.startContext().then(function (context) {
            req.reporterContext = context;
            next();
        });
    });

    app.get("/api/image/:shortid", function (req, res) {
        req.reporterContext.images.single(function (t) {
            return t.shortid == this.id;
        }, { id: req.params.shortid }).then(function (result) {
            res.setHeader('Content-Type', result.contentType);
            res.send(result.content);
        }, function () {
            res.send(404);
        });
    });

    app.get("/api/image/name/:name", function (req, res) {
        req.reporterContext.images.single(function (t) {
            return t.name == this.name;
        }, { name: req.params.name }).then(function (result) {
            res.setHeader('Content-Type', result.contentType);
            res.send(result.content);
        }, function () {
            res.send(404);
        });

    });

    app.post("/api/image/:shortid?", function (req, res) {
        function findFirstFile() {
            for (var f in req.files) {
                if (req.files.hasOwnProperty(f)) {
                    return req.files[f];
                }
            }
        }

        var file = findFirstFile();

        fs.readFile(file.path, function (err, content) {
            var name = file.name.replace(/\.[^/.]+$/, "");
            name = name.replace(/[^a-zA-Z0-9-_]/g, '');
            self.upload(req.reporterContext, name, file.type, content, req.params.shortid).then(function (image) {
                res.setHeader('Content-Type', "text/plain");
                var result = JSON.stringify({ _id: image._id, shortid: image.shortid, name: name, "success": true });
                self.reporter.logger.info("Uploading done. " + result);
                res.send(result);
            }).catch(function(e) {
                res.send(500, e);
            });
        });
    });
};

Images.prototype._defineEntitySets = function () {
    this.ImageType = this.reporter.dataProvider.createEntityType("ImageType", {
        "_id": { type: "id", key: true, computed: true, nullable: false },
        "shortid": { type: "string" },
        "name": { type: "string" },
        "creationDate": { type: "date" },
        "modificationDate": { type: "date" },
        "content": { type: "blob" },
        "contentType": { type: "string" }
    });

    this.ImageRefType = this.reporter.dataProvider.createEntityType("ImageRefType", {
        "shortid": { type: "string" },
        "name": { type: "string" },
        "imageId": { type: "id" }
    });

    this.reporter.templates.TemplateType.addMember("images", { type: "Array", elementType: this.ImageRefType });

    this.reporter.dataProvider.registerEntitySet("images", this.ImageType);
};