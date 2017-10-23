'use strict';

var mongoose        = require("mongoose")
var Device            = require("../Model/Device")

exports.findDevice = function(req, res) {

    console.log ('User List')
    
    Device.find({}, function(err, users) {
        res.json({ users: users })
    })
}

exports.profile = function(req, res) {
    console.log('profile')
}
    
exports.logout = function(req, res) {
    console.log('logging out')
    req.logout();
    res.redirect('/')
}