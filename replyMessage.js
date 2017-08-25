
module.exports = function() {

    this.replyMessage = function(message) {
        var messageType = require("./Util/MessageType");

        var crcCalc = require("./Util/crcCalc");
        
        console.log("----------- reply -----------")

        console.log("reply.message: %s", message)
        console.log("reply.eventcode: %s", message.eventcode)

        switch(message.eventcode) {
            case messageType.LOGIN: 
                var pkgHeader = message.packageHead.substring(0,2) +
                    message.packageHead.substring(2,4)
                
                var pkgLen = "2200"

                var unitCode = message.dongleCode.substring(0,2) +
                        message.dongleCode.substring(2,4) +
                        message.dongleCode.substring(4,6) +
                        message.dongleCode.substring(6,8) +
                        message.dongleCode.substring(8,10) +
                        message.dongleCode.substring(10,12) +
                        message.dongleCode.substring(12,14) +
                        message.dongleCode.substring(14,16) +
                        message.dongleCode.substring(16,18) +
                        message.dongleCode.substring(18,20) +
                        message.dongleCode.substring(20,22) +
                        message.dongleCode.substring(22,24)
                
                var eventCode               = "9001"

                var reconnectedIp           = "ffffffff"

                var reconnectedPort         = "0000"

                var _date = new Date().toISOString().
                    replace(/T/, ' ').      // replace T with a space
                    replace(/\..+/, '')     // delete the dot and everything after
                    //> '2012-11-04 14:55:45'

                console.log("reply.date: %s", _date)

                const day       = _date.substring(8,10)// + " "
                const month     = _date.substring(5,7)// + " "
                const year      = _date.substring(0,2) /* + " " */+ _date.substring(2,4)// + " "
                const hour      = _date.substring(11,13)// + " "
                const min       = _date.substring(14,16)// + " "
                const sec       = _date.substring(17,19)// + " "
              
                var utcTime     = day + month + year + hour + min + sec

                console.log("reply.packetHeader: %s", pkgHeader)

                console.log("reply.packetLen: %s", pkgLen)

                console.log("reply.unitCode: %s", unitCode)

                console.log("reply.utcTime: %s", utcTime)

                var msgSemCRC = pkgHeader + pkgLen + unitCode + eventCode +  
                    reconnectedIp + reconnectedPort + utcTime
                
                console.log("reply.messageSemCRC %s",  msgSemCRC)
                
                var crc         = crcCalc.calcule(msgSemCRC)

                var tail        = "0d0a"

                var msgCRCTail  =  msgSemCRC + crc + tail

                var buffer = new Buffer([
                    "0x" + message.packageHead.substring(0,2), "0x" + message.packageHead.substring(2,4),
                    "0x22", "0x00",
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
                    "0x" + message.dongleCode.substring(22,24),
                    "0x90",
                    "0x01",
                    "0xFF",
                    "0xFF",
                    "0xFF",
                    "0xFF",
                    "0x00",
                    "0x00",
                    "0x" + day,
                    "0x" + month,
                    "0x" + year,
                    "0x" + hour,
                    "0x" + min,
                    "0x" + sec,
                    "0x" + crc.substr(0, 2),
                    "0x" + crc.substr(2, 4),
                    "0x0d",
                    "0x0a"
                ]);
                return buffer

            break

            case messageType.MAINTENANCE:
            
            var pkgHeader = message.packageHead.substring(0,2) +
                message.packageHead.substring(2,4)
        
            var pkgLen = "2200"

            var unitCode = message.dongleCode.substring(0,2) +
                message.dongleCode.substring(2,4) +
                message.dongleCode.substring(4,6) +
                message.dongleCode.substring(6,8) +
                message.dongleCode.substring(8,10) +
                message.dongleCode.substring(10,12) +
                message.dongleCode.substring(12,14) +
                message.dongleCode.substring(14,16) +
                message.dongleCode.substring(16,18) +
                message.dongleCode.substring(18,20) +
                message.dongleCode.substring(20,22) +
                message.dongleCode.substring(22,24)
        
            var eventCode               = "9001"

            var reconnectedIp           = "ffffffff"

            var reconnectedPort         = "0000"

            var _date = new Date().toISOString().
                replace(/T/, ' ').      // replace T with a space
                replace(/\..+/, '')     // delete the dot and everything after
                //> '2012-11-04 14:55:45'

            console.log("reply.date: %s", _date)

            const day       = _date.substring(8,10)// + " "
            const month     = _date.substring(5,7)// + " "
            const year      = _date.substring(0,2) /* + " " */+ _date.substring(2,4)// + " "
            const hour      = _date.substring(11,13)// + " "
            const min       = _date.substring(14,16)// + " "
            const sec       = _date.substring(17,19)// + " "
      
            var utcTime     = day + month + year + hour + min + sec

            console.log("reply.packetHeader: %s", pkgHeader)

            console.log("reply.packetLen: %s", pkgLen)

            console.log("reply.unitCode: %s", unitCode)

            console.log("reply.utcTime: %s", utcTime)

            var msgSemCRC = pkgHeader + pkgLen + unitCode + eventCode +  
                reconnectedIp + reconnectedPort + utcTime
        
            console.log("reply.messageSemCRC %s",  msgSemCRC)
        
            var crc         = crcCalc.calcule(msgSemCRC)

            var tail        = "0d0a"

            var msgCRCTail  =  msgSemCRC + crc + tail

            var buffer = new Buffer([
                "0x" + message.packageHead.substring(0,2), "0x" + message.packageHead.substring(2,4),
                "0x22", "0x00",
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
                "0x" + message.dongleCode.substring(22,24),
                "0x90", //eventcode
                "0x03",
                "0x" + crc.substr(0, 2),
                "0x" + crc.substr(2, 4),
                "0x0d",//tail
                "0x0a" //tail
            ]);
            return buffer
            break;

            case messageType.SLEEPMODE:
            break
        }
    }
}