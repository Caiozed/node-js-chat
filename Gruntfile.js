module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    requirejs: {
          compile: {
            options: {
              baseUrl: 'client/',
              mainConfigFile: 'client/js/main.js',
              include: [ 'js/main.js',  'js/libs/require.js' ],
              out: 'client/js/build/optimized.js',
            }
          }
        },
        
        sass: {
          dist: {                            // Target
            options: {                       // Target options
              style: 'expanded'
            },
            files: {                         // Dictionary of files
              'client/css/main.css': 'client/css/main.scss'       // 'destination': 'source'
            }
          }
        },
        
        cssmin: {
          options: {
            mergeIntoShorthands: false,
            roundingPrecision: -1
          },
          target: {
            files: {
              'client/css/build/master.css': ['client/css/libs/*.css','client/css/*.css']
            }
          }
        },
        
        watch: {
          scripts: {
            files: ['client/js/**/*.js', 'client/css/*.scss'],
            tasks: ['requirejs', 'sass', 'cssmin'],
            options: {
              spawn: false,
            },
          },
        }
    });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  // Default task(s).
  grunt.registerTask('default', ['watch']);

};