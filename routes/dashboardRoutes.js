const express = require('express');
const { getInventoryReport, getSalesReport } = require('../controllers/dashboardController');
const router = express.Router();

// Inventory Report
router.get('/inventory', getInventoryReport);

// Sales Report
router.get('/sales', getSalesReport);

module.exports = router;
