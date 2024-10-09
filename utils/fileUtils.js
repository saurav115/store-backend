const fs = require('fs-extra');

// Generic function to read from a JSON file
const readJSONFile = async (filePath) => {
  try {
    const data = await fs.readJSON(filePath);
    return data;
  } catch (error) {
    throw new Error(`Error reading file: ${error.message}`);
  }
};

// Generic function to write to a JSON file
const writeJSONFile = async (filePath, data) => {
  try {
    await fs.writeJSON(filePath, data, { spaces: 2 });
  } catch (error) {
    throw new Error(`Error writing file: ${error.message}`);
  }
};

module.exports = { readJSONFile, writeJSONFile };
