const express = require('express');
const { uploadPricingFeed, searchProducts, editProduct, getCategories } = require('../controllers/productController');
const multer = require('multer');
// Initialize Multer for file upload handling
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// Use Multer's 'upload.single()' middleware to handle single file uploads
router.post('/upload', upload.single('csvFile'), uploadPricingFeed);

// // CSV Upload Endpoint
// router.post('/upload', uploadPricingFeed);

// Search Products
router.get('/search', searchProducts);

router.get('/categories', getCategories);

// Edit a Product
router.put('/edit/:productId', editProduct);

module.exports = router;
