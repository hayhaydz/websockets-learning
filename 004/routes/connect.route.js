const express = require('express');
const router = express.Router();
const { connect } = require('../controllers/connect.controller.js');

router.get('/', connect);

module.exports = router;
