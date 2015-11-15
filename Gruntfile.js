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

      // babel_crud_items: {
      //   files: [
      //     'js/crud-items-es6.js'
      //   ],
      //   tasks: ['babel:crud_items'],
      // },

      babel_crud_creatures: {
        files: [
          'js/crud-creatures-es6.js'
        ],
        tasks: ['babel:crud_creatures'],
      },

      babel_crud_non_player_characters: {
        files: [
          'js/crud-non-player-characters-es6.js'
        ],
        tasks: ['babel:crud_non_player_characters'],
      },

      babel_crud_player_characters: {
        files: [
          'js/crud-player-characters-es6.js'
        ],
        tasks: ['babel:crud_player_characters'],
      },

      babel_crud_items: {
        files: [
          'js/crud-items-es6.js'
        ],
        tasks: ['babel:crud_items'],
      },

      babel_crud_logs: {
        files: [
          'js/crud-logs-es6.js'
        ],
        tasks: ['babel:crud_logs'],
      },

      babel_crud_log_entries: {
        files: [
          'js/crud-log-entries-es6.js'
        ],
        tasks: ['babel:crud_log_entries'],
      },

      babel_crud_powers: {
        files: [
          'js/crud-powers-es6.js'
        ],
        tasks: ['babel:crud_powers'],
      }

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
      },
      
      crud_creatures: {
        files: {
          'js/crud-creatures.js': 'js/crud-creatures-es6.js'
        }
      },

      crud_non_player_characters: {
        files: {
          'js/crud-non-player-characters.js': 'js/crud-non-player-characters-es6.js'
        }
      },

      crud_player_characters: {
        files: {
          'js/crud-player-characters.js': 'js/crud-player-characters-es6.js'
        }
      },

      crud_items: {
        files: {
          'js/crud-items.js': 'js/crud-items-es6.js'
        }
      },

      crud_logs: {
        files: {
          'js/crud-logs.js': 'js/crud-logs-es6.js'
        }
      },

      crud_log_entries: {
        files: {
          'js/crud-log-entries.js': 'js/crud-log-entries-es6.js'
        }
      },

      crud_powers: {
        files: {
          'js/crud-powers.js': 'js/crud-powers-es6.js'
        }
      }
      
    }

  })
 
  grunt.registerTask("default", ["watch"])

  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-babel')

 
}

