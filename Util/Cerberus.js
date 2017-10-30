/**
 * findDeviceId - 'e uma função que verifica se o donglecode esta na white list (Device)
 */

exports.whitelist = function(code) {

    var mongoose        = require("mongoose")
    var Device           = require("../Model/Device")
    
    var isValid = false
    
    Device.findOne({dongleCode: code}).exec(function (err, query) {

        if (query.dongleCode == code) {

            isValid = true
            
        }else {
            isValid = false
        }
    })

    return isValid
}