module.exports = function() {
    this.parser = function(text) {

      //text = "4040390033574e2d313630313030353503200400010f00000045170811111b331708111101270092d6ab00b8c3e00c00000000000080e90d0a" alarm

      var result = '';

      var dateReceived = new Date()      
      var head         = text.substring(0, 4)
      var headLen      = text.substring(4, 8)
      var dongleCode   = text.substring(8, 32)
      var eventCode    = text.substring(32, 36)

      console.log(dateReceived)
      console.log(dongleCode)
      console.log("Evento %s ", eventCode)

      switch(eventCode) {
        
        case "0190":
        case "0110": //Login Packet (1001/9001) 

          console.log("login")

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

          console.log(gpsData)
          console.log(obdModule)
          console.log(firmwareVersion)
          console.log(hardwareVersion)
          console.log(qtparam)
          console.log(param)
          console.log(dongleDateHex)
          console.log(crcCode)

          return JSON.stringify({ full: text, dateReceived: dateReceived, parser: {
            packageHead: head, packageLength: headLen, dongleCode: dongleCode,
            eventcode: eventCode, gpsData: gpsData, obdModule: obdModule,
            firmwareVersion: firmwareVersion, hardwareVersion: hardwareVersion,
            customParam: param, dongleDateHex: dongleDateHex, crcCode: crcCode
           } }, null, 4)

        break;

        case "0390":
        case "0310"://Maintenance(1003/9003) 

          console.log("Maintenance")

          const data = text.substring(36, 48)

          return JSON.stringify({ full: text, dateReceived: dateReceived, parser: {
            packageHead: head, packageLength: headLen, dongleCode: dongleCode,
            eventcode: eventCode, data: data
           } }, null, 4)
          console.log(result)

        break;

        case "0420": // Sleep Mode Fixed Upload (2004) 

          console.log("Sleep Mode Fixed Upload")

          var time      = text.substring(36, 36 + (2 *6))
          const timeEnd   = 36 + (2 *6)
          var gpsData  = text.substring(timeEnd, timeEnd + (21* 2))

          console.log(time)
          console.log(gpsData)

          return JSON.stringify({ full: text, dateReceived: dateReceived, parser: {
            packageHead: head, packageLength: headLen, dongleCode: dongleCode,
            eventcode: eventCode, time: time, gpsData: gpsData
           } }, null, 4)

        break;
        
        case "0220":
        case "0120": //Comprehensive data (0x2001/0x2002)
            console.log("Comprehensive data")
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

            return JSON.stringify({ full: text, parser: {
              packageHead: head, packageLength: headLen, dongleCode: dongleCode,
              eventcode: eventCode, time: time, dataSitch: dataSitch,
              gpsData: gpsData, obdModule: odbData,
              currentTrip: { fuelConsumption: currentTripFuelConsumption,
              Mileage: currentTripMileage, Duration: currentTripDuration },
              GSENSOR_Data: GSENSOR_Data, customField: customField
            } }, null, 4)

        break;
        
        case "03a3":
        case "0320": // Alarm (2003/A003) 
          console.log("Alarm")

          var randomNo        = text.substring(36, 36 + (2 * 2))
          var alarmTag        = text.substring(40, 40 + (2 * 1))
          var alarmNo         = text.substring(42, 42 + (2 * 1))
          var alarmThreshold  = text.substring(44, 44 + (2 * 2))
          var alarmCurrent    = text.substring(48, 48 + (2 * 2))
          var rtcTime         = text.substring(52, 52 + (2 * 6))
          var gpsData         = text.substring(64, 64 +(2 * 21))

          console.log(randomNo)
          console.log(alarmTag)
          console.log(alarmNo)
          console.log(alarmThreshold)
          console.log(alarmCurrent)
          console.log(rtcTime)
          console.log(gpsData)
          //tem o resto nao mapeado
          return JSON.stringify({ full: text, dateReceived: dateReceived, parser: {
            packageHead: head, packageLength: headLen, dongleCode: dongleCode,
            eventcode: eventCode, randomNo: randomNo, alarmTag: alarmTag, 
            alarmNo: alarmNo, alarmThreshold: alarmThreshold, alarmCurrent:
            alarmCurrent, rtcTime: rtcTime, gpsData: gpsData
           } }, null, 4)
        break;

        case "01b0":
        case "0130": //Setting (3001/B001) 
          console.log("Setting")
        
          var randomNo        = text.substring(36, 36 + (2 * 2))
          var paramNumbers    = text.substring(40, 36 + (2 * 1))

          console.log(randomNo)
          console.log(paramNumbers)

        break;

        case "02b0":
        case "0230": //Inquiry (3002/B002) 
          console.log("Inquiry")
          
          var randomNo        = text.substring(36, 36 + (2 * 2))
          var paramNumbers    = text.substring(40, 36 + (2 * 1))

          console.log(randomNo)
          console.log(paramNumbers)

        break;

        case "01c0":
        case "0140": // Get LOG (4001/C001) 
           console.log("Get LOG")

           var randomNo        = text.substring(36, 36 + (2 * 2))
           var logType         = text.substring(40, 40 + (2 * 1))

           console.log(randomNo)
           console.log(logType)

           return JSON.stringify({ full: text, dateReceived: dateReceived, parser: {
            packageHead: head, packageLength: headLen, dongleCode: dongleCode,
            eventcode: eventCode, randomNo: randomNo, logType: logType
          } }, null, 4)
           
        break;

        case "02c0":
        case "0240": // UNIT Self-test(4002/C002) 
           console.log("UNIT Self-test")

           var randomNo        = text.substring(36, 36 + (2 * 2))

           console.log(randomNo)

          return JSON.stringify({ full: text, dateReceived: dateReceived, parser: {
            packageHead: head, packageLength: headLen, dongleCode: dongleCode,
            eventcode: eventCode, randomNo: randomNo
          } }, null, 4)

        break;

        case "03c0":
        case "0340": //Reset Device (4003/C003)
          console.log("Reset Device")

          var randomNo        = text.substring(36, 36 + (2 * 2))

          console.log(randomNo)

          return JSON.stringify({ full: text, dateReceived: dateReceived, parser: {
            packageHead: head, packageLength: headLen, dongleCode: dongleCode,
            eventcode: eventCode, randomNo: randomNo
          } }, null, 4)

        break;

        case "0440":
        case "04c0": //Restore Factory Settings (4004/C004)
          console.log("Restore Factory Settings")

          var randomNo        = text.substring(36, 36 + (2 * 2))
          
          console.log(randomNo)
          
          return JSON.stringify({ full: text, dateReceived: dateReceived, parser: {
            packageHead: head, packageLength: headLen, dongleCode: dongleCode,
            eventcode: eventCode, randomNo: randomNo
          } }, null, 4)

        break;

        case "0540":
        case "05c0": //Clear Comprehensive Data Storage Area(4005/C005) 
          console.log("Clear Comprehensive Data Storage Area")

          var randomNo        = text.substring(36, 36 + (2 * 2))
          
          console.log(randomNo)
          
          return JSON.stringify({ full: text, dateReceived: dateReceived, parser: {
            packageHead: head, packageLength: headLen, dongleCode: dongleCode,
            eventcode: eventCode, randomNo: randomNo
          } }, null, 4)

        break;

        case "0740":
        case "07c0": //Read vehicle supported PID number (4007/C007)
          console.log("Read vehicle supported PID number")

          var randomNo        = text.substring(36, 36 + (2 * 2))
          
          console.log(randomNo)
          
          return JSON.stringify({ full: text, dateReceived: dateReceived, parser: {
            packageHead: head, packageLength: headLen, dongleCode: dongleCode,
            eventcode: eventCode, randomNo: randomNo
          } }, null, 4)          

        break;

        case "0840":
        case "08c0": //Read Specified PID Data Value (4008/C008) 
          console.log("Read Specified PID Data Value")

          var randomNo        = text.substring(36, 36 + (2 * 2))
          var pidNumbers      = text.substring(36, 36 + (2 * 1))
          
          console.log(randomNo)
          console.log(pidNumbers)
          //TODO pid list

        break;


        case "09c0":
        case "0940": //Read Vehicle DTCs(4009/C009)
          console.log("Read Specified PID Data Value")
        
          var randomNo        = text.substring(36, 36 + (2 * 2))
          var dtcType         = text.substring(36, 36 + (2 * 1))

          return JSON.stringify({ full: text, dateReceived: dateReceived, parser: {
            packageHead: head, packageLength: headLen, dongleCode: dongleCode,
            eventcode: eventCode, randomNo: randomNo, dtcType: dtcType
          } }, null, 4)

        break

        case "0a40":
        case "0ac0": //Clear DTC (400A/C00A) 
          console.log("Clear DTC")
        
          var randomNo        = text.substring(36, 36 + (2 * 2))

          return JSON.stringify({ full: text, dateReceived: dateReceived, parser: {
            packageHead: head, packageLength: headLen, dongleCode: dongleCode,
            eventcode: eventCode, randomNo: randomNo
          } }, null, 4)

        break

        case "0b40":
        case "0bc0": //Read VIN (400B/C00B)
          console.log("Read VIN")
        
          var randomNo        = text.substring(36, 36 + (2 * 2))

          return JSON.stringify({ full: text, dateReceived: dateReceived, parser: {
            packageHead: head, packageLength: headLen, dongleCode: dongleCode,
            eventcode: eventCode, randomNo: randomNo
          } }, null, 4)

        break

        case "0c40":
        case "0cc0": //Reading Freeze Frame (400C/C00C) 
          console.log("Reading Freeze Frame ")

          var randomNo        = text.substring(36, 36 + (2 * 2))
          
          return JSON.stringify({ full: text, dateReceived: dateReceived, parser: {
            packageHead: head, packageLength: headLen, dongleCode: dongleCode,
            eventcode: eventCode, randomNo: randomNo
          } }, null, 4)

        break

        case "0150":
        case "01d0": //Send Upgrading/Reply (5001/D001) 
          console.log("Send Upgrading/Reply")

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

          console.log(upgradeID)
          console.log(packetSign)
          console.log(packetNumber)
          console.log(packetLength)
          console.log(packetContents)
          
          return JSON.stringify({ full: text, dateReceived: dateReceived, parser: {
            packageHead: head, packageLength: headLen, dongleCode: dongleCode,
            eventcode: eventCode, upgradeID: upgradeID, packetSign: packetSign,
            packetNumber: packetNumber, packetContents: packetContents
          } }, null, 4)

        break

        default:
            console.log("Desculpe, estamos sem nenhuma " + eventCode + ".");
        }
      return 0
    }
}
