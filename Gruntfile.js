const path = require('path');
module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-karma');
    // Project configuration.
    grunt.initConfig({
        karma: {
            options : {
                frameworks: ['mocha', 'chai'],
                reporters: ['progress'],
                port: 9876,
                browsers: ['Chrome'],
                singleRun: true,
                files : [
                    'node_modules/babylonjs/babylon.js', 'dist/_r.min.js'
                ]
            },
            allInPatch : {
                proxies : {
                    '/' : '/base/test/all-in-patch/'
                },
                files : [
                    {
                      src : [ 'test/all-in-patch/scene.patch' ],
                      included : false,
                      served : true
                    },
                    {
                        src : [  'test/all-in-patch/test.js']
                    },
                ]
            },
            animate : {
                files : [
                    { src : [ 'test/animate/test.js'] }
                ]
            },
            customEvents : {
                files : [
                    { src : [  'test/custom-events/test.js'] },
                ]
            },
            data : {
                files : [
                    { src : ['test/data/test.js']}
                ]
            },
            fresnelParameters : {
                files : [
                    { src : [ 'test/fresnelParameters/test.js']}
                ]
            },
            gizmo : {
                files : [
                    { src : [ 'test/gizmo/test.js']}
                ]
            },
            is : {
                files : [
                    { src : ['test/is/test.js']}
                ]
            },
            /**
             keyEvents : {
                files : [
                    { src : [ 'test/keyEvents/test.js']}
                ]
            },**/
            launchWithPatch : {
                proxies : {
                    '/' : '/base/test/launch-with-patch/'
                },
                files : [
                    {
                        src : [ 'test/launch-with-patch/*.patch' ],
                        included : false,
                        served : true
                    },
                    {
                        src : [  'test/launch-with-patch/test.js']
                    },
                ]
            },
            load : {
                proxies : {
                    '/' : '/base/test/load/'
                },
                files : [
                    {
                        src : [ 'test/load/*.json', 'test/load/*.css', 'test/load/app.js' ],
                        included : false,
                        served : true
                    },
                    { src : [ 'test/load/test.js' ]}
                ]
            },
            /** LOADING SCREEN **/
            /**
            meshEvents : {
                files : [
                    { src : ['test/meshEvents/test.js']}
                ]
            },
           **/
            nolaunch : {
                files : [
                    { src : [  'test/no-launch/test.js'] },
                ]
            },
            patch : {
                files : [
                    { src : ['test/patch/test.js']}
                ]
            },
            patchParallel : {
                files : [
                    { src : ['test/patchParallel/test.js']}
                ]
            },
            playground : {
                files : [
                    { src : [  'test/playground-paste/test.js'] },
                ]
            },
            plugins : {
                files : [
                    { src : ['test/plugins/test.js']}
                ]
            },
            queryString : {
                files : [
                    { src : ['test/queryString/test.js']}
                ]
            },
            selectors : {
                files : [
                    { src : [  'test/selectors/test.js'] },
                ]
            },
        }
    });
    // Default task(s).
    grunt.registerTask('default', ['karma']);

};
