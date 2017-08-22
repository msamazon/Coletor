const net = require('net')
const mongoose = require('mongoose')
var Message = require('./Model/Message')
require('./parser.js')();

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
  var remoteAddress = socket.remoteAddress
  console.log('>new client connection is made %s', remoteAddress)

  var msg = ''

  socket.on("data", function(buffer) {
    console.log('> Connection data from %s : %s', remoteAddress, buffer)
    console.log('> Received ${buffer.length} bytes of data.')

    var buff = new Buffer(buffer, 'utf8')

    console.log(buff)

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
    } else {vim
        console.log('>>data:', data);
    }
    console.log("message: %s", msg)

    var message = new Message()
    parser = parser('teste')

    console.log('-----------------')
    
    console.log(parser)

    message.msg2json = hex

    var promise = message.save(function (err) {
      if (err) console.log(err)
       else console.log('salvo no banco')
    })
  })

  socket.once("close", function() {
    console.log("Conne:ction from %s closed", remoteAddress)
  })

  socket.on("error", function() {
    console.log("Connection %s error", remoteAddress)
  })

})

//server.listen(52275, function () {
server.listen(4884, function () {
  console.log('server listening to %j ', server.address())
})
