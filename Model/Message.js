var mongoose  = require("mongoose")
var Schema    = mongoose.Schema

var MessageSchema = new Schema({
  msg2json: String
})

//Register schema to Mongoose
var Message = mongoose.model('Message', MessageSchema);

module.exports = Message
