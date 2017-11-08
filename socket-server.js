const net = require('net')
var mongoose = require('mongoose')
var Handler = require('./handler')
var server = net.createServer()

var port = process.env.PORT || 4883

mongoose.Promise = global.Promise;

//mongoose.connect('mongodb://dbuser:123mudar#@ds139428.mlab.com:39428/driveondb', { useMongoClient: true })

mongoose.connect('mongodb://127.0.0.1:27017/driveondb', { useMongoClient: true })

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

  socket.setKeepAlive(true, 60 * 1000) 

  var remoteAddress = socket.remoteAddress

  console.log('>>> Start Dongle %s', remoteAddress)
  
  socket.on("data", function(buffer) {
    //console.log(' | New Message/ %s ', remoteAddress)
  
    var handler = Handler.handler(socket, buffer)

  })

  socket.once("close", function() {
    console.log("<<< Stop Dongle %s", remoteAddress)
  })

  socket.on("error", function() {
    console.log("Connection %s error", remoteAddress)
  })
})

server.listen(port, function () {
  console.log('server listening to %s ', server.address())
})
