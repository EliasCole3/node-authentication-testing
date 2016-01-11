require('./app/routes-creature.js')(app, passport)
require('./app/routes-log-entry.js')(app, passport)
require('./app/routes-player-character.js')(app, passport)
require('./app/routes-item.js')(app, passport)
require('./app/routes-join-player-character-item.js')(app, passport)
require('./app/routes-non-player-character.js')(app, passport)
require('./app/routes-log.js')(app, passport)
require('./app/routes-join-player-character-power.js')(app, passport)
require('./app/routes-character-detail.js')(app, passport)
require('./app/routes-power.js')(app, passport)

db.createCollection("creatures")
db.createCollection("log_entries")
db.createCollection("player_characters")
db.createCollection("items")
db.createCollection("join_player_character_items")
db.createCollection("non_player_characters")
db.createCollection("logs")
db.createCollection("join_player_character_powers")
db.createCollection("character_details")
db.createCollection("powers")
