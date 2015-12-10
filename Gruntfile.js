module.exports = function(grunt) {

  grunt.initConfig({

    watch: {

      babel_main: {
        files: [
          'static/js/js-es6.js'
        ],
        tasks: ['babel:main'],
      },

      babel_testing: {
        files: [
          'static/js/testing-es6.js'
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
          'static/js/crud-creatures-es6.js'
        ],
        tasks: ['babel:crud_creatures'],
      },

      babel_crud_non_player_characters: {
        files: [
          'static/js/crud-non-player-characters-es6.js'
        ],
        tasks: ['babel:crud_non_player_characters'],
      },

      babel_crud_player_characters: {
        files: [
          'static/js/crud-player-characters-es6.js'
        ],
        tasks: ['babel:crud_player_characters'],
      },

      babel_crud_items: {
        files: [
          'static/js/crud-items-es6.js'
        ],
        tasks: ['babel:crud_items'],
      },

      babel_crud_logs: {
        files: [
          'static/js/crud-logs-es6.js'
        ],
        tasks: ['babel:crud_logs'],
      },

      babel_crud_log_entries: {
        files: [
          'static/js/crud-log-entries-es6.js'
        ],
        tasks: ['babel:crud_log_entries'],
      },

      babel_crud_powers: {
        files: [
          'static/js/crud-powers-es6.js'
        ],
        tasks: ['babel:crud_powers'],
      },

      babel_crud_character_details: {
        files: [
          'static/js/crud-character-details-es6.js'
        ],
        tasks: ['babel:crud_character_details'],
      },      

      babel_crud_join_player_character_powers: {
        files: [
          'static/js/crud-join-player-character-powers-es6.js'
        ],
        tasks: ['babel:crud_join_player_character_powers'],
      },

      babel_crud_join_player_character_items: {
        files: [
          'static/js/crud-join-player-character-items-es6.js'
        ],
        tasks: ['babel:crud_join_player_character_items'],
      }

    },

    
    babel: {
      options: {
        sourceMap: true
      },

      main: {
        files: {
          'static/js/js.js': 'static/js/js-es6.js'
        }
      },

      testing: {
        files: {
          'static/js/testing.js': 'static/js/testing-es6.js'
        }
      },

      crud_items: {
        files: {
          'static/js/crud-items.js': 'static/js/crud-items-es6.js'
        }
      },
      
      crud_creatures: {
        files: {
          'static/js/crud-creatures.js': 'static/js/crud-creatures-es6.js'
        }
      },

      crud_non_player_characters: {
        files: {
          'static/js/crud-non-player-characters.js': 'static/js/crud-non-player-characters-es6.js'
        }
      },

      crud_player_characters: {
        files: {
          'static/js/crud-player-characters.js': 'static/js/crud-player-characters-es6.js'
        }
      },

      crud_items: {
        files: {
          'static/js/crud-items.js': 'static/js/crud-items-es6.js'
        }
      },

      crud_logs: {
        files: {
          'static/js/crud-logs.js': 'static/js/crud-logs-es6.js'
        }
      },

      crud_log_entries: {
        files: {
          'static/js/crud-log-entries.js': 'static/js/crud-log-entries-es6.js'
        }
      },

      crud_powers: {
        files: {
          'static/js/crud-powers.js': 'static/js/crud-powers-es6.js'
        }
      },

      crud_character_details: {
        files: {
          'static/js/crud-character-details.js': 'static/js/crud-character-details-es6.js'
        }
      },

      crud_join_player_character_items: {
        files: {
          'static/js/crud-join-player-character-items.js': 'static/js/crud-join-player-character-items-es6.js'
        }
      },

      crud_join_player_character_powers: {
        files: {
          'static/js/crud-join-player-character-powers.js': 'static/js/crud-join-player-character-powers-es6.js'
        }
      }
      
    }

  })
 
  grunt.registerTask("default", ["watch"])

  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-babel')

 
}

