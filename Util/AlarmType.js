exports.alarm = function(s) {

    s = parseInt(s, 10)
    
    switch (s) {
        case 1:
            return "MIL on"
          break
        case 2:
            return "Idle Engine"
        case 3:
            return "Fatigue Driving"
        case 4:
            return "Low voltage"
        case 5:
            return "High temperature"
        case 6:
            return "Towing"
        case 7:
            return "Speeding"
        case 8:
            return "High RPM"
        case 9:
            return "Hard acceleration"
        case 10:
            return "Hard braking"
        case 11:
            return "Quick turn"
        case 12:
            return "Power on"
        case 13:
            return "Power off"
        case 14:
            return "SOS"
        case 15:
            return "ACC Status"
        default:
            return "not registered"
      }
}
 
// module.exports = Object.freeze({
//     MIL_ON:                                          '1',//1
//     IDLE_ENGINE:                                     '2',
//     FATIGUE_DRIVING:                                 '3',
//     LOW_VOLTAGE:                                     '4',
//     HIGH_TEMPERATURE:                                '5',
//     TOWING:                                          '6',
//     SPEEDING:                                        '7',
//     HIGH_RPM:                                        '8',
//     HARD_ACCELERATION:                               '9',
//     HARD_BRAKING:                                    '10',
//     QUICK_TURN:                                      '11',
//     POWER_ON:                                        '12',
//     POWER_OFF:                                       '13',
//     SOS:                                             '14',
//     ACC_STATUS:                                      '15',
// })