/*! 
 * Copyright(c) 2014 Jan Blaha 
 *
 * Inline Data plugin able to add some sample data to rendering process
 */

var Q = require("q");

module.exports = function (reporter, definition) {

    var DataItemType = reporter.dataProvider.createEntityType("DataItemType", {
        dataJson: { type: "string" }
    });

    reporter.templates.TemplateType.addMember("dataItem", { type:  DataItemType });

    reporter.beforeRenderListeners.add(definition.name, function(request, response) {

        if (request.template.dataItem && request.template.dataItem.dataJson) {
            try {
                request.data = JSON.parse(request.template.dataItem.dataJson);
            } catch(e) {
                reporter.logger.warn("Invalid json in data item: " + e.message);
                e.weak = true;
                return Q.reject(e);
            }
        }

        return Q();
    });
};