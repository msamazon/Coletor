module.exports = function() {
    this.parser = function(text) {

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

        case "0110": //login

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

        case "0310"://Maintenance 0x1003

          console.log("Maintenance")

          const data = text.substring(36, 48)

          return JSON.stringify({ full: text, dateReceived: dateReceived, parser: {
            packageHead: head, packageLength: headLen, dongleCode: dongleCode,
            eventcode: eventCode, data: data
           } }, null, 4)
          console.log(result)

        break;

        case "0420": //Sleep Mode
          console.log("Sleep Mode Fixed Upload")

          var time      = text.substring(36, 36 + (2 *6))
          const timeEnd   = 36 + (2 *6)
          var gpsData  = text.substring(timeEnd, timeEnd + (21* 2))

          console.log(time)
          console.log(gpsData1)

          return JSON.stringify({ full: text, dateReceived: dateReceived, parser: {
            packageHead: head, packageLength: headLen, dongleCode: dongleCode,
            eventcode: eventCode, time: time, gpsData: gpsData
           } }, null, 4)

          break;
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
        default:
            console.log("Desculpe, estamos sem nenhuma " + eventCode + ".");
        }
      return 0
    }
}
