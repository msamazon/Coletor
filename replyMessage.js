
module.exports = function() {

    this.replyMessage = function(message) {
        var messageType = require("./Util/MessageType")

        var crcCalc = require("./Util/crcCalc")

        const convert = {
            bin2dec : s => parseInt(s, 2).toString(10),
            bin2hex : s => parseInt(s, 2).toString(16),
            dec2bin : s => parseInt(s, 10).toString(2),
            dec2hex : s => parseInt(s, 10).toString(16),
            hex2bin : s => parseInt(s, 16).toString(2),
            hex2dec : s => parseInt(s, 16).toString(10)
        }
        
        console.log("----------- reply Message -----------")

        switch(message.eventcode) {

            case messageType.LOGIN:
            
                var pkgHeader       = message.packageHead
                
                var pkgLen          = "2200"

                var unitCode        = message.dongleCode
                
                var eventCode       = messageType.LOGIN_REPLY

                var reconnectedIp   = "ffffffff"

                var reconnectedPort = "0000"

                var _date = new Date().toISOString().
                    replace(/T/, ' ').      // replace T with a space
                    replace(/\..+/, '')     // delete the dot and everything after

                var day       = _date.substring(8,10)
                var month     = _date.substring(5,7)
                var year      = _date.substring(2,4)
                var hour      = _date.substring(11,13)
                var min       = _date.substring(14,16)
                var sec       = _date.substring(17,19)
              
                var utcTime   = day + month + year + hour + min + sec

                var msgSemCRC = pkgHeader + pkgLen + unitCode + eventCode +  
                    reconnectedIp + reconnectedPort + utcTime
                                
                var crc       = crcCalc.calcule(msgSemCRC)

                var buffer = new Buffer([
                    "0x" + message.packageHead.substring(0,2),
                    "0x" + message.packageHead.substring(2,4),
                    "0x22", 
                    "0x00",//4
                    "0x" + message.dongleCode.substring(0,2), //dongle
                    "0x" + message.dongleCode.substring(2,4),
                    "0x" + message.dongleCode.substring(4,6),
                    "0x" + message.dongleCode.substring(6,8),
                    "0x" + message.dongleCode.substring(8,10),
                    "0x" + message.dongleCode.substring(10,12),
                    "0x" + message.dongleCode.substring(12,14),
                    "0x" + message.dongleCode.substring(14,16),
                    "0x" + message.dongleCode.substring(16,18),
                    "0x" + message.dongleCode.substring(18,20),
                    "0x" + message.dongleCode.substring(20,22),
                    "0x" + message.dongleCode.substring(22,24),//16
                    "0x" + messageType.ALARM_REPLAY.substr(0, 2),
                    "0x" + messageType.ALARM_REPLAY.substr(2, 4),
                    "0xFF", //Re‐connected IP
                    "0xFF",
                    "0xFF",
                    "0xFF",
                    "0x00", //port
                    "0x00",//24
                    "0x" + convert.dec2hex(day), //utc time
                    "0x" + convert.dec2hex(month),
                    "0x" + convert.dec2hex(year.substring(2, 4)),
                    "0x" + convert.dec2hex(hour),
                    "0x" + convert.dec2hex(min),
                    "0x" + convert.dec2hex(sec),
                    "0x" + crc.substr(0, 2),
                    "0x" + crc.substr(2, 4),
                    "0x0d",
                    "0x0a"//34
                ]);
                return [1, buffer]

            break

            case messageType.MAINTENANCE:
            
                var pkgHeader = message.packageHead
        
                var pkgLen    = "1600"

                var unitCode  = message.dongleCode
        
                var eventCode = messageType.MAINTENANCE_REPLAY

                var msgSemCRC = pkgHeader + pkgLen + unitCode + eventCode
                        
                var crc       = crcCalc.calcule(msgSemCRC)

                var buffer    = new Buffer([
                    "0x" + message.packageHead.substring(0,2),
                    "0x" + message.packageHead.substring(2,4),
                    "0x16",
                    "0x00",//4
                    "0x" + message.dongleCode.substring(0,2),
                    "0x" + message.dongleCode.substring(2,4),
                    "0x" + message.dongleCode.substring(4,6),
                    "0x" + message.dongleCode.substring(6,8),
                    "0x" + message.dongleCode.substring(8,10),
                    "0x" + message.dongleCode.substring(10,12),
                    "0x" + message.dongleCode.substring(12,14),
                    "0x" + message.dongleCode.substring(14,16),
                    "0x" + message.dongleCode.substring(16,18),
                    "0x" + message.dongleCode.substring(18,20),
                    "0x" + message.dongleCode.substring(20,22),
                    "0x" + message.dongleCode.substring(22,24),//16
                    "0x" + messageType.MAINTENANCE_REPLAY.substring(0,2), //eventcode
                    "0x" + messageType.MAINTENANCE_REPLAY.substring(2,4),
                    "0x" + crc.substr(0, 2),
                    "0x" + crc.substr(2, 4),
                    "0x0d",//tail
                    "0x0a" //tail //22
                ]);
                return [1 , buffer]
            break
            
            case messageType.COMPREHENSIVE_DATA_SUPPLEMENT:
            case messageType.COMPREHENSIVE_DATA:
                return [0 , new Buffer([0x00, 0x00])]
            break

            case messageType.ALARM:

                var pkgHeader = message.packageHead
    
                var pkgLen = "1800"

                var unitCode = message.dongleCode
    
                var eventCode = messageType.MAINTENANCE_REPLAY

                var msgSemCRC = pkgHeader + pkgLen + unitCode + eventCode
                
                var crc = crcCalc.calcule(msgSemCRC)

                var buffer = new Buffer([
                    "0x" + message.packageHead.substring(0,2),
                    "0x" + message.packageHead.substring(2,4),
                    "0x18",
                    "0x00",//4
                    "0x" + message.dongleCode.substring(0,2),
                    "0x" + message.dongleCode.substring(2,4),
                    "0x" + message.dongleCode.substring(4,6),
                    "0x" + message.dongleCode.substring(6,8),
                    "0x" + message.dongleCode.substring(8,10),
                    "0x" + message.dongleCode.substring(10,12),
                    "0x" + message.dongleCode.substring(12,14),
                    "0x" + message.dongleCode.substring(14,16),
                    "0x" + message.dongleCode.substring(16,18),
                    "0x" + message.dongleCode.substring(18,20),
                    "0x" + message.dongleCode.substring(20,22),
                    "0x" + message.dongleCode.substring(22,24),//16
                    "0x" + messageType.ALARM_REPLAY.substring(0,2), //eventcode
                    "0x" + messageType.ALARM_REPLAY.substring(2,4),
                    "0x" + message.randomNo.substring(0, 2),
                    "0x" + message.randomNo.substring(2, 4),
                    "0x" + crc.substr(0, 2),
                    "0x" + crc.substr(2, 4),
                    "0x0d",//tail
                    "0x0a" //tail
                ]);

                return [1 , buffer]
            break

            case messageType.SLEEPMODE:
                //nao precisa de reply
                return [0, new Buffer([0x0, 0x0])]
            break

            case messageType.SETTING:
                var pkgHeader = message.packageHead.substring(0,2) +
                message.packageHead.substring(2,4)

                var pkgLen = "2400"

                var unitCode = message.dongleCode

                var randomNo    = message.randomNo

                var param       = message.paramNumbers

                var paramGroup  =  "00"

                var eventCode   = messageType.MAINTENANCE_REPLAY

                var msgSemCRC   = pkgHeader + pkgLen + unitCode + eventCode + randomNo + param + paramGroup
        
                var crc = crcCalc.calcule(msgSemCRC)

                var buffer = new Buffer([
                    "0x" + message.packageHead.substring(0,2),
                    "0x" + message.packageHead.substring(2,4),
                    "0x24",
                    "0x00",//4
                    "0x" + message.dongleCode.substring(0,2),
                    "0x" + message.dongleCode.substring(2,4),
                    "0x" + message.dongleCode.substring(4,6),
                    "0x" + message.dongleCode.substring(6,8),
                    "0x" + message.dongleCode.substring(8,10),
                    "0x" + message.dongleCode.substring(10,12),
                    "0x" + message.dongleCode.substring(12,14),
                    "0x" + message.dongleCode.substring(14,16),
                    "0x" + message.dongleCode.substring(16,18),
                    "0x" + message.dongleCode.substring(18,20),
                    "0x" + message.dongleCode.substring(20,22),
                    "0x" + message.dongleCode.substring(22,24),//16
                    "0x" + messageType.SETTING_REPLY.substring(0,2), //eventcode
                    "0x" + messageType.SETTING_REPLY.substring(2,4),
                    "0x" + message.randomNo.substring(0, 2),
                    "0x" + message.randomNo.substring(2, 4),
                    "0x" + message.paramNumbers,
                    "0x" + 0, // vetor de parametros
                    "0x" + crc.substr(0, 2),
                    "0x" + crc.substr(2, 4),
                    "0x0d",//tail
                    "0x0a" //tail //22
                ]);

                return [1 , buffer]
            break

            case messageType.INQUIRY:
                var pkgHeader = message.packageHead.substring(0,2) +
                message.packageHead.substring(2,4)

                var pkgLen = "1600"

                var unitCode = message.dongleCode

                var eventCode = messageType.INQUIRY_REPLAY

                var msgSemCRC = pkgHeader + pkgLen + unitCode + eventCode
        
                var crc = crcCalc.calcule(msgSemCRC)

                var buffer = new Buffer([
                    "0x" + message.packageHead.substring(0,2),
                    "0x" + message.packageHead.substring(2,4),
                    "0x16",
                    "0x00",//4
                    "0x" + message.dongleCode.substring(0,2),
                    "0x" + message.dongleCode.substring(2,4),
                    "0x" + message.dongleCode.substring(4,6),
                    "0x" + message.dongleCode.substring(6,8),
                    "0x" + message.dongleCode.substring(8,10),
                    "0x" + message.dongleCode.substring(10,12),
                    "0x" + message.dongleCode.substring(12,14),
                    "0x" + message.dongleCode.substring(14,16),
                    "0x" + message.dongleCode.substring(16,18),
                    "0x" + message.dongleCode.substring(18,20),
                    "0x" + message.dongleCode.substring(20,22),
                    "0x" + message.dongleCode.substring(22,24),//16
                    "0x" + messageType.MAINTENANCE_REPLAY.substring(0,2), //eventcode
                    "0x" + messageType.MAINTENANCE_REPLAY.substring(2,4),
                    "0x" + crc.substr(0, 2),
                    "0x" + crc.substr(2, 4),
                    "0x0d",//tail
                    "0x0a" //tail //22
                ]);
                
                return [1 , buffer]

                break
            
            default:
                return [0 , new Buffer([0x00, 0x00])]

            //break
        }
    }
}