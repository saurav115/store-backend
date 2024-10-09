const { parseCSV, getProducts, updateProduct, getAllCategories } = require('../services/productService');

// Handle CSV uploads
const uploadPricingFeed = async (req, res) => {
    try {
        console.log('Processing CSV file upload...');
        console.warn("req", req?.file);
        await parseCSV(req.file);
        console.log('CSV file processed successfully');
        res.status(200).json({ message: 'CSV file processed successfully' });
    } catch (error) {
        console.error('Error processing CSV file:', error);
        res.status(500).json({ message: 'Error processing CSV', error });
    }
};

const searchProducts = async (req, res) => {
    let { query, storeId, page = 1, limit = 10, category, minPrice = 0, maxPrice = Infinity } = req.query; // Default page = 1, limit = 10
    try {
        console.log(`Searching products with query: ${query}, ${page}, ${limit}`);
        if(!page) page = 1;
        if(!limit) limit = 10;
        if(!minPrice) minPrice = 0;
        if(!maxPrice) maxPrice = Infinity;
        
        // Fetch all products that match the query and storeId
        const products = await getProducts(query, storeId, category, minPrice, maxPrice);

        // Pagination logic: Calculate the start and end index
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        // Slice the products array based on pagination
        const paginatedProducts = products.slice(startIndex, endIndex);

        // Response with total count and paginated results
        res.status(200).json({
            total: products.length,        // Total number of matched products
            page: parseInt(page),          // Current page
            limit: parseInt(limit),        // Number of products per page
            results: paginatedProducts     // Paginated product data
        });
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ message: 'Error searching products', error });
    }
};


// Edit Product
const editProduct = async (req, res) => {
    const { productId } = req.params;
    const updatedData = req.body;
    try {
        console.log(`Editing product with ID: ${productId}`);
        await updateProduct(productId, updatedData);
        console.log('Product updated successfully');
        res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error(`Error updating product with ID: ${productId}`, error);
        res.status(500).json({ message: 'Error updating product', error });
    }
};

const getCategories = async (req, res) => {
    try {        
        const categories = await getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        console.error(`Error fetching product categories`, error);
        res.status(500).json({ message: 'Error fetching product categories', error });
    }
};

module.exports = { uploadPricingFeed, searchProducts, editProduct, getCategories };
