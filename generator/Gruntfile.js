module.exports = function(grunt) {

  grunt.initConfig({

    watch: {
      babel: {
        files: [
          'generator-es6.js'
        ],
        tasks: ['babel'],
      }
    },
    
    babel: {
      options: {
        sourceMap: true
      },
      build: {
        files: {
          'generator.js': 'generator-es6.js'
        }
      }
    }

  });
 
  grunt.registerTask("default", ["watch"]);

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-babel'); 
};

