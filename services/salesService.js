// src/services/salesService.js
const { readJSONFile, writeJSONFile } = require('../utils/fileUtils');
const SALES_FILE = './data/sales.json';

const recordNewSale = async (saleData) => {
  const sales = await readJSONFile(SALES_FILE);
  
  // Generate a new unique saleId
  const maxId = sales.length > 0 ? Math.max(...sales.map(sale => sale.saleId || 0)) : 0;
  const newsaleId = maxId + 1;

  const newSale = { saleId: newsaleId, ...saleData };
  sales.push(newSale);
  
  await writeJSONFile(SALES_FILE, sales);
};

module.exports = { recordNewSale };
