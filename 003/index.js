const express = require('express');
const HTTP = require('http');
const WS = require('ws');
const uuid = require('uuid');

const app = express();
app.use(express.static(`${__dirname}/static`));
app.locals.connections = [];

const server = HTTP.createServer(app);
const wss = new WS.Server({ server });

const broadcastConnections = () => {
    let ids = app.locals.connections.map(c => c._connID);
    app.locals.connections.forEach(c => {
        c.send(JSON.stringify({ type: 'ids', ids }));
    });
}

wss.on('connection', ws => {
    app.locals.connections.push(ws);
    ws._connID = `conn-${uuid.v4()}`;

    ws.send(JSON.stringify({ type: 'connection', id: ws._connID }));

    broadcastConnections();

    ws.on('close', () => {
      let index = app.locals.connections.indexOf(ws);
      app.locals.connections.splice(index, 1);

      broadcastConnections();
    });

    ws.on('message', (message) => {
      let buffer = Buffer.from(message);
      message = buffer.toString('utf8');
      for(let i = 0; i < app.locals.connections.length; i++) {
        if(app.locals.connections[i] !== ws) {
          app.locals.connections[i].send(message);
        }
      }
    });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/index.html'));
});

server.listen(process.env.PORT || 8081, () => {
  console.log(`Started server on port ${server.address().port}`);
});
