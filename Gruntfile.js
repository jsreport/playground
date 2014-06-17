module.exports = function(grunt) {

    var commonPath = {
        jquery: "empty:",
        marionette: "empty:",
        async: "empty:",
        underscore: "empty:",
        toastr: "empty:",
        deferred: "empty:",
        app: "empty:",
        backbone: "empty:",
        ace: "empty:",
        "ace/ace": "empty:",
        "core/basicModel": "empty:",
        "core/jaydataModel": "empty:",
        "core/aceBinder": "empty:",
        "core/view.base": "empty:",
        "core/dataGrid": "empty:",
        "jsrender.bootstrap": "empty:",
        "core/utils": "empty:",
        "core/listenerCollection": "empty:"
    };

    function extensionOptimalization(name) {
        return {
            options: {
                paths: commonPath,
                baseUrl: "./extension/" + name + "/public/js",
                out: "extension/" + name + "/public/js/main_built.js",
                optimize: "none",
                name: "main",
                onBuildWrite: function(moduleName, path, contents) {
                    var regExp = new RegExp("\"[.]/", "g");
                    return contents.replace("define('main',", "define(").replace(regExp, "\"");
                }
            }
        };
    }

    var extensions = ["templates-playground","scripts-playground", "data-playground", "images-playground", "examples"];

    function copyFiles() {
        var result = [];

        result.push({ src: ['extension/express/public/js/app.js'], dest: 'extension/express/public/js/app_dev.js' });

        extensions.forEach(function(e) {
            result.push({
                src: "extension/" + e + "/public/js/main.js",
                dest: "extension/" + e + "/public/js/main_dev.js"
            });
        });

        return result;
    }
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mochaTest: {
            testExact: {
                src: ['extension/images-playground/test/*.js']
            },
            test: {
                src: ['extension/*/test/*.js', 'test/*.js']
            },
            testAll: {
                src: ['extension/*/test/*.js', 'test/*.js', 'extension/*/integrationTest/*.js']           
            }
        },

        copy: {
            dev: { files: copyFiles() },
            test: { files: [{ src: ['./config/test.playground.json'], dest: './test.config.json' }, { src: ['./config/playground.web.config'], dest: './web.config' }] },
            production: { files: [{ src: ['./config/production.playground.config.json'], dest: './prod.config.json' }, { src: ['./config/playground.web.config'], dest: './web.config' }] }
        },

        requirejs: {
            compileTemplates: extensionOptimalization("templates-playground"),
            compileImages: extensionOptimalization("images-playground"),
            compileScripts: extensionOptimalization("scripts-playground"),
            compileData: extensionOptimalization("data-playground"),
            compileExamples: extensionOptimalization("examples")
        },
        watch: {
            extensions: {
                files: ['extension/**/main.js'],
                tasks: ['copy:dev']
            }
        }
    });

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['init']);

    grunt.registerTask('init', ['development', 'production', 'watch']);

    grunt.registerTask('deploy', ['requirejs']);

    grunt.registerTask('development', ['copy:dev']);
    grunt.registerTask('production', [ 'copy:production', 'requirejs']);

    grunt.registerTask('test-all', ['mochaTest:testAll']);
    grunt.registerTask('test', ['mochaTest:test']);
    grunt.registerTask('test-exact', ['mochaTest:testExact']);
};