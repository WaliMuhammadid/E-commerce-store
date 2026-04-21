/**
 * In-Memory Database Configuration
 * For demo purposes when MongoDB is not available
 */
const connectDB = async () => {
  console.log(`✅ Using in-memory database for demo`);
  // No actual database connection needed for demo
};

module.exports = connectDB;
