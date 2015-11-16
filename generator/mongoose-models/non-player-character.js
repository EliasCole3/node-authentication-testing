
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var nonPlayerCharacterSchema = new Schema({
  nonPlayerCharacterId: String,
  playerName: String,
  characterName: String,
  race: String,
  gClass: String,
  hp: String,
  ac: String,
  will: String,
  reflex: String,
  strength: String,
  constitution: String,
  dexterity: String,
  intelligence: String,
  wisdom: String,
  charisma: String,
  gold: String,
  xp: String,
  level: String,
  baseToHitAc: String,
  baseToHitWill: String,
  baseToHitReflex: String,
  damageModifier: String,
  speed: String,
  initiative: String,
  actionPoints: String,
  imageFilename: String
})

module.exports = mongoose.model('NonPlayerCharacter', nonPlayerCharacterSchema, 'non_player_characters')