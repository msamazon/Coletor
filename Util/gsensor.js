exports.calcule = function(s) {
    var convert       = require('./Convert')
    
    var x = convert.vhex2dec(s.substring(0, 4))
    var y = convert.vhex2dec(s.substring(4, 8))
    var z = convert.vhex2dec(s.substring(8, 12))
    return [x, y, z]
}
