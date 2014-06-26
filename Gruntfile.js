module.exports = function(grunt) {
    
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
            test: { files: [{ src: ['./config/test.playground.json'], dest: './test.config.json' }, { src: ['./config/playground.web.config'], dest: './web.config' }] },
            production: { files: [{ src: ['./config/production.playground.config.json'], dest: './prod.config.json' }, { src: ['./config/playground.web.config'], dest: './web.config' }] }
        },

        watch: {
            extensions: {
                files: ['extension/**/main.js'],
                tasks: ['exec:buildDev']
            }
        },
        exec: {
            installJsReport : {
                cmd: "npm install",
                cwd: require("path").join("node_modules", "jsreport")
            },
            buildDev : {
                cmd: "grunt development --root=" + __dirname,
                cwd: require("path").join("node_modules", "jsreport")
            },
            buildProd : {
                cmd: "grunt production --root=" + __dirname,
                cwd: require("path").join("node_modules", "jsreport")
            }
        }
    });

    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['init']);

    grunt.registerTask('afterInstall', ['exec:installJsReport', 'development', 'production']);

    grunt.registerTask('development', ['exec:buildDev']);
    grunt.registerTask('production', [ 'copy:production', 'exec:buildProd']);

    grunt.registerTask('test-all', ['mochaTest:testAll']);
    grunt.registerTask('test', ['mochaTest:test']);
    grunt.registerTask('test-exact', ['mochaTest:testExact']);
};