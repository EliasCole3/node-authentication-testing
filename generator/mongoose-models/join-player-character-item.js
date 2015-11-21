
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var joinPlayerCharacterItemSchema = new Schema({
  joinPlayerCharacterItemId: String,
  itemId: String,
  playerCharacterId: String,
  count: String
})

module.exports = mongoose.model('JoinPlayerCharacterItem', joinPlayerCharacterItemSchema, 'join_player_character_items')