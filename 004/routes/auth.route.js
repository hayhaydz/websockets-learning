const express = require('express');
const router = express.Router();
const { access } = require('../controllers/auth.controller.js');

router.post('/', access);

module.exports = router;
