module.exports = function(grunt) {
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mochaTest: {
            test: {
                src: ['extension/*/test/*.js', 'test/*.js']
            }
        },

        copy: {
            test: { files: [{ src: ['./config/test.playground.json'], dest: './test.config.json' }, { src: ['./config/playground.web.config'], dest: './web.config' }] },
            production: { files: [{ src: ['./config/production.playground.config.json'], dest: './prod.config.json' }, { src: ['./config/playground.web.config'], dest: './web.config' }] }
        },

        watch: {
            dev: {
                files: ['extension/**/main.js'],
                tasks: ['exec:buildDev']
            },
            prod: {
                files: ['extension/*/public/js/*.js'],
                tasks: ['exec:buildProd']
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

    grunt.registerTask('default', ['prepublish']);
    grunt.registerTask('prepublish', ['exec:installJsReport', 'exec:buildDev', 'exec:buildProd']);

    grunt.registerTask('build', ['exec:buildDev', 'copy:production', 'exec:buildProd']);
    grunt.registerTask('watch-build-dev', ['watch:dev']);
    grunt.registerTask('watch-build-prod', ['watch:prod']);

    grunt.registerTask('deploy-test', ['exec:buildDev', 'exec:buildProd', 'copy:deployTest']);
    grunt.registerTask('deploy-prod', ['exec:buildDev', 'exec:buildProd', 'copy:deployProd']);

    grunt.registerTask('test', ['mochaTest:test']);
};