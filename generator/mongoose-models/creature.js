
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var creatureSchema = new Schema({
  creatureId: String,
  name: String,
  race: String,
  hp: String,
  ac: String,
  will: String,
  reflex: String,
  goldValue: String,
  xpValue: String,
  level: String,
  baseToHitAc: String,
  baseToHitWill: String,
  baseToHitReflex: String,
  damageModifier: String,
  speed: String,
  initiative: String,
  imageFilename: String
})

module.exports = mongoose.model('Creature', creatureSchema, 'creatures')