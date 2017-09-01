module.exports = function() {
    this.parser = function(text) {
      
      var convert = require('./Util/Convert')

      require('./Util/gpsConvert')();
      
      var messageType = require("./Util/MessageType")
      
      console.log("=========== parser ===========")

      var Message = require('./Model/Message')
      
      var message = new Message()
      
      text = "40405f0033574e2d31363031303035350110170811120e1c03c07da60068b6e30c030000009302010104090404030001010000214142434445466162636465666768696a6b6c0102030405060708090a0b0c0d0e0f170811120e1b68760d0a" //login
      //string para text local
      //text = "4040390033574e2d313630313030353503200400010f00000045170811111b331708111101270092d6ab00b8c3e00c00000000000080e90d0a" //alarm
      //text = "4040160033574e2d3136303130303535031041920d0a" // manutencao - 4192
      //text = "4040310033574e2d3136303130303535042018081101361418081101361403787da60034b7e30c08000000ad024c3c0d0a" //sleep mode
      var result = ''
      
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

      console.log("Evento %s ", eventCode)

      switch(eventCode) {
        
        case messageType.LOGIN://1 Login Packet (1001/9001) 

          console.log("<<login>> %s: ", message.dongleCode)

          var gps            = text.substring(36, 36 + (2 * 21))
          var obdModule          = text.substring(78, 78 + (2 * 4))
          var firmwareVersion    = text.substring(86, 86 + (2 * 4))
          var hardwareVersion    = text.substring(94, 94 + (2 * 4))
          var qtparam            = parseInt(text.substring(102, 104), 16)
          //calcute end param
          var paramEnd           = 104 + (qtparam * 2)
          var param              = text.substring(104, paramEnd)
          //calcute end dongle
          var dongleEnd          = paramEnd + (2 * 6)
          var dongleDateHex      = text.substring(paramEnd, dongleEnd)
          //calcute end crc code
          var crcEnd             = dongleEnd + (5)
          var crcCode            = text.substring(dongleEnd, crcEnd)

          obdModule = convert.hex2dec(obdModule.substring(0, 2)) + '.' +
                      convert.hex2dec(obdModule.substring(2, 4)) + '.' +
                      convert.hex2dec(obdModule.substring(4, 6)) + '.' +
                      convert.hex2dec(obdModule.substring(6, 8))

          firmwareVersion = convert.hex2dec(firmwareVersion.substring(0, 2)) + '.' +
                      convert.hex2dec(firmwareVersion.substring(2, 4)) + '.' +
                      convert.hex2dec(firmwareVersion.substring(4, 6)) + '.' +
                      convert.hex2dec(firmwareVersion.substring(6, 8))
          
          hardwareVersion = convert.hex2dec(hardwareVersion.substring(0, 2)) + '.' +
                      convert.hex2dec(hardwareVersion.substring(2, 4)) + '.' +
                      convert.hex2dec(hardwareVersion.substring(4, 6)) + '.' +
                      convert.hex2dec(hardwareVersion.substring(6, 8))            

          console.log("GPS %s", gps)

          var resultGps = new gpsConvert(gps) //TODO

          message.gpsData          = gpsData
          message.obdModule        = obdModule
          message.firmwareVersion  = firmwareVersion
          message.hardwareVersion  = hardwareVersion
          message.qtparam          = qtparam
          message.param            = param
          message.dongleDateHex    = dongleDateHex
          message.crcCode          = crcCode
          
          return message
        break;

        case messageType.MAINTENANCE://2 Maintenance(1003/9003) 

          console.log("<<Maintenance>> %s: ", message.dongleCode)

          message.data = text.substring(36, 48)
          
          return message

        break;

        case messageType.COMPREHENSIVE_DATA_SUPPLEMENT:
        case messageType.COMPREHENSIVE_DATA: //3 Comprehensive data (0x2001/0x2002)
          console.log("<<Comprehensive data>> %s", message.dongleCode)
          
          var rtcTime                     = text.substring(36, 36 + (2 * 6))
          var dataSitch                   = text.substring(48, 48 + (2 * 3))
          var gpsData                     = text.substring(54, 54 + (2 * 21))
          var odbData                     = text.substring(97, 97 + (55 * 2))
          var currentTripFuelConsumption  = text.substring(207, 207 + (4 * 2))
          var currentTripMileage          = text.substring(215, 215 + (4 * 2))
          var currentTripDuration         = text.substring(223, 223 + (4 * 2))
          var GSEN_Data_Len               = text.substring(231, 231 + (2 * 2))
          var gsen_calc_1               =  parseInt(GSEN_Data_Len.substring(0, 2), 16)
          var gsen_calc_2               =  parseInt(GSEN_Data_Len.substring(2, 4), 16)

          var result_gsen = gsen_calc_2.toString() + gsen_calc_1.toString()
          var resuldEnd                 = 235 + (result_gsen * 2)
          var GSENSOR_Data                = text.substring(235, resuldEnd)

          var customField                 = text.substring(resuldEnd, resuldEnd + (8 * 2))

          message.time                        = rtcTime
          message.dataSitch                   = dataSitch
          message.gpsData                     = gpsData
          message.odbData                     = odbData
          message.currentTripFuelConsumption  = currentTripFuelConsumption
          message.currentTripMileage          = currentTripMileage
          message.currentTripDuration         = currentTripDuration
          message.GSEN_Data_Len               = GSEN_Data_Len
          message.GSENSOR_Data                = GSENSOR_Data
          message.customField                 = customField

          return message

        break;

        case messageType.ALARM: //4 Alarm (2003/A003) 
        
          console.log("<<Alarm>>")

          var randomNo        = text.substring(36, 36 + (2 * 2))
          var alarmTag        = text.substring(40, 40 + (2 * 1))
          var alarmNo         = text.substring(42, 42 + (2 * 1))
          var alarmThreshold  = text.substring(44, 44 + (2 * 2))
          var alarmCurrent    = text.substring(48, 48 + (2 * 2))
          var rtcTime         = text.substring(52, 52 + (2 * 6))
          var gpsData         = text.substring(64, 64 +(2 * 21))

          message.randomNo       = randomNo
          message.alarmTag       = alarmTag
          message.alarmNo        = alarmNo
          message.alarmThreshold = alarmThreshold
          message.alarmCurrent   = alarmCurrent
          message.rtcTime        = rtcTime
          message.gpsData        = gpsData
                
          return message
         
        break;

        case messageType.SLEEPMODE: //5 Sleep Mode Fixed Upload (2004) 

          console.log("<<Sleep Mode Fixed Upload>> %s: ", message.dongleCode)

          var time      = text.substring(36, 36 + (2  *6))
          var timeEnd  = 36 + (2 *6)
          var gpsData  = text.substring(timeEnd, timeEnd + (21* 2))

          message.time = time
          message.gpsData = gpsData

          return message

        break;

        case messageType.SETTING: //6 Setting (3001/B001) 
          console.log("<<Setting>>")
        
          var randomNo          = text.substring(36, 36 + (2 * 2))
          var paramNumbers      = text.substring(40, 36 + (2 * 1))

          message.randomNo      = randomNo
          message.paramNumbers  = paramNumbers

          var pck_1                 = parseInt(paramNumbers.substring(0, 2), 16)
          var pck_2                 = parseInt(paramNumbers.substring(2, 4), 16)
 
          var result                = pck_2.toString() + pck_1.toString()
 
          message.parameterSettingData  = text.substring(42, 42 + (result * 2))

          return message

        break;

        case messageType.INQUIRY: //7 Inquiry (3002/B002) 
          console.log("<<Inquiry>>")
          
          var randomNo          = text.substring(36, 36 + (2 * 2))
          var paramNumbers      = text.substring(40, 36 + (2 * 1))
          
          message.randomNo      = randomNo
          message.paramNumbers  = paramNumbers
          
          var pck_1             = parseInt(paramNumbers.substring(0, 2), 16)
          var pck_2             = parseInt(paramNumbers.substring(2, 4), 16)
 
          var result            = pck_2.toString() + pck_1.toString()
 
          message.inquiryParamList  = text.substring(42, 42 + (result * 2))

          return message

        break;

        case messageType.GETLOG: //8  Get LOG (4001/C001) 
           console.log("<<Get LOG>>")

           var randomNo        = text.substring(36, 36 + (2 * 2))
           var logType         = text.substring(40, 40 + (2 * 1))

           message.randomNo    = randomNo
           message.logType     = logType

           return message
           
        break;

        case messageType.UNIT_SELF_TEST: //9 UNIT Self-test(4002/C002) 
           console.log("<<UNIT Self-test>>")

           var randomNo        = text.substring(36, 36 + (2 * 2))

           message.randomNo    = randomNo
           
           return message

        break;

        case messageType.RESET_DEVICE: //10 Reset Device (4003/C003)
          console.log("<<Reset Device>>")

          var randomNo        = text.substring(36, 36 + (2 * 2))

          message.randomNo    = randomNo
          
          return message

        break;

        case messageType.RESTORE_FACTORY_SETTINGS: //11 Restore Factory Settings (4004/C004)
          console.log("Restore Factory Settings")

          var randomNo        = text.substring(36, 36 + (2 * 2))
          
          message.randomNo    = randomNo
                    
          return message

        break;

        case messageType.CLEAR_COMPREHENSIVE_DATA: //12 Clear Comprehensive Data Storage Area(4005/C005) 
          console.log("<<Clear Comprehensive Data Storage Area>>")

          var randomNo        = text.substring(36, 36 + (2 * 2))
                    
          message.randomNo    = randomNo
          
          return message

        break;

        case messageType.READ_DEVICE_SUPORTED_PID: //13 Read vehicle supported PID number (4007/C007)
          console.log("<<Read vehicle supported PID number>> %", message.dongleCode)

          var randomNo        = text.substring(36, 36 + (2 * 2))
          
          message.randomNo    = randomNo
          
          
          return message

        break;

        case messageType.READ_SPECIFIED_PID_DATA_VALUE: //14 Read Specified PID Data Value (4008/C008) 
          console.log("<<Read Specified PID Data Value>>")

          var randomNo        = text.substring(36, 36 + (2 * 2))
          var pidNumbers      = text.substring(36, 36 + (2 * 1))

          var pck_1           = parseInt(pidNumbers.substring(0, 2), 16)
          var pck_2           = parseInt(pidNumbers.substring(2, 4), 16)

          var result          = pck_2.toString() + pck_1.toString()

          var pidList         = text.substring(38, 38 * (result * 2))
          
          message.randomNo    = randomNo
          message.pidNumbers  = pidNumbers
          message.pidList     = pidList

          return message

        break;

        case messageType.READ_VEHICLE_DTCS: //15 Read Vehicle DTCs(4009/C009)
          console.log("<<Read Specified PID Data Value>>")
        
          var randomNo        = text.substring(36, 36 + (2 * 2))
          var dtcType         = text.substring(36, 36 + (2 * 1))

          message.randomNo    = randomNo
          message.dtcType     = dtcType
          
          return message

        break

        case messageType.CLEAR_DTC: //16 Clear DTC (400A/C00A) 
          console.log("<<Clear DTC>>")
        
          var randomNo     = text.substring(36, 36 + (2 * 2))

          message.randomNo = randomNo

          return message

        break

        case messageType.READ_VIN: //17 Read VIN (400B/C00B)
          console.log("<<Read VIN>>")
        
          var randomNo     = text.substring(36, 36 + (2 * 2))

          message.randomNo = randomNo
          
          return message

        break

        case messageType.READ_FREEZE_FRAME: //18 Reading Freeze Frame (400C/C00C) 
          console.log("<<Reading Freeze Frame>>")

          var randomNo     = text.substring(36, 36 + (2 * 2))

          message.randomNo = randomNo
                    
          return message

        break

        case messageType.SEND_UPGRADING: //19 Send Upgrading/Reply (5001/D001) 
          console.log("<<Send Upgrading/Reply>>")

          var mUpgrade              = text.substring(36, 36 + (1 * 2))
          var upgradeID             = text.substring(38, 38 + (4 * 2))
          var firmwareVersion       = text.substring(46, 46 + (4 * 2))
          var totalpkgNumber        = text.substring(54, 54 + (2 * 2))
          var crcNumber             = text.substring(58, 58 + (2 * 2))
         
          var pck_1                 = parseInt(crcNumber.substring(0, 2), 16)
          var pck_2                 = parseInt(crcNumber.substring(2, 4), 16)

          var result                = pck_2.toString() + pck_1.toString()

          var crcArray              = text.substring(62, 62 + (result * 2))

          return message

        break

        case messageType.ISSUE_UPGRADE_PACKAGE: //20 Issue Upgrade Package /Reply (5002/D002) 
          console.log("<<Issue Upgrade Package /Reply>>")

          var upgradeID             = text.substring(36, 36 + (2 * 4))
          var packetSign            = text.substring(44, 44 + (2 * 1))
          var packetNumber          = text.substring(46, 46 + (2 * 2))
          var packetLength          = text.substring(50, 50 + (2 * 2))

          var pck_1               =  parseInt(packetLength.substring(0, 2), 16)
          var pck_2               =  parseInt(packetLength.substring(2, 4), 16)

          var result_packetLength = pck_2.toString() + pck_1.toString()

          var packetContents        = text.substring(54, 54 + (2 * result_packetLength))

          message.upgradeID = upgradeID
          message.packetSign = packetSign
          message.packetNumber = packetNumber
          message.packetLength = packetLength
          message.packetContents = packetContents

          return message

        break

        default:
            console.log("Desculpe, estamos sem nenhum evento (" + eventCode + ").");
        }
      return 0
    }
}
