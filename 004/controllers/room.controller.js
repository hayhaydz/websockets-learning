
exports.join = (req, res) => {
  console.log(res.app.locals.clients);
  console.log(res.app.locals.channels);
  let roomID = req.params.roomID;
  if(res.app.locals.channels[roomID] && res.app.locals.channels[roomID][req.user.id]) return res.sendStatus(200);
  if(!res.app.locals.channels[roomID]) res.app.locals.channels[roomID] = {};

  for(let peerID in res.app.locals.channels) {
    if(res.app.locals.clients[peerID] && res.app.locals.clients[req.user.id]) {
      res.app.locals.clients[peerID].emit('add-peer', { peer: req.user, roomID, offer: false });
      res.app.locals.clients[req.user.id].emit('add-peer', { peer: res.app.locals.clients[peerID].user, roomID, offer: true });
    }
  }

  res.app.locals.channels[roomID][req.user.id] = true;
  return res.sendStatus(200);
}
