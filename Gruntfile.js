module.exports = function(grunt) {

  grunt.initConfig({

    watch: {
      // scss: {
      //   files: ['css/**/*.scss'],
      //   tasks: ['sass:build'],
      // },
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
      // react: {
      //   files: ['js/test.jsx', 'js/js.jsx'],
      //   tasks: ['react'],
      // },
      // browserify: {
      //   files: ['js/js.js', 'js/yEd-builder.js'], 
      //   tasks: ['browserify']
      // }
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
      }
    }

  })
 
  grunt.registerTask("default", ["watch"])

  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-babel')

 
}

