const express = require('express');
const { recordSale } = require('../controllers/salesController');
const router = express.Router();

// Record a sale
router.post('/record', recordSale);

module.exports = router;
