const http = require('http');
const WebSocket = require('ws');

const server = http.createServer();
const WebSocketServer = new WebSocket.Server({ server });

let clients = [];

WebSocketServer.on('connection', ws => {
  console.log('New connection');
  clients.push(ws);

  ws.on('message', (data, isBinary) => {
    const message = isBinary ? data : data.toString();
    clients.forEach(client => {
      if(client !== ws) {
        client.send(message);
      }
    })
  });

  ws.on('close', () => {
    clients = clients.filter(client => client !== ws);
  });
});

server.listen(1234);
