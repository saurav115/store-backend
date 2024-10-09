const express = require('express');
const { getAllStoresController, getStoreByIdController } = require('../controllers/storeController');
const router = express.Router();

// Get all stores
router.get('/', getAllStoresController);

// Get a store by ID
router.get('/:storeId', getStoreByIdController);

module.exports = router;
 