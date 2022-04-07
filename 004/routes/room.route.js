const express = require('express');
const router = express.Router();
const { join } = require('../controllers/room.controller.js');

router.post(':roomID/join', join);

module.exports = router;
