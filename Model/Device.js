var mongoose  = require("mongoose")
var Schema    = mongoose.Schema

var DeviceSchema = new Schema({
    dongleCode: String,
    hardwareVersion: String, 
    firmwareVersion: String, 
    obdModule: String, 
    status: String, 
    name: String,
    group: String 
})

//Register schema to Mongoose
var Device = mongoose.model('Device', DeviceSchema);

module.exports = Device