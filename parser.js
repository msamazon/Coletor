module.exports = function() {
    this.parser = function(text) {

      console.log("=========== parser ===========")

      var Message = require('./Model/Message')
      
      var message = new Message()
      
      text = "40405f0033574e2d31363031303035350110170811120e1c03c07da60068b6e30c030000009302010104090404030001010000214142434445466162636465666768696a6b6c0102030405060708090a0b0c0d0e0f170811120e1b68760d0a" //login
      //string para text local
      //text = "4040390033574e2d313630313030353503200400010f00000045170811111b331708111101270092d6ab00b8c3e00c00000000000080e90d0a" //alarm
      //text = "4040160033574e2d3136303130303535031041920d0a" // manutencao - 4192
      //text = "4040310033574e2d3136303130303535042018081101361418081101361403787da60034b7e30c08000000ad024c3c0d0a" //sleep mode
      var result = '';
      
      var dateReceived = new Date()      
      var head         = text.substring(0, 4)
      var headLen      = text.substring(4, 8)
      var dongleCode   = text.substring(8, 32)
      var eventCode    = text.substring(32, 36)

      message.fullMessage   = text
      message.packageHead   = head
      message.packageLength = headLen
      message.dongleCode    = dongleCode
      message.eventcode     = eventCode
      message.dateReceived  = new Date()

      console.log("message.packageHead %s" , message.packageHead)
      console.log("message.headLen %s" , message.packageLength)
      console.log("message.dongleCode %s" , message.dongleCode)
      console.log("message.eventCode %s" , message.eventcode)
      console.log("message.dateReceived %s" , message.dateReceived)
      console.log("Evento %s ", eventCode)

      switch(eventCode) {
        
        case "0190":
        case "0110": //Login Packet (1001/9001) 

          console.log("<<login>>")

          var gpsData              = text.substring(36, 79)
          const obdModule          = text.substring(79, 87)
          const firmwareVersion    = text.substring(87, 95)
          const hardwareVersion    = text.substring(95, 103)
          const qtparam            = parseInt(text.substring(103, 105), 16)
          //calcute end param
          const paramEnd           = 105 + (qtparam * 2)
          const param              = text.substring(105, paramEnd)
          //calcute end dongle
          const dongleEnd          = paramEnd + (2*6)
          const dongleDateHex      = text.substring(paramEnd, dongleEnd)
          //calcute end crc code
          const crcEnd             = dongleEnd + (5)
          const crcCode            = text.substring(dongleEnd, crcEnd)

          message.gpsData = gpsData
          message.obdModule = obdModule
          message.firmwareVersion = firmwareVersion
          message.hardwareVersion = hardwareVersion
          message.qtparam = qtparam
          message.param = param
          message.dongleDateHex = dongleDateHex
          message.crcCode = crcCode
          console.log("message.gpsData %s ", gpsData)
          console.log("message.obdModule %s ", obdModule)
          console.log("message.firmwareVersion %s ", firmwareVersion)
          console.log("message.hardwareVersion %s ", hardwareVersion)
          console.log("message.qtparam %s ", qtparam)
          console.log("message.param %s ", param)
          console.log("message.dongleDateHex %s ", dongleDateHex)
          console.log("message.crcCode %s ", crcCode)

          return message
        break;

        case "0390":
        case "0310"://Maintenance(1003/9003) 

          console.log("<<Maintenance>>")

          const data = text.substring(36, 48)

          message.data = data

          console.log("message.data %s", message.data)
          
          return message

        break;

        case "0420": // Sleep Mode Fixed Upload (2004) 

          console.log("<<Sleep Mode Fixed Upload>>")

          var time      = text.substring(36, 36 + (2 *6))
          const timeEnd   = 36 + (2 *6)
          var gpsData  = text.substring(timeEnd, timeEnd + (21* 2))

          message.time = time
          message.gpsData = gpsData

          console.log("message.time %s", message.time)
          console.log("message.gpsData %s", message.gpsData)

          return message

        break;
        
        case "0220":
        case "0120": //Comprehensive data (0x2001/0x2002)
            console.log("<<Comprehensive data>>")
            var time                        = text.substring(36, 36 + (2 * 6))
            var dataSitch                   = text.substring(48, 48 + (2 * 3))
            var gpsData                     = text.substring(54, 54 + (2 * 21))
            var odbData                     = text.substring(97, 97 + (55 * 2))
            var currentTripFuelConsumption  = text.substring(207, 207 + (4 * 2))
            var currentTripMileage          = text.substring(215, 215 + (4 * 2))
            var currentTripDuration         = text.substring(223, 223 + (4 * 2))
            var GSEN_Data_Len               = text.substring(231, 231 + (2 * 2))
            const gsen_calc_1               =  parseInt(GSEN_Data_Len.substring(0, 2), 16)
            const gsen_calc_2               =  parseInt(GSEN_Data_Len.substring(2, 4), 16)

            const result_gsen = gsen_calc_2.toString() + gsen_calc_1.toString()
            const resuldEnd                 = 235 + (result_gsen * 2)
            var GSENSOR_Data                = text.substring(235, resuldEnd)

            var customField                 = text.substring(resuldEnd, resuldEnd + (8 * 2))

            message.time = time
            message.dataSitch = dataSitch
            message.gpsData = gpsData
            message.odbData = odbData
            message.currentTripFuelConsumption = currentTripFuelConsumption
            message.currentTripMileage = currentTripMileage
            message.currentTripDuration = currentTripDuration
            message.GSEN_Data_Len = GSEN_Data_Len
            message.GSENSOR_Data = GSENSOR_Data
            message.customField = customField

            console.log(time)
            console.log(dataSitch)
            console.log(gpsData)
            console.log(odbData)
            console.log(currentTripFuelConsumption)
            console.log(currentTripMileage)
            console.log(currentTripDuration)
            console.log(GSEN_Data_Len)
            console.log(GSENSOR_Data)
            console.log(customField)

            return message

        break;
        
        case "03a3":
        case "0320": // Alarm (2003/A003) 
          console.log("<<Alarm>>")

          var randomNo        = text.substring(36, 36 + (2 * 2))
          var alarmTag        = text.substring(40, 40 + (2 * 1))
          var alarmNo         = text.substring(42, 42 + (2 * 1))
          var alarmThreshold  = text.substring(44, 44 + (2 * 2))
          var alarmCurrent    = text.substring(48, 48 + (2 * 2))
          var rtcTime         = text.substring(52, 52 + (2 * 6))
          var gpsData         = text.substring(64, 64 +(2 * 21))


          message.randomNo = randomNo
          message.alarmTag = alarmTag
          message.alarmNo = alarmNo
          message.alarmThreshold = alarmThreshold
          message.alarmCurrent = alarmCurrent
          message.rtcTime = rtcTime
          message.gpsData = gpsData

          console.log("message.randomNo %s", message.randomNo)
          console.log("message.alarmTag %s",message.alarmTag)
          console.log("message.alarmNo %s",message.alarmNo)
          console.log("message.alarmThreshold %s",message.alarmThreshold)
          console.log("message.alarmCurrent %s",message.alarmCurrent)
          console.log("message.rtcTime %s",message.rtcTime)
          console.log("message.gpsData %s",message.gpsData)
          
          var _json = "{ full: " + message.full + ", dateReceived: " + message.dateReceived +
          ", packageHead: " + message.packageHead + ", packageLength: " + message.packageLength +
          ", dongleCode: " + message.dongleCode + ", eventcode: " + message.eventcode +
          ", randomNo: " + message.randomNo + ", alarmTag: "  + message.alarmTag +
          ", alarmThreshold: " + message.alarmThreshold + ", alarmCurrent: " + alarmCurrent +
          ", rtcTime: " + message.rtcTime + ", gpsData: " + message.gpsData +  "}"
          //tem o resto nao mapeado
          
          return message
           
        break;

        case "01b0":
        case "0130": //Setting (3001/B001) 
          console.log("<<Setting>>")
        
          var randomNo        = text.substring(36, 36 + (2 * 2))
          var paramNumbers    = text.substring(40, 36 + (2 * 1))

          message.randomNo = randomNo
          message.paramNumbers = paramNumbers

          console.log("message.randomNo %s", message.randomNo)
          console.log("message.paramNumbers %s", message.paramNumbers)

          return message

        break;

        case "02b0":
        case "0230": //Inquiry (3002/B002) 
          console.log("<<Inquiry>>")
          
          message.randomNo = randomNo
          message.paramNumbers = paramNumbers

          console.log("message.randomNo %s", message.randomNo)
          console.log("message.paramNumbers %s", message.paramNumbers)

          return message

        break;

        case "01c0":
        case "0140": // Get LOG (4001/C001) 
           console.log("<<Get LOG>>")

           var randomNo        = text.substring(36, 36 + (2 * 2))
           var logType         = text.substring(40, 40 + (2 * 1))

           message.randomNo    = randomNo
           message.logType     = logType

           console.log("message.randomNo %s", message.randomNo)
           console.log("message.logType %s", message.logType)

           return message
           
        break;

        case "02c0":
        case "0240": // UNIT Self-test(4002/C002) 
           console.log("<<UNIT Self-test>>")

           var randomNo        = text.substring(36, 36 + (2 * 2))

           message.randomNo    = randomNo
           
           console.log("message.randomNo %s", message.randomNo)

           return message

        break;

        case "03c0":
        case "0340": //Reset Device (4003/C003)
          console.log("<<Reset Device>>")

          var randomNo        = text.substring(36, 36 + (2 * 2))

          message.randomNo    = randomNo
          
          console.log("message.randomNo %s", message.randomNo)

          return message

        break;

        case "0440":
        case "04c0": //Restore Factory Settings (4004/C004)
          console.log("Restore Factory Settings")

          var randomNo        = text.substring(36, 36 + (2 * 2))
          
          message.randomNo = randomNo
          
          console.log("message.randomNo %s", message.randomNo)
          
          return message

        break;

        case "0540":
        case "05c0": //Clear Comprehensive Data Storage Area(4005/C005) 
          console.log("<<Clear Comprehensive Data Storage Area>>")

          var randomNo        = text.substring(36, 36 + (2 * 2))
          
          console.log(randomNo)
          
          message.randomNo = randomNo
          
          console.log("message.randomNo %s", message.randomNo)

          return message

        break;

        case "0740":
        case "07c0": //Read vehicle supported PID number (4007/C007)
          console.log("<<Read vehicle supported PID number>>")

          var randomNo        = text.substring(36, 36 + (2 * 2))
          
          message.randomNo = randomNo
          
          console.log("message.randomNo %s", message.randomNo)
          
          return message

        break;

        case "0840":
        case "08c0": //Read Specified PID Data Value (4008/C008) 
          console.log("<<Read Specified PID Data Value>>")

          var randomNo        = text.substring(36, 36 + (2 * 2))
          var pidNumbers      = text.substring(36, 36 + (2 * 1))
          
          message.randomNo    = randomNo
          
          console.log("message.randomNo %s", message.randomNo)

          console.log(pidNumbers)
          //TODO pid list

          return message

        break;


        case "09c0":
        case "0940": //Read Vehicle DTCs(4009/C009)
          console.log("Read Specified PID Data Value")
        
          var randomNo        = text.substring(36, 36 + (2 * 2))
          var dtcType         = text.substring(36, 36 + (2 * 1))

          message.randomNo    = randomNo
          message.dtcType     = dtcType
          
          console.log("message.randomNo %s", message.randomNo)
          console.log("message.dtcType %s", message.dtcType)
          
          return message

        break

        case "0a40":
        case "0ac0": //Clear DTC (400A/C00A) 
          console.log("Clear DTC")
        
          var randomNo     = text.substring(36, 36 + (2 * 2))

          message.randomNo = randomNo
          
          console.log("message.randomNo %s", message.randomNo)

          return message

        break

        case "0b40":
        case "0bc0": //Read VIN (400B/C00B)
          console.log("Read VIN")
        
          var randomNo     = text.substring(36, 36 + (2 * 2))

          message.randomNo = randomNo
          
          console.log("message.randomNo %s", message.randomNo)

          return message

        break

        case "0c40":
        case "0cc0": //Reading Freeze Frame (400C/C00C) 
          console.log("Reading Freeze Frame ")

          var randomNo     = text.substring(36, 36 + (2 * 2))

          message.randomNo = randomNo
          
          console.log("message.randomNo %s", message.randomNo)
          
          return message

        break

        case "0150":
        case "01d0": //Send Upgrading/Reply (5001/D001) 
          console.log("Send Upgrading/Reply")

          return message

        break

        case "0250":
        case "02d0": //Issue Upgrade Package /Reply (5002/D002)         
          console.log("Issue Upgrade Package /Reply")

          var upgradeID             = text.substring(36, 36 + (2 * 4))
          var packetSign            = text.substring(44, 44 + (2 * 1))
          var packetNumber          = text.substring(46, 46 + (2 * 2))
          var packetLength          = text.substring(50, 50 + (2 * 2))

          const pck_1               =  parseInt(packetLength.substring(0, 2), 16)
          const pck_2               =  parseInt(packetLength.substring(2, 4), 16)

          const result_packetLength = pck_2.toString() + pck_1.toString()

          var packetContents        = text.substring(54, 54 + (2 * result_packetLength))


          message.upgradeID = upgradeID
          message.packetSign = packetSign
          message.packetNumber = packetNumber
          message.packetLength = packetLength
          message.packetContents = packetContents

          console.log("message.upgradeID %s", message.upgradeID)
          console.log("message.packetSign %s", message.packetSign)
          console.log("message.packetNumber %s", message.packetNumber)
          console.log("message.packetLength %s", message.packetLength)
          console.log("message.packetContents %s", message.packetContents)
          
          return message

        break

        default:
            console.log("Desculpe, estamos sem nenhum evento (" + eventCode + ").");
        }
      return 0
    }
}
