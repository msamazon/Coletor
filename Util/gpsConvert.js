exports.calcule = function(gpshex) {
        
    var utcTime = require("./utcTime.js")
    var convert = require('./Convert')
    var modulo4 = require('./modulo4')

    console.log("|||||||||||||||||||||||||||||||||||||||||||")

    console.log("GPS %s", gpshex)
       
    var utcTimeGps    = gpshex.substring(0, 0 + (2 * 6))
    var statusGps     = gpshex.substring(12, 12 + (2 * 1))
    var latitude      = gpshex.substring(14, 14 + (2 * 4))
    var longitude     = gpshex.substring(22, 22 + (2 * 4))
    var speed         = gpshex.substring(30, 30 + (2 * 2))
    var course        = gpshex.substring(34, 34 + (2 * 2))
    var high          = gpshex.substring(38, 38 + (2 * 2))

    utcTimeGps = utcTime.calcule(utcTimeGps)
        
    console.log("utcTimeGps %s", utcTimeGps)  
        
    console.log("statusGps: %s", statusGps)

    statusGps = convert.hex2bin(statusGps)

    var statusLen = statusGps.length

    if (statusLen == 0) {
        statusGps = "00000000"
    }
    if (statusLen == 2) {
        statusGps = "000000" + statusGps
    }
    if (statusLen == 4) {
        statusGps = "0000" + statusGps
    }
    if (statusLen == 6) {
        statusGps = "00" + statusGps
    }
    if (statusLen == 8) {
            statusGps = statusGps
    }

    console.log("statusGps: %s", statusGps)

    var bit01 = statusGps.substring(6, 8)
    var bit2 = statusGps.substring(5, 6)
    var bit3 = statusGps.substring(4, 5)

    if (bit01 ==  "00") { 
        bit01 = "Not fixed"
    }

    if (bit01 ==  "10" || bit01 == "11"){ 
        bit01 = "fixed"
    }

    
    if (bit2 ==  "1") { 
        console.log("N %",bit2)
        bit2 = ""
    }else {
        bit2 = "-"
        console.log("S %",bit2)
    }
    
    if (bit3 ==  "1") { 
        bit3 = ""
        console.log("L %",bit3)
    }else {
        bit3 = "-"
        console.log("O %",bit3)
    }

        //lat e long
        // console.log ("latitude %s", latitude)
        // console.log ("longitude %s", longitude)
    var latInvert  =  convert.hex2dec(modulo4.inverter(latitude))
    var longInvert =  convert.hex2dec(modulo4.inverter(longitude))

        // console.log ("latitude %s", latInvert)
        // console.log ("longitude %s", longInvert)

    var latDeci  = latInvert / 3600000
    var longDeci = longInvert / 3600000

        //console.log("latDeci %s %s", bit2, latDeci)
        //console.log("longDeci %s %s", bit3, longDeci)

    //TODO
    //speed
    speed = convert.hex2dec(speed.substring(2, 4) +  speed.substring(0, 2)) * 0.1 //TODO 
    //course
    high = convert.hex2dec(high.substring(2, 4) +  high.substring(0, 2)) * 0.1 //TODO

    course = convert.hex2dec(course.substring(2, 4) +  course.substring(0, 2)) * 0.1 //TODO

    var result = bit2 + latDeci + ", " + bit3 + longDeci

    console.log("result : %s", result)
    return result
}