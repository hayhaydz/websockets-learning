const wsConnection = new WebSocket('ws:127.0.0.1:8081');

let localID, peerIDs;
let peerConnections = {};
let initiator = false;

wsConnection.onopen = e => {
  console.log(`wsConnection open to 127.0.0.1:8081`, e);
}

wsConnection.onerror = e => {
  console.error(`wsConnection error`, e);
}

wsConnection.onmessage = e => {
  let data = JSON.parse(e.data);
  switch(data.type) {
    case 'connection':
      localID = data.id;
      break;
    case 'ids':
      peerIDs = data.ids;
      connect();
      break;
    case 'signal':
      signal(data.id, data.data);
      break;
  }
}

const broadcast = data => {
  Object.values(peerConnections).forEach(peer => {
    try {
      peer.send(data);
    } catch (e) {
      console.error(e);
    }

  })
}

const signal = (id, data) => {
  if(peerConnections[id]) {
    peerConnections[id].signal(data);
  }
}

const connect = () => {
  Object.keys(peerConnections).forEach(id => {
    if(!peerIDs.includes(id)) {
      peerConnections[id].destroy();
      delete peerConnections[id];
    }
  });

  if(peerIDs.length === 1) {
    initiator = true;
  }

  peerIDs.forEach(id => {
    if(id === localID || peerConnections[id]) return;
    if(peerConnections[id]) return;

    let peer = new SimplePeer({
      initiator: initiator
    });
    peer.on('error', console.error);
    peer.on('signal', data => {
      wsConnection.send(JSON.stringify({ type: 'signal', id: localID, data }));
    });
    peer.on('data', data => onPeerData(id, data));
    peerConnections[id] = peer;
  });
}
