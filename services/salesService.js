const { readJSONFile, writeJSONFile } = require('../utils/fileUtils');
const SALES_FILE = './data/sales.json';

const recordNewSale = async (saleData) => {
  const sales = await readJSONFile(SALES_FILE);
  sales.push(saleData);
  await writeJSONFile(SALES_FILE, sales);
};

module.exports = { recordNewSale };
