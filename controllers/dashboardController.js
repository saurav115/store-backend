const { generateInventoryReport, generateSalesReport, generateWeeklySalesReport } = require('../services/dashboardService');

// Inventory Monitoring
const getInventoryReport = async (req, res) => {
  try {
    console.log('Generating inventory report...');
    const report = await generateInventoryReport();
    console.log('Inventory report generated successfully', report);
    res.status(200).json(report);
  } catch (error) {
    console.error('Error generating inventory report:', error);
    res.status(500).json({ message: 'Error generating inventory report', error });
  }
};

// Sales Monitoring
const getSalesReport = async (req, res) => {
  const { startDate, endDate, storeId, timeFrame } = req.query;
  try {
    console.log(`Generating sales report from ${startDate} to ${endDate}, for productId: ${productId}, storeId: ${storeId}, timeFrame: ${timeFrame}...`);
    const report = await generateSalesReport({ startDate, endDate, storeId, timeFrame });
    console.log('Sales report generated successfully');
    res.status(200).json(report);
  } catch (error) {
    console.error('Error generating sales report:', error);
    res.status(500).json({ message: 'Error generating sales report', error });
  }
};

// Weekly Sales Monitoring
const getWeeklySalesReport = async (req, res) => {
  try {
    console.log('Generating weekly sales report...');
    const report = await generateWeeklySalesReport();
    console.log('Weekly sales report generated successfully');
    res.status(200).json(report);
  } catch (error) {
    console.error('Error generating weekly sales report:', error);
    res.status(500).json({ message: 'Error generating weekly sales report', error });
  }
};

module.exports = { getInventoryReport, getSalesReport, getWeeklySalesReport };
