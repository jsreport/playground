/*! 
 * Copyright(c) 2014 Jan Blaha 
 *
 * Inline Data plugin able to add some sample data to rendering process
 */

var q = require("q");

module.exports = function (reporter, definition) {

    var DataItemType = reporter.documentStore.registerComplexType("DataItemType", {
        dataJson: { type: "Edm.String" }
    });

    reporter.documentStore.model.entityTypes['TemplateType'].dataItem = {type: 'jsreport.DataItemType'}

    reporter.beforeRenderListeners.add(definition.name, function(request, response) {

        if (!request.template.data && !request.template.dataItem) {
            reporter.logger.debug("Data item not defined for this template.");
            return q();
        }

        if (!request.template.data && request.template.dataItem) {
            request.template.data = { dataJson: request.template.dataItem.dataJson};
        }

        if (request.template.data.dataJson) {
            try {
                request.data = JSON.parse(request.template.data.dataJson);
            } catch(e) {
                reporter.logger.warn("Invalid json in data item: " + e.message);
                e.weak = true;
                return q.reject(e);
            }
        }

        return q();
    });
};