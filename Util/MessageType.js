// 'use strict';

// 10XX/90XX Continously events.
// 20XX Dongle uploading OBD/GPS/GSENSOR data events or alarm events.
// 30XX/B0XX Inquiry Setting event.
// 40XX/C0XX Reading control events.
// 50XX/D0XX Upgrading events. 

module.exports = Object.freeze({
    LOGIN:                                          '0110',//1
    LOGIN_REPLY:                                    '0190',
    MAINTENANCE:                                    '0310',//2
    MAINTENANCE_REPLAY:                             '0390',//3
    SLEEPMODE:                                      '0420',//4
    COMPREHENSIVE_DATA:                             '0102',//5
    COMPREHENSIVE_DATA_SUPPLEMENT:                  '0220',
    ALARM:                                          '0320',//6
    ALARM_REPLAY:                                   '03a0',
    SETTING:                                        '0130',//7
    SETTING_REPLY:                                  '01b0',
    INQUIRY:                                        '0230',//8
    INQUIRY_REPLAY:                                 '02b0',
    GETLOG:                                         '0140',//9
    GETLOG_REPLY:                                   '01c0',
    UNIT_SELF_TEST:                                 '0240',//10
    UNIT_SELF_TEST_REPLY:                           '02c0',
    RESET_DEVICE:                                   '0340',
    RESET_DEVICE_REPLY:                             '03c0',
    RESTORE_FACTORY_SETTINGS:                       '0440',
    RESTORE_FACTORY_SETTINGS_REPLY:                 '04c0',
    CLEAR_COMPREHENSIVE_DATA:                       '0540',
    CLEAR_COMPREHENSIVE_DATA:                       '05c0',
    READ_DEVICE_SUPORTED_PID:                       "0740",
    READ_DEVICE_SUPORTED_PID_REPLY:                 "07c0",
    READ_VEHICLE_SUPPORTED_PID_NUMBER:              '0740',
    READ_VEHICLE_SUPPORTED_PID_NUMBER_REPLY:        '07c0',
    READ_SPECIFIED_PID_DATA_VALUE:                  '0840',
    READ_SPECIFIED_PID_DATA_VALUE_REPLY:            '080c',
    READ_VEHICLE_DTCS:                              '0940',
    READ_VEHICLE_DTCS_REPLY:                        '0940',
    CLEAR_DTC:                                      '0a40',
    CLEAR_DTC_REPLY:                                '0Ac0',
    READ_VIN:                                       '0b40',
    READ_VIN_REPLY:                                 '0bc0',
    READ_FREEZE_FRAME:                              '0c40',
    READ_FREEZE_FRAME_REPLY:                        '0cc0',
    SEND_UPGRADING:                                 '0150',//19
    SEND_UPGRADING_REPLY:                           '01d0',
    ISSUE_UPGRADE_PACKAGE:                          '0250',
    ISSUE_UPGRADE_PACKAGE_REPLY:                    '02d0',//20

})