
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var joinPlayerCharacterPowerSchema = new Schema({
  joinPlayerCharacterPowerId: String,
  powerId: String,
  playerCharacterId: String
})

module.exports = mongoose.model('JoinPlayerCharacterPower', joinPlayerCharacterPowerSchema, 'join_player_character_powers')