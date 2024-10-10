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


// Generate Sales Analysis Report
const generateSalesReport = async ({ startDate, endDate, storeId, timeFrame = 'daily' }) => {
  const salesData = await readJSONFile(SALES_FILE);

  // Filter sales by date range and store
  const filteredSales = salesData.filter(sale => {
      const saleDate = new Date(sale.saleDate);
      const isWithinRange = (!startDate || saleDate >= new Date(startDate)) &&
                            (!endDate || saleDate <= new Date(endDate));
      const matchesStore = !storeId || sale.storeId === storeId;
      return isWithinRange && matchesStore;
  });

  // Group sales data based on the time frame
  const groupByTimeFrame = (date) => {
      const d = new Date(date);
      if (timeFrame === 'weekly') {
          const startOfWeek = new Date(d.setDate(d.getDate() - d.getDay()));
          return startOfWeek.toISOString().split('T')[0];
      } else if (timeFrame === 'monthly') {
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      }
      // Default is daily
      return d.toISOString().split('T')[0];
  };

  // Aggregate sales data by time frame
  const salesReport = filteredSales.reduce((report, sale) => {
      const timeKey = groupByTimeFrame(sale.saleDate);

      if (!report[timeKey]) {
          report[timeKey] = {
              timeFrame: timeKey,
              totalUnitsSold: 0,
              totalRevenue: 0
          };
      }

      // Update sales data
      report[timeKey].totalUnitsSold += sale.quantity;
      report[timeKey].totalRevenue += sale.totalPrice;
      return report;
  }, {});

  // Convert the aggregated sales report into an array
  return Object.values(salesReport);
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
