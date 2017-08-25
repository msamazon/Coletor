const net = require('net')
const mongoose = require('mongoose')
var Message = require('./Model/Message')
require('./parser.js')();
require('./replyMessage.js')();

var server = net.createServer()

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://dbuser:123mudar#@ds139428.mlab.com:39428/driveondb', { useMongoClient: true })

mongoose.connection.on('connected', () => {
  return console.log('Mongoose conectado')
})

mongoose.connection.on('disconnected', () => {
  return console.log('Mongoose desconectado')
})

mongoose.connection.on('error', error => {
  return console.log('Mongoose erro de conexão: ' + error)
})

server.on("connection", function(socket) {

  socket.setKeepAlive(true, 1000) 

  var remoteAddress = socket.remoteAddress
  console.log("=====================================")
  console.log('>new client connection is made %s', remoteAddress)

  console.log("socket.address() %s",socket.address())
  console.log("remoteAddress %s", remoteAddress)

  var msg = ''

  socket.on("data", function(buffer) {
    console.log('> Connection data from %s ', remoteAddress)
    console.log('> Received %s bytes of data.', buffer.length)

    var buff = new Buffer(buffer, 'utf8')

    var hex = buffer.toString ("hex")

    console.log('|%s|', hex)

    var data = buffer.toString();

    if (data.indexOf('\r\n') > -1) {
        var lines = data.split('\r\n');
        var i = lines.length;
        while (i--) {
          msg = msg + lines[i]
            console.log(lines[i]);
        }
    } else {
        console.log('>>data:', data);
    }

    var message = new Message()
    
    var result = parser(hex)
   
    message = result

    var reply = replyMessage(message)

    console.log("reply %s", reply)

    var promise = message.save(function (err) {
      if (err) console.log(err)
       else console.log('salvo no banco')
    })

    socket.write("pong!")
  })

  socket.once("close", function() {
    console.log("Connection from %s closed", remoteAddress)
  })

  socket.on("error", function() {
    console.log("Connection %s error", remoteAddress)
  })

})

//server.listen(52275, function () {
server.listen(4884, function () {
  console.log('server listening to %j ', server.address())
})
