
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var logEntrySchema = new Schema({
  logEntryId: String,
  message: String,
  date: String,
  logId: String
})

module.exports = mongoose.model('LogEntry', logEntrySchema, 'log_entries')