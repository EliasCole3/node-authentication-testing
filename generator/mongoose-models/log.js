
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var logSchema = new Schema({
  logId: String,
  logName: String,
  playerCharacterId: String
})

module.exports = mongoose.model('Log', logSchema, 'logs')