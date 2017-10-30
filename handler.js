exports.handler = function(socket, buffer) {
    var mongoose        = require('mongoose')
    var Message         = require('./Model/Message')
    var messageType = require("./Util/MessageType")
    require('./parser.js')();
    require('./replyMessage.js')();
    var requestDongle   = require('./requestDongle')
    var cerberus        = require('./Util/Cerberus')

    var remoteAddress = socket.remoteAddress

    console.log("=====================================")
    console.log('handler::new client connection is made %s', remoteAddress)
    console.log("handler::socket.address() %s",socket.address())

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

    //if (message.eventcode == messageType.LOGIN) {
        var reMsg = requestDongle.send(messageType.READ_VIN, message.dongleCode)

        console.log("handler::Send Read Vin")

        socket.write(reMsg)

        var reMsg1 = requestDongle.send(messageType.READ_VEHICLE_DTCS, message.dongleCode)

        console.log("handler::Send READ_VEHICLE_DTCS")

        socket.write(reMsg1)
   // }
    
   //verifica se esta na White list

   if (cerberus.whitelist(message.dongleCode)) {

       console.log("handler:: dongleCode esta na whitelist")

    //    var promise = message.save(function (err) {

    //        if (err) console.log(err)

    //        else console.log('handler::salvo no banco')
    //     })
   }else {
       console.log("handler:: dongleCode nao salvo")
   }
    
    
    console.log("handler::reply? %s", reply[0])
    
    if (reply[0] == 1) {
        console.log("handler::reply %s", reply[1])
          
        console.log("handler::Mensagem Enviada")
    
        socket.write(reply[1])
    }
}