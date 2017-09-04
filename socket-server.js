const net = require('net')
var mongoose = require('mongoose')
var Handler = require('./handler')

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

  socket.on("data", function(buffer) {
    console.log('> Connection data from %s ', remoteAddress)
  
    var handler = Handler.handler(socket, buffer)

  })

  socket.once("close", function() {
    console.log("Connection from %s closed", remoteAddress)
  })

  socket.on("error", function() {
    console.log("Connection %s error", remoteAddress)
  })
})

server.listen(4884, function () {
  console.log('server listening to %j ', server.address())
})
