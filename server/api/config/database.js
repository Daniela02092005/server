//cargamos dependencias y variables de entorno
const mongoose = require("mongoose");
require("dotenv").config();

//Creamos dos funciones asincrónicas para conectar y otra para desconectar a la BD
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error.message);
  }
};


module.exports = { connectDB, disconnectDB };
