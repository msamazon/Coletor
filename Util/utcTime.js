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