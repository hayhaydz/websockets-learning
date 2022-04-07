const uuid = require('uuid');

const disconnected = (res, client) => {
  delete res.app.locals.clients[client.id];
  for(let roomID in res.app.locals.channels) {
    let channel = res.app.locals.channels[roomID];
    if(channel[client.id]) {
      for(let peerID in channel) {
        channel[peerID].emit('remove-peer', { peer: client.user, roomID });
      }
      delete channel[client.id];
    }
    if(Object.keys(channel).length === 0) {
      delete res.app.locals.channels[roomID];
    }
  }
}

exports.connect = (req, res) => {
  if(req.headers.accept !== 'text/event-stream') {
    return res.sendStatus(404);
  }

  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  let client = {
   id: uuid.v4(),
   emit: (res, event, data) => {
     res.write(`id: ${uuid.v4()}`);
     res.write(`event: ${event}`);
     res.write(`data: ${JSON.stringify(data)}\n\n`);
   }
  }

  res.app.locals.clients[client.id] = client;
  client.emit(res, 'connected', { user: req.user });

  req.on('close', () => {
   disconnected(res, client);
  });
}
