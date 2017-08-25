// 'use strict';

function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("LOGIN", "0110");
define("MAINTENANCE", "0310");
define("SLEEPMODE", "0420");
