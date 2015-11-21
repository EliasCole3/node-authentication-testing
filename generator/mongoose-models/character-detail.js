
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var characterDetailSchema = new Schema({
  characterDetailId: String,
  backstory: String,
  playerCharacterId: String
})

module.exports = mongoose.model('CharacterDetail', characterDetailSchema, 'character_details')