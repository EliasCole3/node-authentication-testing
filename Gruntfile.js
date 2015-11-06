module.exports = function(grunt) {

  grunt.initConfig({

    watch: {
      // scss: {
      //   files: ['css/**/*.scss'],
      //   tasks: ['sass:build'],
      // },
      babel: {
        files: [
          'js/js-es6.js'
        ],
        tasks: ['babel'],
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
    
    sass: {                                           // Task
      build: {                                        // Target
        options: {                                   
          style: 'expanded'
        },
        files: {                                     
          'build/css/css.css': 'css/scss.scss',       // 'destination': 'source'
        }
      }
    },
    
    babel: {
      options: {
        sourceMap: true
      },
      build: {
        files: {
          'js/js.js': 'js/js-es6.js'
        }
      }
    },

    react: {
      single_file_output: {
        files: {
          'js/test.js': 'js/test.jsx',
          'js/js.js': 'js/js.jsx'
        }
      }
    },

    shell: {
      dirListing: {
        command: 'ls'
      }
    },

    browserify: {
      dist: {
        files: {
          'js/bundle.js': ['js/js.js'],
          'js/yEd-builder-bundle.js': ['js/yEd-builder.js'],
        }
      }
    }

  });
 
  grunt.registerTask("default", ["watch"]);
 
  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-browserify');
 
};

