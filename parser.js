module.exports = function() {
    this.parser = function(text) {
      
      var convert = require('./Util/Convert')
      var utcTime = require('./Util/utcTime')
      var modulo4 = require('./Util/modulo4')
      var cron    = require('cron')
      var requstDongle = require('./requestDongle')
      
      require('./Util/gpsConvert')();
      
      var messageType = require("./Util/MessageType")
      
      console.log("=========== parser ===========")

      var Message = require('./Model/Message')
      
      var message = new Message()
      
      //text = "40405f0033574e2d31363031303035350110170811120e1c03c07da60068b6e30c030000009302010104090404030001010000214142434445466162636465666768696a6b6c0102030405060708090a0b0c0d0e0f170811120e1b68760d0a" //login
      //string para text local
      //text = "4040390033574e2d313630313030353503200400010f00000045170811111b331708111101270092d6ab00b8c3e00c00000000000080e90d0a" //alarm
      //text = "4040160033574e2d3136303130303535031041920d0a" // manutencao - 4192
      //text = "4040310033574e2d3136303130303535042018081101361418081101361403787da60034b7e30c08000000ad024c3c0d0a" //sleep mode
      //text = "4040630033574e2d31363031303035350220010911030a2a808000010911030a2a0330a1ac00ce0cdf0c010000006e02060520017b0b2001330c2002840c0d2001000f2001611020020b010d000000000000005e8908008000ffff01010000ee4d0d0a4040630033574e2d31363031303035350220010911030a2b808000010911030a2b0330a1ac00ce0cdf0c010000006f02060520017b0b2001340c2002880c0d2001000f20016110200207010d00000000000000838d08007f00ffff0101000058e20d0a4040630033574e2d31363031303035350220010911030a2c808000010911030a2c0330a1ac00ce0cdf0c010000006f02060520017b0b2001330c2002880c0d2001000f20016110200207010d00000000000000a69108007f00ffff0101000082ed0d0a4040630033574e2d31363031303035350220010911030a2d808000010911030a2d0330a1ac00ce0cdf0c010000007002060520017b0b2001330c2002670c0d2001000f20016110200204010d00000000000000cc9508008000ffff010100009c7a0d0a4040630033574e2d31363031303035350220010911030a2e808000010911030a2e032aa1ac00ce0cdf0c050000007002060520017b0b2001320c20026f0c0d2001000f20016110200206010d00000000000000b79908008000ffff0101000074870d0a4040630033574e2d31363031303035350220010911030a2f808000010911030a2f032aa1ac00ce0cdf0c020000006e02060520017b0b2001320c20028a0c0d2001000f20016110200206010d00000000000000d69d08007f00ffff0101000042b40d0a"
      //text = "40402f0033574e2d31363031303035360bc098003346414450304c3334425231383637323105091100262823e50d0a"

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

      console.log("dongleCode: %s",dongleCode)

      console.log("Evento %s ", eventCode)

      switch(eventCode) {
        
        case messageType.LOGIN://1 Login Packet (1001/9001) 

          console.log("<<login>> %s: ", message.dongleCode)

          var gps                = text.substring(36, 36 + (2 * 21))
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

          obdModule              = modulo4.calcule(obdModule)
          firmwareVersion        = modulo4.calcule(firmwareVersion)
          hardwareVersion        = modulo4.calcule(hardwareVersion)

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
          
          var rtcTime                    = utcTime.calcule(text.substring(36, 36 + (2 * 6)))

          var dataSitch                  = text.substring(48, 48 + (2 * 3))

          var gpsData                    = text.substring(54, 54 + (2 * 21))

          var PidNo                      = convert.hex2dec(text.substring(96, 96 + (2 * 1))) //pid = 8 *2

          console.log('PidNo: %s', PidNo)

          var pidIni = 98

          for(var i = 0; i < PidNo; i++) {

            var _pidNO = text.substring(pidIni, pidIni + (2 *2))
            var _pidLen = text.substring(pidIni + 4, (pidIni + 4) + (2 *1))
            var _pidValue = text.substring(pidIni + 6, (pidIni + 6) + (2 * convert.hex2dec(_pidLen)))
            console.log("pidNO: %s", _pidNO)
            console.log("pidLen: %s", _pidLen)
            console.log("pidValue: %s", _pidValue)

            pidIni = pidIni + 6 +  (2 * convert.hex2dec(_pidLen))

            if (i == 0) {
              message.pid1.noId = _pidNO
              message.pid1.len = _pidLen
              message.pid1.dec = _pidValue
            }
            if (i == 1) {
              message.pid2.noId = _pidNO
              message.pid2.len = _pidLen
              message.pid2.dec = _pidValue
            }
            if (i == 2) {
              message.pid3.noId = _pidNO
              message.pid3.len = _pidLen
              message.pid3.dec = _pidValue
            }
            if (i == 3) {
              message.pid4.noId = _pidNO
              message.pid4.len = _pidLen
              message.pid4.dec = _pidValue
            }
            if (i == 4) {
              message.pid5.noId = _pidNO
              message.pid5.len = _pidLen
              message.pid5.dec = _pidValue
            }
            if (i == 5) {
              message.pid6.noId = _pidNO
              message.pid6.len = _pidLen
              message.pid6.dec = _pidValue
            }
            if (i == 6) {
              message.pid7.noId = _pidNO
              message.pid7.len = _pidLen
              message.pid7.dec = _pidValue
            }
            if (i == 7) {
              message.pid8.noId = _pidNO
              message.pid8.len = _pidLen
              message.pid8.dec = _pidValue
            }
            if (i == 8) {
              message.pid9.noId = _pidNO
              message.pid9.len = _pidLen
              message.pid9.dec = _pidValue
            }
            if (i == 9) {
              message.pid10.noId = _pidNO
              message.pid10.len = _pidLen
              message.pid10.dec = _pidValue
            }
          }
          //var pidIni

          //fuel

          var fuel = text.substring(pidIni, pidIni + (2 * 4))

          console.log("current trip fuel: %s", fuel)

          var fuel0 = pidIni + (2 * 4)

          var cTripFuelCons  = text.substring(fuel0, fuel0 + (4 * 2))

          console.log("cTripFuelCons: %s", cTripFuelCons)

          cTripFuelCons = modulo4.inverter(cTripFuelCons) 
          cTripFuelCons = convert.hex2dec(cTripFuelCons) * 0.01

          //console.log("cTripFuelCons: %s meter", cTripFuelCons)

          var trip =  fuel0 + (4 * 2)

          var cTripFuelMileage = text.substring(trip, trip + (4 * 2))

          console.log("cTripFuelMileage: %s", cTripFuelMileage)

          cTripFuelMileage = modulo4.inverter(cTripFuelMileage)
          cTripFuelMileage = convert.hex2dec(cTripFuelMileage)

         // console.log("cTripFuelMileage: %s ms", cTripFuelMileage)

          var senson0 = trip + (4 * 2)
          var gSensor = text.substring(senson0, senson0 + (2 * 2))

          console.log("gSensor %s", gSensor)

          gSensor = modulo4.inverter(gSensor)
          gSensor = convert.hex2dec(gSensor)

          console.log("gSensor %s", gSensor)

          var sensorData0 = senson0 + (2 * 2)
          var gSensorData = text.substring(sensorData0, sensorData0 + (2 * gSensor))

          console.log("gSensorData: %s", gSensorData)

          var group1 = gSensorData.substring(0, 6 * 2)

          console.log("group1: ", group1)

          var group2 = gSensorData.substring(12, 12 +(6 * 2))
          
          console.log("group2: ", group2)

          var group3 = gSensorData.substring(24, 24 + (6 *2))
                    
          console.log("group3: ", group3)

          var group4 = gSensorData.substring(36, 36 + (6 *2))
          console.log("group4: ", group4)

          var group5 = gSensorData.substring(48, 48 + (6 *2))
          console.log("group5: ", group5)

          var field0 = sensorData0 + (2 * gSensor)
          var customField   = text.substring(field0, field0 + (2 * 8))

          console.log("customField: %s", customField)

          var voltage = customField.substring(0, 4)
          console.log("voltage: %s V", voltage)
          voltage = convert.hex2dec(voltage.substring(2, 4) + voltage.substring(0, 2)) * 0.1
          console.log("voltage: %s V", voltage)

          var vehicle = customField.substring(4, 8)
          console.log("vehicle %s", vehicle)

          var accOn = customField.substring(8, 10)
          console.log("accOn %s", accOn)

          var mmxc = customField.substring(10, 12)
          console.log("mmxc %s", mmxc)

          var reserved = customField.substring(12, 16)
          console.log("reserved %s", reserved)

          rtcTime             = utcTime.calcule(rtcTime)
          var resultGps       = new gpsConvert(gpsData) //TODO

      
          message.time                        = rtcTime
          message.dataSitch                   = dataSitch
          message.gpsData                     = gpsData
          message.currentTripFuelConsumption  = cTripFuelCons
          message.currentTripMileage          = cTripFuelMileage
          message.currentTripDuration         = cTripFuelMileage
          message.GSEN_Data_Len               = gSensor
          message.GSENSOR_Data                = gSensorData
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
          message.rtcTime        = utcTime.calcule(rtcTime)
          message.gpsData        = gpsData //mudar para funcao
                
          return message
         
        break;

        case messageType.SLEEPMODE: //5 Sleep Mode Fixed Upload (2004) 

          console.log("<<Sleep Mode Fixed Upload>> %s: ", message.dongleCode)

          var time      = text.substring(36, 36 + (2  *6))
          var timeEnd  = 36 + (2 *6)
          var gpsData  = text.substring(timeEnd, timeEnd + (21* 2))

          message.time = utcTime.calcule(time)
          message.gpsData = gpsData //mudar para modulo

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

        case messageType.READ_VEHICLE_DTCS:
        case messageType.READ_VEHICLE_DTCS_REPLY: //15 Read Vehicle DTCs(4009/C009) - ok
          console.log("<<Read Specified PID Data Value>>")
        
          var randomNo        = text.substring(36, 36 + (2 * 2))
          var dtcType         = text.substring(36, 36 + (2 * 1))
          var dtcNumbers      = convert.hex2dec(xtext.substring(38, 38 + (2 * 1)))
          var endArray        = 40 + (2 * dtcNumbers)
          var dtcArray        = text.substring(40, endArray)
          var time            = utcTime.calcule(text.substring(endArray, endArray + (2 * 6)))

          message.randomNo    = randomNo
          message.dtcType     = dtcType
          message.dtcArray    = dtcArray
          message.utcTime     = time
          
          return message

        break

        case messageType.CLEAR_DTC_REPLY: //16 Clear DTC (400A/C00A) -ok
          console.log("<<CLEAR_DTC_REPLY>>")
        
          var randomNo     = text.substring(36, 36 + (2 * 2))
          var result       = text.substring(40, 40 + (2 * 1))
          var time         = text.substring(42, 42 + (2 * 6))
          
          message.randomNo = randomNo
          message.result   = result
          message.utcTime  = utcTime.calcule(time)

          return message

        break
        
        case messageType.READ:
        case messageType.READ_VIN_REPLY: //17 Read VIN (400B/C00B) -ok
          console.log("<<READ_VIN_REPLY>>")

          var randomNo     = text.substring(36, 36 + (2 * 2))
          var vinCode      = text.substring(40, 40 + (2 * 17))
          var time         = text.substring(74, 74 + (2 * 6))

          message.randomNo = randomNo

          const ascii = Buffer.from(vinCode, 'hex')
          vinCode = ascii.toString('ascii')

          message.vinCode  = vinCode
          message.rtcTime  = utcTime.calcule(time)

          return message

        break

        case messageType.READ_FREEZE_FRAME_REPLY: //18 Reading Freeze Frame (400C/C00C) 
          console.log("<<Reading Freeze Frame>>")

          var randomNo     = text.substring(36, 36 + (2 * 2))

          message.randomNo = randomNo

          //TODO
                    
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
