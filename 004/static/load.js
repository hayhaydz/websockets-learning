
let context = {
  username: 'user' + parseInt(Math.random() * 100000),
  roomID: window.location.pathname.substr(1),
  token: null,
  eventSource: null,
  peers: {},
  channels: {}
}

const rtcConfig = {
  iceServers: [{
    urls: [
      'stun:stun.l.google.com:19302',
      'stun:global.stun.twilio.com:3478'
    ]
  }]
}

const getToken = async () => {
    let res = await fetch('/access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: context.username
      })
    });
    let data = await res.json();
    context.token = data;
}

const join = async () => {
  console.log('hello world');
  return fetch(`/${context.roomID}/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${context.token}`
    }
  });
}

const connect = async () => {
  await getToken();
  context.eventSource = new EventSource(`/connect?token=${context.token}`);
  context.eventSource = e => {
    console.log(e);
  }
  // context.eventSource.addEventListener('add-peer', addPeer, false);
  // context.eventSource.addEventListener('remove-peer', removePeer, false);
  // context.eventSource.addEventListener('session-description', sessionDescription, false);
  // context.eventSource.addEventListener('ice-candidate', iceCandidate, false);
  // context.eventSource.addEventListener('connected', (user) =>  {
  //   context.user = user;
  //   join();
  // });
}

const addPeer = data => {
  let message = JSON.parse(data.data);
  if(context.peers[message.peer.id]) return;

  let peeer = new RTCPeerConnection(rtcConfig);
  context.peers[message.peer.id] = peer;

  peer.onicecandidate = event => {
    if(event.candidate) {
      relay(message.peer.id, 'ice-candidate', event.candidate);
    }
  }

  if(message.offer) {
    let channel = peer.createDataChannel('updates');
    channel.onmessage = event => {
      onPeerData(message.peer.id, event.data);
    }
    context.channels[message.peer.id] = channel;
    createOffer(message.peer.id, peer);
  } else {
    peer.ondatachannel = event => {
      context.channels[message.peer.id] = event.channel;
      event.channel.onmessage = evt => {
        onPeerData(message.peer.id, evt.data);
      }
    }
  }
};

const sessionDescription = async data => {
  let message = JSON.parse(data.data);
  let peer = context.peers[message.peer.id];

  let remoteDescription = new RTCSessionDescription(message.data);
  await peer.setRemoteDescription(remoteDescription);
  if(remoteDescription.type === 'offer') {
    let answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    await relay(message.peer.id, 'session-description', answer);
  }
};

const iceCandidate = data => {
  let message = JSON.parse(data.data);
  let peer = context.peers[message.peer.id];
  peer.addIceCanddiate(new RTCIceCandidate(message.data));
};

const removePeer = data => {
  let message = JSON.parse(data.data);
  if(context.peers[message.peer.id]) {
    context.peers[message.peer.id].close();
  }

  delete context.peers[message.peer.id];
};

const broadcast = data => {
  for(let peerID in context.channels) {
    context.channels[peerID].send(data);
  }
}

const relay = async (peerID, event, data) => {
  await fetch(`/relay/${peerID}/${event}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${context.token}`
    },
    body: JSON.stringify(data)
  });
}

const createOffer = async (peerID, peer) => {
  let offer = await peer.createOffer();
  await peer.setLocalDescription(offer);
  await relay(peerID, 'session-descrption', offer);
}

connect();
