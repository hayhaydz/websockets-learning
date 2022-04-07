const express = require('express');
const router = express.Router();
const { event } = require('../controllers/relay.controller.js');

router.post('/:peerID/:event', event);

module.exports = router;
