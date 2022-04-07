const express = require('express');
const HTTP = require('http');
const path = require('path');

const { authRoute, connectRoute, roomRoute, relayRoute  } = require('./routes');
const { auth } = require('./controllers/auth.controller.js');

const app = express();
app.use(express.json());
app.use('/static', express.static(`${__dirname}/static`));

const server = HTTP.createServer(app);

app.locals.index = 100000000000;
app.locals.clients = {};
app.locals.channels = {};

app.get('/', (req, res) => {
  let id = (app.locals.index++).toString(36);
  res.redirect(`/${id}`);
});

app.use('/access', authRoute);
app.use('/connect', auth, connectRoute);
app.use('/:roomID', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/index.html'));
});
app.use('/', roomRoute);
app.use('/relay', auth, relayRoute);

server.listen(process.env.PORT || 8081, () => {
  console.log(`Started server on port ${server.address().port}`);
});
