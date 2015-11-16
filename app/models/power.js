
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var powerSchema = new Schema({
  powerId: String,
  name: String,
  type: String,
  flavorText: String,
  attackType: String,
  damage: String,
  effect: String,
  description: String,
  upgrade: String,
  imageFilename: String
})

module.exports = mongoose.model('Power', powerSchema, 'powers')