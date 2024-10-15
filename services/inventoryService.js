const { readJSONFile, writeJSONFile } = require('../utils/fileUtils');
const INVENTORY_FILE = './data/inventory.json';

const updateInventoryAfterSale = async (productId, quantitySold) => {

    const inventoryData = await readJSONFile(INVENTORY_FILE);
    const productIndex = inventoryData.findIndex(item => item.productId === productId);

    if (productIndex === -1) {
        throw new Error(`Product with ID ${productId} not found in inventory`);
    }
    const product = inventoryData[productIndex];
    product.currentStock -= quantitySold;

    product.lastUpdated = new Date().toISOString();
    inventoryData[productIndex] = product;
    await writeJSONFile(INVENTORY_FILE, inventoryData);

};

module.exports = { updateInventoryAfterSale };
