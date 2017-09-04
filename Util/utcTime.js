//utcTime
exports.calcule = function(timehex) {
    var convert = require('./Convert')

    var day           = convert.hex2dec(timehex.substring(0, 2))
    var month         = convert.hex2dec(timehex.substring(2, 4))
    var year          = convert.hex2dec(timehex.substring(4, 6))
    var hour          = convert.hex2dec(timehex.substring(6, 8))
    var minute        = convert.hex2dec(timehex.substring(8, 10))
    var second        = convert.hex2dec(timehex.substring(10, 12))
          
    result  =  day + "/" + month + "/"  + (20 + year) + " " + hour + ":"+ minute + ":" + second

    return result
}

exports.descalcule = function() {
    var convert = require('./Convert')


    var _date = new Date().toISOString().
        replace(/T/, ' ').      // replace T with a space
        replace(/\..+/, '')     // delete the dot and everything after

    var day       = _date.substring(8,10)
    var month     = _date.substring(5,7)
    var year      = _date.substring(2,4)
    var hour      = _date.substring(11,13)
    var min       = _date.substring(14,16)
    var sec       = _date.substring(17,19)

    var day           = convert.dec2hex(day)
    var month         = convert.dec2hex(month)
    var year          = convert.dec2hex(year)
    var hour          = convert.dec2hex(hour)
    var minute        = convert.dec2hex(min)
    var second        = convert.dec2hex(sec)
          
    result  =  ['0x' + day, '0x' + month, '0x' + year, '0x' + hour, '0x'+ minute, '0x' + second]

    return result
}