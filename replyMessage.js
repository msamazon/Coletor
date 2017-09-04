module.exports = function() {

    this.replyMessage = function(message) {
        var messageType = require("./Util/MessageType")
 var convert = require('./Util/Convert')
        var crcCalc = require("./Util/crcCalc")
        var UtcTime = require("./Util/utcTime")

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

            case messageType.LOGIN: // 1
            
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

            case messageType.MAINTENANCE: //2
            
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
            case messageType.COMPREHENSIVE_DATA: // 3
                return [0 , new Buffer([0x00, 0x00])]
            break

            case messageType.ALARM: //4

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

            case messageType.SLEEPMODE: //5
                //nao precisa de reply
                return [0, new Buffer([0x0, 0x0])]
            break

            case messageType.SETTING: //6
                var pkgHeader = message.packageHead.substring(0,2) +
                message.packageHead.substring(2,4)

                var pkgLen = "1a00"

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
                    "0x1a",
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
                    "0x" + message.paramNumebers,
                    //TODO
                    "0x" + 0, // vetor de parametros
                    "0x" + crc.substr(0, 2),
                    "0x" + crc.substr(2, 4),
                    "0x0d",//tail
                    "0x0a" //tail //26
                ]);

                return [1 , buffer]
            break

            case messageType.INQUIRY: //7
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
                    "0x" + messageType.INQUIRY_REPLAY.substring(0,2), //eventcode
                    "0x" + messageType.INQUIRY_REPLAY.substring(2,4),
                    // array iinquiry
                    //TODO
                    "0x" + crc.substr(0, 2),
                    "0x" + crc.substr(2, 4),
                    "0x0d",//tail
                    "0x0a" //tail //22
                ]);
                
                return [1 , buffer]

            break
            
            case messageType.UNIT_SELF_TEST: //9

            break

            case messageType.RESET_DEVICE: //10

            break

            case messageType.RESTORE_FACTORY_SETTINGS: //11

            break

            case messageType.CLEAR_COMPREHENSIVE_DATA: //12

            break

            case messageType.READ_DEVICE_SUPORTED_PID: // 13

            break

            case messageType.READ_SPECIFIED_PID_DATA_VALUE: //14

            break

            case messageType.READ_VEHICLE_DTCS: //15
                var pkgHeader = message.packageHead.substring(0,2) +
                    message.packageHead.substring(2,4)

                var pkgLen = "1600"

                var unitCode = message.dongleCode

                var eventCode = messageType.READ_VEHICLE_DTCS_REPLY

                var dtcType   = "1"

                var utc       = UtcTime.descalcule

                var msgSemCRC = pkgHeader + pkgLen + unitCode + eventCode + message.randomNo + dtcType
    
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
                    "0x" + messageType.READ_VEHICLE_DTCS_REPLY.substring(0,2), //eventcode
                    "0x" + messageType.READ_VEHICLE_DTCS_REPLY.substring(2,4),
                    "0x" + message.randomNo.substring(0, 2),
                    "0x" + message.randomNo.substring(2, 4), //20
                    "0x01",
                    //DTC numbers
                    //DTC Status Array x len
                    utc[0],
                    utc[1],
                    utc[2],
                    utc[3],
                    utc[4],
                    utc[5],
                    "0x" + crc.substr(0, 2),
                    "0x" + crc.substr(2, 4),
                    "0x0d",//tail
                    "0x0a" //tail //22
                ]);
            
                return [1 , buffer]
            break

            case messageType.CLEAR_DTC: //16
                var pkgHeader = message.packageHead.substring(0,2) +
                    message.packageHead.substring(2,4)

                var pkgLen    = "2c00"

                var unitCode  = message.dongleCode

                var eventCode = messageType.CLEAR_DTC_REPLY

                var randomNo  = "" //TODO

                var resultMark   = "0x01" // TODO 0x01 pr 0x00

                var utc       = UtcTime.descalcule()

                var msgSemCRC = pkgHeader + pkgLen + unitCode + eventCode
                    + randomNo + resultMark + utc

                var crc = crcCalc.calcule(msgSemCRC)

                var buffer = new Buffer([
                    "0x" + message.packageHead.substring(0,2),
                    "0x" + message.packageHead.substring(2,4),
                    "0x2c",
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
                    "0x" + messageType.CLEAR_DTC_REPLY.substring(0,2), //eventcode
                    "0x" + messageType.CLEAR_DTC_REPLY.substring(2,4), //18
                    "0x" + message.randomNo,
                    "0x01", //Result‐mark
                    "0x" + utc[0],//day
                    "0x" + utc[1],//mounth
                    "0x" + utc[2],//year
                    "0x" + utc[3],//hour
                    "0x" + utc[4],//minute
                    "0x" + utc[5],//second
                    "0x" + crc.substr(0, 2),
                    "0x" + crc.substr(2, 4),
                    "0x0d",//tail
                    "0x0a" //tail
                ]);
    
                return [1 , buffer]

            break

            case messageType.READ_VIN: //17

                var pkgHeader = message.packageHead.substring(0,2) +
                    message.packageHead.substring(2,4)

                var pkgLen    = "1800"

                var unitCode  = message.dongleCode

                var eventCode = messageType.READ_VIN_REPLY

                var randomNo  = message.randomNo

                var msgSemCRC = pkgHeader + pkgLen + unitCode + eventCode
                    + randomNo
    
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
                    "0x" + messageType.READ_VIN.substring(0,2), //eventcode
                    "0x" + messageType.READ_VIN.substring(2,4), //18
                    "0x" + randomNo.substring(0, 2),
                    "0x" + randomNo.substring(2, 4),
                    "0x" + crc.substr(0, 2),
                    "0x" + crc.substr(2, 4),
                    "0x0d",//tail
                    "0x0a" //tail
                 ]);
            
            return [1 , buffer]

            break

            case messageType.READ_FREEZE_FRAME_REPLY: //18

            break

            case messageType.SEND_UPGRADING: //19

            break

            default:
                return [0 , new Buffer([0x00, 0x00])]

            //break
        }
    }
}