/**
 * findDeviceId - 'e uma função que verifica se o donglecode esta na white list (Device)
 */

exports.whitelist = function(code) {

    var mongoose        = require("mongoose")
    var Device           = require("../Model/Device")
    
    var isOk = false

    console.log("Cerberus::dongle %s", code)
    
    Device.find({dongleCode: code}).exec(function (err, query) {

        console.log("Cerberus::code %s", code)

        console.log("Cerberus::Deive %s", query)

        console.log("Cerberus::dongleCode %s", query.dongleCode)

        if (query.dongleCode == code) {

            isOk = true
            console.log("|||||||||||||||| %s", isOk)
            
        }else {
            isOk = false
            console.log("|||||||||||||||| %s", isOk)
        }
    })

    console.log("Cerberus::result %s", isOk)

    return isOk
}    

 
