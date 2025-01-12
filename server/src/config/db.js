// Temporary in-memory storage for testing
const inMemoryDB = {
  rigs: new Map(),
  alerts: new Map(),
};

const connectDB = async () => {
  try {
    console.log('Using in-memory database for testing');
    return inMemoryDB;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
module.exports.db = inMemoryDB;