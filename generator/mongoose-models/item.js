
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var itemSchema = new Schema({
  itemId: String,
  name: String,
  cost: String,
  flavorText: String,
  effect: String,
  imageFilename: String
})

module.exports = mongoose.model('Item', itemSchema, 'items')