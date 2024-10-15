const { updateInventoryAfterSale } = require('../services/inventoryService');
const { recordNewSale } = require('../services/salesService');

// Record Sale
const recordSale = async (req, res) => {
  const saleData = req.body;
  try {
    console.log('Recording a new sale:', saleData);
    await recordNewSale(saleData);
    console.log('Sale recorded successfully');
    await updateInventoryAfterSale(saleData.productId, saleData.quantity);
    res.status(200).json({ message: 'Sale recorded successfully' });
  } catch (error) {
    console.error('Error recording sale:', error);
    res.status(500).json({ message: 'Error recording sale', error });
  }
};

module.exports = { recordSale };
