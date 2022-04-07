
exports.event = (req, res) => {
  console.log(app.locals.clients);
  console.log(app.locals.channels);
  let peerID = req.params.peerID;
  if(res.app.locals.clients[peerID]) {
    res.app.locals.clients[peerID].emit(req.params.event, { peer: req.user, data: req.body });
  }
  return res.sendStatus(200);
}
