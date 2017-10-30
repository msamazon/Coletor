/**
 * findDeviceId - 'e uma função que verifica se o donglecode esta na white list (Device)
 */

exports.whitelist = function(dongleCode) {

    var mongoose        = require("mongoose")
    var Device           = require("../Model/Device")
    
    var result = false

    console.log("Cerberus::dongle %s", dongleCode)
    
    Device.find({"dongleCode": dongleCode}).exec(function (err, device) {

        if (device.dongleCode == device) {
            result = true
            
        }else {
            result = false
        }
    })
    return result
}    

 