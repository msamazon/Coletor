var mongoose  = require("mongoose")
var Schema    = mongoose.Schema

var DeviceSchema = new Schema({

    deviceId: String,
    dev_name_en: String,
    active: String, 
    firmware_id: String, 
    version_id: String,
    create_date: String,
    create_by : String,
    modify_date : String,
    modify_by : String,
    isAlive: Boolean
})

//Register schema to Mongoose
var Device = mongoose.model('DO_DEV_M00', DeviceSchema);

module.exports = Device