const { readJSONFile } = require('../utils/fileUtils');
const STORES_FILE = './data/stores.json';

// Fetch all stores
const getAllStores = async () => {
  const stores = await readJSONFile(STORES_FILE);
  return stores;
};

// Fetch a store by ID
const getStoreById = async (storeId) => {
  const stores = await readJSONFile(STORES_FILE);
  return stores.find(store => store.storeId === storeId);
};

module.exports = { getAllStores, getStoreById };
