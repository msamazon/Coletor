/**
 * findDeviceId - 'e uma função que verifica se o donglecode esta na white list (Device)
 */

exports.whitelist = function(code) {

    var mongoose        = require("mongoose")
    var Device           = require("../Model/Device")
    
    var result = false

    console.log("Cerberus::dongle %s", code)
    
    Device.find({"dongleCode": code}).exec(function (err, device) {

        console.log("Cerberus::code %s", code)

        console.log("Cerberus::dongleCode %s", device.dongleCode)

        if (device.dongleCode == code) {

            result = true
            console.log.apply("|||||||||||||||| %s", result)
            
        }else {
            result = false
            console.log.apply("|||||||||||||||| %s", result)
        }
    })

    console.log("Cerberus::result %s", result)

    return result
}    

 