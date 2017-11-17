exports.send = function(eventCode, dongleCode) {

    var messageType = require("./Util/MessageType")
    var crcCalc = require("./Util/crcCalc")
    var UtcTime = require("./Util/utcTime")
    var random  = require("./Util/random")
    var convert = require('./Util/Convert')

    switch(eventCode) {
        
        case messageType.READ_VIN: {

            var pkgHeader = '4040'
            var pkgLen    = "1800"
            var randomNo  = convert.dec2hex(parseInt(random.calcule())) + "00" 
        
            var msgSemCRC = pkgHeader + pkgLen + dongleCode + eventCode.substring(2, 4) + eventCode.substring(0, 2) + randomNo
        
            var crc = crcCalc.calcule(msgSemCRC)

            var buffer = new Buffer([
                "0x" + pkgHeader.substring(0,2),
                "0x" + pkgHeader.substring(2,4),
                "0x18",
                "0x00",//4
                "0x" + dongleCode.substring(0,2),
                "0x" + dongleCode.substring(2,4),
                "0x" + dongleCode.substring(4,6),
                "0x" + dongleCode.substring(6,8),
                "0x" + dongleCode.substring(8,10),
                "0x" + dongleCode.substring(10,12),
                "0x" + dongleCode.substring(12,14),
                "0x" + dongleCode.substring(14,16),
                "0x" + dongleCode.substring(16,18),
                "0x" + dongleCode.substring(18,20),
                "0x" + dongleCode.substring(20,22),
                "0x" + dongleCode.substring(22,24),//16
                "0x" + messageType.READ_VIN.substring(2,4), //eventcode
                "0x" + messageType.READ_VIN.substring(0,2), //18
                "0x" + randomNo.substring(0, 2),
                "0x" + randomNo.substring(2, 4),
                "0x" + crc.substr(0, 2),
                "0x" + crc.substr(2, 4),
                "0x0d",//tail
                "0x0a" //tail
             ]);
             
            return buffer
        break
        }

        case messageType.READ_VEHICLE_DTCS: {
            
            var pkgHeader = '4040'
            var pkgLen    = "1900"
            var randomNo  = convert.dec2hex(parseInt(random.calcule())) + "00"
            var dtc       = "01"

            var msgSemCRC = pkgHeader + pkgLen + dongleCode + eventCode.substring(2,4) + eventCode.substring(0,2)  + randomNo + dtc
    
            var crc = crcCalc.calcule(msgSemCRC)

            var buffer = new Buffer([
                "0x" + pkgHeader.substring(0,2),
                "0x" + pkgHeader.substring(2,4),
                "0x19",
                "0x00",//4
                "0x" + dongleCode.substring(0,2),
                "0x" + dongleCode.substring(2,4),
                "0x" + dongleCode.substring(4,6),
                "0x" + dongleCode.substring(6,8),
                "0x" + dongleCode.substring(8,10),
                "0x" + dongleCode.substring(10,12),
                "0x" + dongleCode.substring(12,14),
                "0x" + dongleCode.substring(14,16),
                "0x" + dongleCode.substring(16,18),
                "0x" + dongleCode.substring(18,20),
                "0x" + dongleCode.substring(20,22),
                "0x" + dongleCode.substring(22,24),//16
                "0x" + messageType.READ_VEHICLE_DTCS.substring(2,4), //eventcode
                "0x" + messageType.READ_VEHICLE_DTCS.substring(0,2), //18
                "0x" + randomNo.substring(0, 2),
                "0x" + randomNo.substring(2, 4),
                "0x" + dtc,
                "0x" + crc.substr(0, 2),
                "0x" + crc.substr(2, 4),
                "0x0d",//tail
                "0x0a" //tail
             ]);
             
            return buffer
        break
        }
    }
}