// Load dependencies and environment variables
const mongoose = require("mongoose");
require("dotenv").config();

/**
 * Establish a connection to the MongoDB database.
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,   // Explicitly parse connection strings 
      useUnifiedTopology: true // Use new server discovery engine 
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

/**
 * Disconnect from the MongoDB database.                        
 */
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error.message);
  }
};

/**
 * Export connection helpers
 */
module.exports = { connectDB, disconnectDB };
