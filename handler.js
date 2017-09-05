exports.handler = function(socket, buffer) {
    var mongoose = require('mongoose')
    var Message = require('./Model/Message')
    var messageType = require("./Util/MessageType")
    require('./parser.js')();
    require('./replyMessage.js')();
    var requestDongle = require('./requestDongle')

    var remoteAddress = socket.remoteAddress

    console.log("=====================================")
    console.log('>new client connection is made %s', remoteAddress)
  
    console.log("socket.address() %s",socket.address())
    console.log("remoteAddress %s", remoteAddress)

    var buff = new Buffer(buffer, 'utf8')

    var msg = ''
    var hex = buffer.toString ("hex")        
    var data = buffer.toString()
    
    if (data.indexOf('\r\n') > -1) {
        var lines = data.split('\r\n');
        var i = lines.length;
        while (i--) {
            msg = msg + lines[i]
        }
    } else {
        // console.log('>>data:', data);
    }
        
    var message = new Message()

    var result = parser(hex)
    
    message = result
    message.ip = remoteAddress
    
    var reply = replyMessage(message)

    if (message.eventcode == messageType.LOGIN) {
        var reMsg = requestDongle.send(messageType.READ_VIN, message.dongleCode)

        console.log("Send Read Vin")

        socket.write(reMsg)

        var reMsg1 = requestDongle.send(messageType.READ_VEHICLE_DTCS, message.dongleCode)

        console.log("Send READ_VEHICLE_DTCS")

        socket.write(reMsg1)
    }
    
    var promise = message.save(function (err) {
        if (err) console.log(err)
        else console.log('salvo no banco')
    })
    
    console.log("reply? %s", reply[0])
    
    if (reply[0] == 1) {
        console.log("reply %s", reply[1])
          
        console.log("Mensagem Enviada")
    
        socket.write(reply[1])
    }
}