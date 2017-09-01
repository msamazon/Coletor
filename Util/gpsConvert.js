module.exports = function() {
    this.gpsConvert = function(gpshex) {

        var utcTime = require("./utcTime.js")
        var convert = require('./Convert')

        // console.log("|||||||||||||||||||||||||||||||||||||||||||")

        // console.log("GPS %s", gpshex)
        
        var utcTimeGps    = gpshex.substring(0, 0 + (2 * 6))
        var latitude      = gpshex.substring(12, 12 + (2 * 4))
        var longitude     = gpshex.substring(20, 20 + (2 * 4))
        var speed         = gpshex.substring(28, 28 + (2 * 2))
        var course        = gpshex.substring(32, 32 + (2 * 2))
        var high          = gpshex.substring(36, 36 + (2 * 2))

        utcTimeGps = utcTime.calcule(utcTimeGps)
        
        //console.log("utcTimeGps %s", utcTimeGps)                   

        var statusGps     = gpshex.substring(12, 12 + (2*1))
                  
        statusGps = convert.hex2bin('0c')
        
        var s = "00000000" + statusGps;
        
        statusGps = s.substring(s.length, statusGps.length)
                  
        var bit0 = statusGps.substring(0, 2)
        var bit1 = statusGps.substring(2, 4)
        var bit2 = statusGps.substring(4, 6)
        var bit3 = statusGps.substring(6, 8)

        //lat e long

        var latInvert  =  latitude.substring(6, 8) + latitude.substring(4, 6) + latitude.substring(2, 4) + latitude.substring(0, 2)
        var longInvert =  longitude.substring(6, 8) + longitude.substring(4, 6) + longitude.substring(2, 4) + longitude.substring(0, 2)

        //console.log("latInvert %s", latInvert)

        var latDeci  = convert.hex2dec(latInvert) / 3600000
        var longDeci = convert.hex2dec(longInvert) / 3600000

        //console.log("latDeci %s",latDeci )
        //console.log("longDeci %s", longDeci)

        //TODO
        //speed
        //course
        high = convert.hex2dec(high.substring(2, 4) +  high.substring(0, 2)) * 0.1 //TODO


        return ''
    }
}