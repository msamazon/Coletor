//convert
exports.bin2dec = function(s) {
    return parseInt(s, 2).toString(10)
}

exports.bin2hex = function(s) {
    return parseInt(s, 2).toString(16)
}

exports.dec2bin = function(s) {
    return parseInt(s, 10).toString(2)
}

exports.dec2hex = function(s) {
    return parseInt(s, 10).toString(16)
}

exports.hex2bin = function(s) {
    return parseInt(s, 16).toString(2)
}

exports.hex2dec = function(s) {
    return parseInt(s, 16).toString(10)
}

exports.vhex2dec = function(s) {

    var result = ''
    
    if(s.substring(2, 4) == 'ff') {
        result = -(256 - parseInt(s.substring(0, 2), 16))

    }else {
        result = parseInt(s.substring(2, 4) + s.substring(0, 2), 16)
    } 
    return result
}

exports.hex2ascii = function(s) {
    var hex = s.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}