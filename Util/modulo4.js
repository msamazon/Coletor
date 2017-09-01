//modulo4
exports.calcule = function(text) {
    var convert = require('./Convert')

    return convert.hex2dec(text.substring(0, 2)) + '.' + 
            convert.hex2dec(text.substring(2, 4)) + '.' +
            convert.hex2dec(text.substring(4, 6)) + '.' +
            convert.hex2dec(text.substring(6, 8))
}

exports.inverter = function(text) {
    var convert = require('./Convert')

    return text.substring(6, 8) +
           text.substring(4, 6) +
           text.substring(2, 4) +
           text.substring(0, 2)
}