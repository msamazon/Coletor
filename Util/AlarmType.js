// 'use strict';

//0x01 MIL on 
//0x02 Idle Engine   
//0x03 Fatigue Driving   
//0x04 Low voltage 
//0x05 High temperature 
//0x06 Towing 
//0x07 Speeding 
//0x08 High RPM 

module.exports = Object.freeze({
    MIL_ON:                                          '01',//1
    IDLE_ENGINE:                                     '02',
    FATIGUE_DRIVING:                                 '03',
    LOW_VOLTAGE:                                     '04',
    HIGH_TEMPERATURE:                                '05',
    TOWING:                                          '06',
    SPEEDING:                                        '07',
    HIGH_RPM:                                        '08',
    HARD_ACCELERATION:                               '09',
    HARD_BRAKING:                                    '0a',
    QUICK_TURN:                                      '0b',
    POWER_ON:                                        '0c',
    POWER_OFF:                                       '0d',
    ACC_STATUS:                                      '0f',
})