define(["underscore", "jquery", "app"], function (_, $, app) {

    function getUIState(model) {
        var state = model.toJSON();

        state.content = state.content || " ";
        state.helpers = state.helpers || "";

        delete state._id;
        return state;
    }

    function addInput(form, name, value) {
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
    }

    var fn = function (model, beforeRenderListeners, target) {

        var uiState = getUIState(model);

        var request = { template: uiState, options: $.extend({ preview: true}, uiState.options ) };

        beforeRenderListeners.fire(request, function (er) {
            if (er) {
                app.trigger("error", { responseText: er });
                return;
            }

            if (app.recipes[uiState.recipe] && app.recipes[uiState.recipe].render) {
                return app.recipes[uiState.recipe].render(request, target);
            }

            var mapForm = document.createElement("form");
            mapForm.target = target;
            mapForm.method = "POST";
            mapForm.action = app.serverUrl + "api/report?studio=" + app.options.studio;

            function addBody(path, body) {
                if (body == null)
                    return;

                for (var key in body) {
                    if (_.isObject(body[key])) {
                        // somehow it skips empty array for template.scripts, this condition fixes that
                        if (body[key] instanceof Array && body[key].length === 0) {
                            addInput(mapForm, path + "[" + key + "]", []);
                        }
                        addBody(path + "[" + key + "]", body[key]);
                    } else {
                        if (body[key] !== undefined && !(body[key] instanceof Array)) {
                            addInput(mapForm, path + "[" + key + "]", body[key]);
                        }
                    }
                }
            }

            addBody("template", uiState);
            if (request.options != null)
                addBody("options", request.options);

            if (request.data != null)
                addInput(mapForm, "data", request.data);

            var headers = app.headers || {};
            headers["host-cookie"] = document.cookie;
            addBody("headers", headers);

            app.trigger("preview-form-submit", mapForm);
            document.body.appendChild(mapForm);
            mapForm.submit();
            app.trigger("after-template-render");
        });
    };

    return fn;
});
