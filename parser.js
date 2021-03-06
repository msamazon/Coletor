module.exports = function() {
    this.parser = function(text) {
      
      var convert       = require('./Util/Convert')
      var utcTime       = require('./Util/utcTime')
      var modulo4       = require('./Util/modulo4')
      var gsensonUtil   = require('./Util/gsensor')
      var cron          = require('cron')
      var requstDongle  = require('./requestDongle')
      var gpsConvert    = require('./Util/gpsConvert')
      var messageType   = require("./Util/MessageType")
      var alarmType     = require("./Util/AlarmType")
      var Message       = require('./Model/Message')
      
      
      var message = new Message()
      
      //text = "40404b003247512d313630313030313901101e0b100604190c02c83707f887ac0f000000002d130101030304020000010100000d426162636465666768696a6ba51e0b1006041965c30d0a" //login
      //string para text local
      //text = "4040390033574e2d313630313030353503200400010f00000045170811111b331708111101270092d6ab00b8c3e00c00000000000080e90d0a" //alarm
      //text = "4040160033574e2d3136303130303535031041920d0a" // manutencao - 4192
      //text = "4040310033574e2d3136303130303535042018081101361418081101361403787da60034b7e30c08000000ad024c3c0d0a" //sleep mode
      //text = "4040630033574e2d31363031303035350220010911030a2a808000010911030a2a0330a1ac00ce0cdf0c010000006e02060520017b0b2001330c2002840c0d2001000f2001611020020b010d000000000000005e8908008000ffff01010000ee4d0d0a4040630033574e2d31363031303035350220010911030a2b808000010911030a2b0330a1ac00ce0cdf0c010000006f02060520017b0b2001340c2002880c0d2001000f20016110200207010d00000000000000838d08007f00ffff0101000058e20d0a4040630033574e2d31363031303035350220010911030a2c808000010911030a2c0330a1ac00ce0cdf0c010000006f02060520017b0b2001330c2002880c0d2001000f20016110200207010d00000000000000a69108007f00ffff0101000082ed0d0a4040630033574e2d31363031303035350220010911030a2d808000010911030a2d0330a1ac00ce0cdf0c010000007002060520017b0b2001330c2002670c0d2001000f20016110200204010d00000000000000cc9508008000ffff010100009c7a0d0a4040630033574e2d31363031303035350220010911030a2e808000010911030a2e032aa1ac00ce0cdf0c050000007002060520017b0b2001320c20026f0c0d2001000f20016110200206010d00000000000000b79908008000ffff0101000074870d0a4040630033574e2d31363031303035350220010911030a2f808000010911030a2f032aa1ac00ce0cdf0c020000006e02060520017b0b2001320c20028a0c0d2001000f20016110200206010d00000000000000d69d08007f00ffff0101000042b40d0a"
      //text = "40402f0033574e2d31363031303035360bc098003346414450304c3334425231383637323105091100262823e50d0a"
      //text = "40402f0033574e2d31363031303035360bc01d0000580d0a00000000000000000000000000080911112821b31a0d0a"
      //text = '4040830033574e2d3136303130303535012005091100292f80808005091100292f039c23ac000c58e00cfd032907a200060520017c0b20011b0c2002211a0d2001230f200155102002f200280000004e11000090b10b001e00e6ffe8ffd8fe1900c1ffe2fee6ffd0ffccfe0300fdfff7fe3700e1fffafe8a00ffff010100000e5b0d0a4040830033574e2d3136303130303535012005091100293080808005091100293003b624ac001e58e00c18032e07a600060520017c0b2001270c2002e9120d2001190f2001551020027501280000005a110000b2b50b001e00faff00000fff1200fcff14ff1200e0ffdefe2400e2fffbfed4ff1200dafe8a00ffff01010000e0080d0a4040830033574e2d3136303130303535012005091100293180808005091100293103a625ac002458e00c98022007b200060520017c0b2001260c2002d4100d2001190f20015510200257012800000063110000d9b90b001e00e1ffeefff5fe060001000effccff0400f0fed2ff0e00eafeb7ff1200fcfe8a00ffff01010000338b0d0a4040830033574e2d31363031303035350120050911002932808080050911002932034826ac008a58e00c6c0235076c00060520017c0b2001270c2002d4100d2001170f2001551020020501280000006b110000fabd0b001e00f0ffd2fff7fee2ff180007ffc1ffd9fff2fedffff9ff00ffdbffcfff09ff8a00ffff0101000090300d0a4040830033574e2d31363031303035350120050911002933808080050911002933031427ac009658e00c500230077600060520017c0b2001270c2002c60f0d2001160f2001551020021e0128000000731100001ec20b001e00e0ffd7ffd7fed1ff0800f7fec8fff0ff01ffb1ffbeffd8fecafffdff0eff8a00ffff01010000b1030d0a'
      //text = '404082003247512d313630313030313901201e0b1006041e8080801e0b1006041f0f42c737071088ac0f1d0000006e1306052001740b2001200c2002d30b0d2001000f20014a112001170100000000000000caa800001e006aff120044ff65ff15003dff6aff130042ff65ff140042ff5fff14003dff8c00ffff0100000073eb0d0a'
      var result = ''
      
      var head         = text.substring(0, 4)
      var headLen      = text.substring(4, 8)
      var dongleCode   = text.substring(8, 32)
      var eventCode    = text.substring(32, 36)

      dongleCode       = convert.hex2ascii(dongleCode)

      message.fullMessage   = text
      message.packageHead   = head
      message.packageLength = headLen
      message.dongleCode    = dongleCode
      message.eventcode     = eventCode
      message.dateReceived  = new Date().toISOString().
                                replace(/T/, ' ').      // replace T with a space
                                replace(/\..+/, '')     // delete the dot and everything after

      console.log("parser::dongleCode: %s",dongleCode)

      console.log("parser::Evento %s ", eventCode)

      switch(eventCode) {
        
        case messageType.LOGIN://1 Login Packet (1001/9001) 

          console.log("  <<login>> ")

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

          obdModule                = modulo4.calcule(obdModule)
          firmwareVersion          = modulo4.calcule(firmwareVersion)
          hardwareVersion          = modulo4.calcule(hardwareVersion)
          //[gps, speed, high, course]
          var gpsTemp              = gpsConvert.calcule(gps)

          message.gpsData          = gpsTemp[0]
          message.speed            = gpsTemp[1]
          message.high             = gpsTemp[2]
          message.course           = gpsTemp[3]
          message.obdModule        = obdModule
          message.firmwareVersion  = firmwareVersion
          message.hardwareVersion  = hardwareVersion
          message.qtparam          = qtparam
          message.param            = param
          message.dongleDateHex    = dongleDateHex
          message.crcCode          = crcCode
          message.eventname        = "login"
          //log
          /*
          console.log("login::odb %s", obdModule)
          console.log("login::firmware %s", firmwareVersion)
          console.log("login::hardware %s", hardwareVersion)
          console.log("login::gps %s", gpsTemp[0])
          console.log("login::speed %s", gpsTemp[1])
          console.log("login::high %s", gpsTemp[2])
          console.log("login::course %s", gpsTemp[3])
          //Verificar
          console.log("login::qtparam %s", qtparam)
          console.log("login::param %s", param)
          console.log("login::dongleDateHex %s", dongleDateHex)
          console.log("login::crcCode %s", crcCode)
          */
          return message
        break;

        case messageType.MAINTENANCE://2 Maintenance(1003/9003) 

          console.log("  <<Maintenance>>")

          message.data             = convert.hex2ascii(text.substring(36, 48))
          message.eventname        = "maintenance"
          
          console.log("maintenance::data %s", message.data)
          
          return message

        break;

        case messageType.COMPREHENSIVE_DATA_SUPPLEMENT:
        case messageType.COMPREHENSIVE_DATA: //3 Comprehensive data (0x2001/0x2002)
          console.log("  <<Comprehensive data>>")
          
          var rtcTime                    = utcTime.calcule(text.substring(36, 36 + (2 * 6)))
          var dataSitch                  = text.substring(48, 48 + (2 * 3))
          var gpsData                    = text.substring(54, 54 + (2 * 21))
          var PidNo                      = convert.hex2dec(text.substring(96, 96 + (2 * 1))) //pid = 8 *2
          
          var gpsTemp                    = gpsConvert.calcule(gpsData)

          message.gpsData                = gpsTemp[0]
          message.speed                  = gpsTemp[1]
          message.high                   = gpsTemp[2]
          message.course                 = gpsTemp[3]

          var pidIni = 98 //inicio do pid

          for(var i = 0; i < PidNo; i++) {

            var _pidNO = text.substring(pidIni, pidIni + (2 *2))
            var _pidLen = text.substring(pidIni + 4, (pidIni + 4) + (2 *1))
            var _pidValue = text.substring(pidIni + 6, (pidIni + 6) + (2 * convert.hex2dec(_pidLen)))
            
            _pidNO = convert.hex2dec(_pidNO)

            //_pidLen = convert.hex2dec(_pidValue)
            var _h2d = convert.hex2dec(_pidValue)

            if (_h2d == NaN) {  
              _h2d = "0"
            }

            _pidValue = _h2d

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

          //console.log("current trip fuel: %s", fuel)

          fuel = modulo4.inverter(fuel)
          fuel = convert.hex2dec(fuel)

          //console.log("comprehensive::currentTripFuel: %s l", fuel)

          var fuel0 = pidIni + (2 * 4)

          var cTripFuelCons  = text.substring(fuel0, fuel0 + (4 * 2))

          //console.log("cTripFuelCons: %s", cTripFuelCons)

          cTripFuelCons = modulo4.inverter(cTripFuelCons) 
          cTripFuelCons = convert.hex2dec(cTripFuelCons) * 0.01

          //console.log("comprehensive::cTripFuelCons: %s meter", cTripFuelCons)

          var trip =  fuel0 + (4 * 2)

          var cTripFuelMileage = text.substring(trip, trip + (4 * 2))

          //console.log("cTripFuelMileage: %s", cTripFuelMileage)

          cTripFuelMileage = modulo4.inverter(cTripFuelMileage)
          cTripFuelMileage = convert.hex2dec(cTripFuelMileage)

          //console.log("comprehensive::cTripFuelMileage: %s ms", cTripFuelMileage)

          var senson0 = trip + (4 * 2)
          var gSensor = text.substring(senson0, senson0 + (2 * 2))

          console.log("gSensor %s", gSensor)

          
	        gSensor = modulo4.inverter(gSensor)
          gSensor = convert.hex2dec(gSensor)

          console.log("comprehensive::gSensor %s", gSensor)

          var sensorData0 = senson0 + (2 * 2)
          var gSensorData = text.substring(sensorData0, sensorData0 + (2 * gSensor))

          console.log("comprehensive:gSensorData %s", gSensorData)
          //calcule
          var group1 = gSensorData.substring(0, 6 * 2)
          var g1x, g2x, g3x, g4x, g5x
	        var g1y, g2y, g3y, g4y, g5y
	        var g1z, g2z, g3z, g4z, g5z
          
	        var group1S = gsensonUtil.calcule(group1)

          message.gsensor_g1.x = group1S[0]
          message.gsensor_g1.y = group1S[1]
          message.gsensor_g1.z = group1S[2]

          var group2 = gSensorData.substring(12, 12 +(6 * 2))
          
          var group2S = gsensonUtil.calcule(group2)

          message.gsensor_g2.x = group2S[0]
          message.gsensor_g2.y = group2S[1]
          message.gsensor_g2.z = group2S[2]

          var group3 = gSensorData.substring(24, 24 + (6 *2))
                    
          var group3S = gsensonUtil.calcule(group3)
        
          message.gsensor_g3.x = group3S[0]
          message.gsensor_g3.y = group3S[1]
          message.gsensor_g3.z = group3S[2]

          var group4 = gSensorData.substring(36, 36 + (6 *2))

          var group4S = gsensonUtil.calcule(group4)
          
          message.gsensor_g4.x = group4S[0]
          message.gsensor_g4.y = group4S[1]
          message.gsensor_g4.z = group4S[2]

          var group5 = gSensorData.substring(48, 48 + (6 *2))

          var group5S = gsensonUtil.calcule(group5)

          message.gsensor_g5.x = group5S[0]
          message.gsensor_g5.y = group5S[1]
          message.gsensor_g5.z = group5S[2]

          var field0 = sensorData0 + (2 * gSensor)
          var customField   = text.substring(field0, field0 + (2 * 8))

          //console.log("comprehensive::customField: %s", customField)

          var voltage = customField.substring(0, 4)
          //console.log("voltage: %s V", voltage)

          voltage = convert.hex2dec(voltage.substring(2, 4) + voltage.substring(0, 2)) * 0.1
          //console.log("comprehensive::voltage: %s V", voltage)

          var vehicle = customField.substring(4, 8)
          //console.log("comprehensive::vehicle %s", vehicle)

          var accOn = customField.substring(8, 10)
          //console.log("comprehensive::accOn %s", accOn)

          var mmxc = customField.substring(10, 12)
          //console.log("comprehensive::mmxc %s", mmxc)

          var reserved = customField.substring(12, 16)
          //console.log("comprehensive::reserved %s", reserved)

          //console.log("rtcTime ----> %s", rtcTime)

          //rtcTime             = utcTime.calcule(rtcTime)
          message.time                        = rtcTime
          message.dataSitch                   = dataSitch

          //message.gpsData                     = gpsConvert.calcule(gpsData)
          message.currentTripFuelConsumption  = fuel
          message.currentTripMileage          = cTripFuelMileage
          message.currentTripDuration         = cTripFuelCons
          message.voltage                     = voltage
          message.vehicle                     = vehicle
          message.accOn                       = accOn
          message.mmxc                        = mmxc
          message.reserved                    = reserved
          message.eventname                   = "comprehensive"

          return message

        break;

        case messageType.ALARM: //4 Alarm (2003/A003) 
        
          console.log("  <<Alarm>>")

          var randomNo        = text.substring(36, 36 + (2 * 2))
          var alarmTag        = text.substring(40, 40 + (2 * 1))
          var alarmNo         = text.substring(42, 42 + (2 * 1))
          var alarmThreshold  = text.substring(44, 44 + (2 * 2))
          var alarmCurrent    = text.substring(48, 48 + (2 * 2))
          var rtcTime         = text.substring(52, 52 + (2 * 6))
          var gpsData         = text.substring(64, 64 +(2 * 21))

          alarmNo             = convert.hex2dec(alarmNo)
          alarmCurrent        = modulo4.inverter2(alarmCurrent)

          message.randomNo       = randomNo
          message.alarmTag       = convert.hex2dec(alarmTag)
          message.alarmNo        = alarmType.alarm(alarmNo)
          message.rtcTime        = utcTime.calcule(rtcTime)

          message.alarmThreshold = alarmThreshold
          message.alarmCurrent   = alarmCurrent
          

          //[result, speed, high, course]
          var gpsTemp              = gpsConvert.calcule(gpsData)
          message.gpsData          = gpsTemp[0]
          message.speed            = gpsTemp[1]
          message.high             = gpsTemp[2]
          message.course           = gpsTemp[3]
          message.eventname        = "alarm"     
          /* 
          console.log("alarm::randomNo %s", randomNo)
          console.log("alarm::alarmTag %s",convert.hex2dec(alarmTag))
          console.log("alarm::alarmNo %s",alarmNo)
          console.log("alarm::alarmThreshold %s",alarmThreshold)
          console.log("alarm::alarmCurrent %s",alarmCurrent)

          console.log("alarm::gps %s", gpsTemp[0])
          console.log("alarm::speed %s", gpsTemp[1])
          console.log("alarm::high %s", gpsTemp[2])
          console.log("alarm::course %s", gpsTemp[3])
          console.log("alarm::rtcTime %s", utcTime.calcule(rtcTime))
          */

          return message
         
        break;

        case messageType.SLEEPMODE: //5 Sleep Mode Fixed Upload (2004) 

          console.log("  <<Sleep Mode Fixed Upload>>")

          var time      = text.substring(36, 36 + (2  *6))
          var timeEnd  = 36 + (2 *6)
          var gpsData  = text.substring(timeEnd, timeEnd + (21* 2))

          message.time = utcTime.calcule(time)

          //[result, speed, high, course]
          var gpsTemp = gpsConvert.calcule(gpsData)
          message.gpsData          = gpsTemp[0]
          message.speed            = gpsTemp[1]
          message.high             = gpsTemp[2]
          message.course           = gpsTemp[3]
          message.gpsData          = gpsConvert.calcule(gpsData)
          message.eventname        = "sleep mode" 
          // message.gpsData = gpsConvert.calcule(gpsData)

          /*
          console.log("sleepmode::time %s", utcTime.calcule(time))
          console.log("sleepmode::gps %s", gpsTemp[0])
          console.log("sleepmode::speed %s", gpsTemp[1])
          console.log("sleepmode::high %s", gpsTemp[2])
          console.log("sleepmode::course %s", gpsTemp[3])
          */
          return message

        break;

        case messageType.SETTING: //6 Setting (3001/B001) 
          console.log("  <<Setting>>")
        
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
          console.log("  <<Inquiry>>")
          
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
           console.log("  <<Get LOG>>")

           var randomNo        = text.substring(36, 36 + (2 * 2))
           var logType         = text.substring(40, 40 + (2 * 1))

           message.randomNo    = randomNo
           message.logType     = logType

           return message
           
        break;

        case messageType.UNIT_SELF_TEST: //9 UNIT Self-test(4002/C002) 
           console.log("  <<UNIT Self-test>>")

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
          console.log("  <<Clear Comprehensive Data Storage Area>>")

          var randomNo        = text.substring(36, 36 + (2 * 2))
                    
          message.randomNo    = randomNo
          
          return message

        break;

        case messageType.READ_DEVICE_SUPORTED_PID: //13 Read vehicle supported PID number (4007/C007)
          console.log("  <<Read vehicle supported PID number>> %", message.dongleCode)

          var randomNo        = text.substring(36, 36 + (2 * 2))
          
          message.randomNo    = randomNo
          
          
          return message

        break;

        case messageType.READ_SPECIFIED_PID_DATA_VALUE: //14 Read Specified PID Data Value (4008/C008) 
          console.log("  <<Read Specified PID Data Value>>")

          var randomNo        = text.substring(36, 36 + (2 * 2))
          var pidNumbers      = text.substring(36, 36 + (2 * 1))

          var pck_1           = parseInt(pidNumbers.substring(0, 2), 16)
          var pck_2           = parseInt(pidNumbers.substring(2, 4), 16)

          var result          = pck_2.toString() + pck_1.toString()

          var pidList         = text.substring(38, 38 * (result * 2))
          
          message.randomNo    = randomNo
          message.pidNumbers  = pidNumbers
          message.pidList     = pidList
          message.eventname   = "read specified pid" 

          return message

        break;

        case messageType.READ_VEHICLE_DTCS:
        case messageType.READ_VEHICLE_DTCS_REPLY: //15 Read Vehicle DTCs(4009/C009) - ok
          console.log("  <<Read Vehicle DTC>>")

          console.log("text %s", text)
        
          var randomNo        = text.substring(36, 36 + (2 * 2))
          var dtcType         = text.substring(36, 36 + (2 * 1))
          var dtcNumbers      = convert.hex2dec(text.substring(38, 38 + (2 * 1)))
          var endArray        = 40 + (2 * dtcNumbers)
          var dtcArray        = text.substring(40, endArray)
          var time            = utcTime.calcule(text.substring(endArray, endArray + (2 * 6)))

          message.randomNo    = randomNo
          message.dtcType     = dtcType
          message.dtcArray    = dtcArray
          message.utcTime     = time
          message.eventname   = "read vehicle dtc" 
          
          return message

        break

        case messageType.CLEAR_DTC_REPLY: //16 Clear DTC (400A/C00A) -ok
          console.log("  <<CLEAR_DTC_REPLY>>")
        
          var randomNo     = text.substring(36, 36 + (2 * 2))
          var result       = text.substring(40, 40 + (2 * 1))
          var time         = text.substring(42, 42 + (2 * 6))
          
          message.randomNo = randomNo
          message.result   = result
          message.utcTime  = utcTime.calcule(time)
          message.eventname   = "clear dtc"
          return message

        break
        
        case messageType.READ:
        case messageType.READ_VIN_REPLY: //17 Read VIN (400B/C00B) -ok
          console.log("  <<READ_VIN_REPLY>>")

          var randomNo     = text.substring(36, 36 + (2 * 2))
          var vinCode      = text.substring(40, 40 + (2 * 17))
          var time         = text.substring(74, 74 + (2 * 6))

          message.randomNo = randomNo

          console.log("vincode %s", vinCode)
          
          var buff = new Buffer(vinCode, 'hex')

          var _ascii = buff.toString ("ascii")

          console.log("ascii %s", _ascii)

          message.vinCode  = _ascii

          message.rtcTime  = utcTime.calcule(time)

          message.eventname   = "read vim"

          return message

        break

        case messageType.READ_FREEZE_FRAME_REPLY: //18 Reading Freeze Frame (400C/C00C) 
          console.log("  <<Reading Freeze Frame>>")

          var randomNo     = text.substring(36, 36 + (2 * 2))

          message.randomNo = randomNo

          //TODO
                    
          return message

        break

        case messageType.SEND_UPGRADING: //19 Send Upgrading/Reply (5001/D001) 
          console.log("  <<Send Upgrading/Reply>>")

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
          console.log("  <<Issue Upgrade Package /Reply>>")

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
