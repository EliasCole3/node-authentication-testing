module.exports = function(grunt) {

  grunt.initConfig({

    watch: {

      babel_main: {
        files: [
          'js/js-es6.js'
        ],
        tasks: ['babel:main'],
      },

      babel_testing: {
        files: [
          'js/testing-es6.js'
        ],
        tasks: ['babel:testing'],
      },

      babel_crud_items: {
        files: [
          'js/crud-items-es6.js'
        ],
        tasks: ['babel:crud_items'],
      },

    },

    
    babel: {
      options: {
        sourceMap: true
      },

      main: {
        files: {
          'js/js.js': 'js/js-es6.js'
        }
      },

      testing: {
        files: {
          'js/testing.js': 'js/testing-es6.js'
        }
      },

      crud_items: {
        files: {
          'js/crud-items.js': 'js/crud-items-es6.js'
        }
      }
      
    }

  })
 
  grunt.registerTask("default", ["watch"])

  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-babel')

 
}

