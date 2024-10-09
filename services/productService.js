const { readJSONFile, writeJSONFile } = require('../utils/fileUtils');
const csv = require('csv-parser');
const fs = require('fs-extra');
const PRODUCTS_FILE = './data/products.json';

const mapToCSVPropNames = (updatedData) => ({
    "Product Name": updatedData.productName,
    "SKU": updatedData.sku,
    "Price": updatedData.price,
    "Store ID": updatedData.storeId,
    "Product Category": updatedData.productCategory || 'Others' // Default to "Others" if missing
  });

// Normalize product keys from the CSV for consistent access
const normalizeProductKeys = (product) => ({
    storeId: product['Store ID'],
    sku: product['SKU'],
    prodId: product['Prod ID'],
    productName: product['Product Name'],
    price: product['Price'],
    date: product['Date'] || new Date().toISOString().split('T')[0], // Use current date if missing
    productCategory: product['Product Category'] || 'Others', // Use "Others" if Product Category is missing
});

// Parse CSV file and update product data
const parseCSV = (file) => {
    return new Promise((resolve, reject) => {
        console.log('Parsing CSV file...');
        const results = [];
        fs.createReadStream(file.path)
            .pipe(csv())
            .on('data', (data) => {
                // Skip products that are missing required fields
                if (!data['Store ID'] || !data['SKU'] || !data['Prod ID'] || !data['Product Name'] || !data['Price']) {
                    console.warn('Missing required fields in product:', data);
                    return; // Skip this product
                }

                // Set default values if needed
                data['Date'] = data['Date'] || new Date().toISOString().split('T')[0]; // Use current date if missing
                data['Product Category'] = data['Product Category'] || 'Others'; // Use "Others" if Product Category is missing

                results.push(data);
            })
            .on('end', async () => {
                try {
                    console.log('Finished reading CSV file. Saving data...');
                    const products = await readJSONFile(PRODUCTS_FILE);

                    // Iterate over the CSV data and update or insert products
                    results.forEach((csvProduct) => {
                        const existingProductIndex = products.findIndex(product => product['SKU'] === csvProduct['SKU']);
                        if (existingProductIndex !== -1) {
                            // Update the existing product
                            console.log(`Updating product with SKU: ${csvProduct['SKU']}`);
                            products[existingProductIndex] = {
                                ...products[existingProductIndex],
                                ...csvProduct, // Overwrite with new data from CSV
                            };
                        } else {
                            // Add the new product if it doesn't exist
                            console.log(`Adding new product with SKU: ${csvProduct['SKU']}`);
                            products.push(csvProduct);
                        }
                    });

                    // Write the updated product list back to the JSON file
                    await writeJSONFile(PRODUCTS_FILE, products);
                    console.log('Product data saved successfully.');
                    resolve();
                } catch (error) {
                    console.error('Error saving product data:', error);
                    reject(error);
                }
            })
            .on('error', (error) => {
                console.error('Error reading CSV file:', error);
                reject(error);
            });
    });
};

// Search products (with the original casing)
const getProducts = async (query, storeId, category, minPrice = 0, maxPrice = Infinity) => {
    const products = await readJSONFile(PRODUCTS_FILE);

    // Convert comma-separated storeId and category strings to arrays
    const storeIds = storeId ? storeId.split(',') : [];
    const categories = category ? category.split(',') : [];

    // Filter by store IDs, product category, product name (case-insensitive), and price range
    const filteredProducts = products
        // Filter by multiple store IDs (OR condition)
        .filter(product => (storeIds.length > 0 ? storeIds.includes(product['Store ID'].toString()) : true))
        
        // Filter by product name (case-insensitive)
        .filter(product => product['Product Name']?.toLowerCase().includes(query.toLowerCase()))
        
        // Filter by multiple categories (OR condition)
        .filter(product => (categories.length > 0 ? categories.includes(product['Product Category']) : true))
        
        // Filter by price range
        .filter(product => Number(product['Price']) >= Number(minPrice) && Number(product['Price']) <= Number(maxPrice));

    return filteredProducts;
};

// Get all categories (with the original casing)
const getAllCategories = async (req, res) => {
    const products = await readJSONFile(PRODUCTS_FILE);
    const categories = [...new Set(products.map(product => product['Product Category']))];
    return categories;
};

const updateProduct = async (productId, updatedData) => {
    const products = await readJSONFile(PRODUCTS_FILE);
    const productIndex = products.findIndex(product => product['Prod ID'] === productId);
    console.log("productIndex", productIndex, updatedData);

    if (productIndex !== -1) {
        // Map the updatedData fields to the CSV-style property names
        const mappedData = mapToCSVPropNames(updatedData);
        console.log('products[productIndex] before ', products[productIndex]);
        // Merge the mapped data with the existing product
        products[productIndex] = { ...products[productIndex], ...mappedData };

        console.log('products[productIndex]', products[productIndex]);

        // Write the updated products array back to the JSON file
        await writeJSONFile(PRODUCTS_FILE, products);
    }
};

module.exports = { parseCSV, getProducts, updateProduct, getAllCategories };
