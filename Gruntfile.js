/*!
 * Task automation for jsreport playground
 *
 * grunt build # build, combine and minify files including also jsreport npm module
 * grunt watch-build # listen to main.js file changes and copy content to main_dev.js automatically
 * grunt test # start tests, mongo need to be running
 */


module.exports = function(grunt) {
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mochaTest: {
            test: {
                src: ['extension/*/test/*.js', 'test/*.js']
            }
        },

        copy: {
            deployTest: { files: [{ src: ['./config/test.playground.json'], dest: './test.config.json' }, { src: ['./config/playground.web.config'], dest: './web.config' }] },
            deployProd: { files: [{ src: ['./config/production.playground.config.json'], dest: './prod.config.json' }, { src: ['./config/playground.web.config'], dest: './web.config' }] }
        },

        watch: {
            dev: {
                files: ['extension/**/main.js'],
                tasks: ['exec:buildDev']
            }
        },
        exec: {
            installJsReport : {
                cmd: "npm install",
                cwd: require("path").join("node_modules", "jsreport")
            },
            build : {
                cmd: "grunt build --root=" + __dirname,
                cwd: require("path").join("node_modules", "jsreport")
            }
        }
    });

    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['prepublish']);
    grunt.registerTask('prepublish', ['exec:installJsReport', 'exec:build']);

    grunt.registerTask('build', ['exec:build']);
    grunt.registerTask('watch-build', ['watch:dev']);

    grunt.registerTask('deploy-test', ['exec:build', 'copy:deployTest']);
    grunt.registerTask('deploy-prod', ['exec:build', 'copy:deployProd']);

    grunt.registerTask('test', ['mochaTest:test']);
};