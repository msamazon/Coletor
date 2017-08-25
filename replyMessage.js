
module.exports = function() {

    this.replyMessage = function(message) {
        
        var crcCalc = require("./Util/crcCalc");
        
        console.log("----------- reply -----------")

        console.log("reply.message: %s", message)
        console.log("reply.eventcode: %s", message.eventcode)

        switch(message.eventcode) {
            case "0110": 
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
              
                var utcTime     = day + month + year +  hour + min + sec

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

                return msgCRCTail

            break
        }
    }
}