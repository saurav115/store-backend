const { getAllStores, getStoreById } = require('../services/storeService');

// Get all stores
const getAllStoresController = async (req, res) => {
  try {
    const stores = await getAllStores();
    res.status(200).json(stores);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching store data', error });
  }
};

// Get a specific store by its ID
const getStoreByIdController = async (req, res) => {
  const { storeId } = req.params;
  try {
    const store = await getStoreById(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.status(200).json(store);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching store data', error });
  }
};

module.exports = { getAllStoresController, getStoreByIdController };
