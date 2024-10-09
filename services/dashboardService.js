const { readJSONFile } = require('../utils/fileUtils');
const PRODUCTS_FILE = './data/products.json';
const SALES_FILE = './data/sales.json';
const INVENTORY_FILE = './data/inventory.json';
// Generate Inventory Monitoring Report
const generateInventoryReport = async () => {
  const inventoryData = await readJSONFile(INVENTORY_FILE);
  const productsData = await readJSONFile(PRODUCTS_FILE);

  // Create a summary of stock levels
  const inventoryReport = productsData.map((product) => {
      const inventoryItem = inventoryData.find(item => item.productId === product["Prod ID"]);
      return {
          productId: product["Prod ID"],
          productName: product["Product Name"],
          storeId: product["Store ID"],
          currentStock: inventoryItem ? inventoryItem.currentStock : 0,
          lastUpdated: inventoryItem ? inventoryItem.date : 'N/A',
          category: product["Product Category"]
      };
  });

  return inventoryReport;
};

// Updated Generate Sales Analysis Report
const generateSalesReport = async (startDate, endDate) => {
  const salesData = await readJSONFile(SALES_FILE);
  const productsData = await readJSONFile(PRODUCTS_FILE);

  // Filter sales by the date range (if provided)
  const filteredSales = salesData.filter(sale => {
      const saleDate = new Date(sale.saleDate);
      return (!startDate || saleDate >= new Date(startDate)) && (!endDate || saleDate <= new Date(endDate));
  });

  // Group sales by date and product, then calculate total sales
  const salesReport = filteredSales.reduce((report, sale) => {
      const product = productsData.find(p => p["Prod ID"] === sale.productId);
      const dateKey = sale.saleDate; // Group by sale date
      if (!report[dateKey]) {
          report[dateKey] = [];
      }

      // Find the product entry in the date group
      let productEntry = report[dateKey].find(entry => entry.productId === sale.productId);
      if (!productEntry) {
          productEntry = {
              productId: sale.productId,
              productName: product ? product["Product Name"] : 'Unknown',
              category: product ? product["Product Category"] : 'Unknown',
              saleDate: sale.saleDate,
              totalUnitsSold: 0,
              totalRevenue: 0
          };
          report[dateKey].push(productEntry);
      }

      // Update sales data for the product
      productEntry.totalUnitsSold += sale.quantity;
      productEntry.totalRevenue += sale.totalPrice;
      return report;
  }, {});

  // Flatten the results to an array
  return Object.keys(salesReport).flatMap(date => salesReport[date]);
};


// Generate Weekly Sales Unit Monitoring Report
const generateWeeklySalesReport = async () => {
  const salesData = await readJSONFile(SALES_FILE);
  const productsData = await readJSONFile(PRODUCTS_FILE);
  const currentDate = new Date();

  // Filter sales from the past week
  const oneWeekAgo = new Date(currentDate.setDate(currentDate.getDate() - 7));
  const weeklySales = salesData.filter(sale => new Date(sale.saleDate) >= oneWeekAgo);

  // Group sales by product and calculate total units sold
  const weeklySalesReport = weeklySales.reduce((report, sale) => {
      const product = productsData.find(p => p["Prod ID"] === sale.productId);
      if (!report[sale.productId]) {
          report[sale.productId] = {
              productId: sale.productId,
              productName: product ? product["Product Name"] : 'Unknown',
              category: product ? product["Product Category"] : 'Unknown',
              totalUnitsSold: 0
          };
      }
      report[sale.productId].totalUnitsSold += sale.quantity;
      return report;
  }, {});

  return Object.values(weeklySalesReport);
};


module.exports = {
  generateInventoryReport,
  generateSalesReport,
  generateWeeklySalesReport
};
