const express = require('express');
const HTTP = require('http');
const { Server } = require('socket.io');

const app = express();
const server = HTTP.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {
  console.log('A user has connected');

  socket.on('chat-message', (msg) => {
    console.log('Message received: ', msg);
    io.emit('chat-message', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  })
})

server.listen(3080, () => {
  console.log('Server started. Listening on port: 3080');
})
