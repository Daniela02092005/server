// Load dependencies and environment variables
// Cargar dependencias y variables de entorno
const mongoose = require("mongoose");
require("dotenv").config();

/**
 * Establish a connection to the MongoDB database.
 * Establecer conexión a la base de datos MongoDB.
 *
 * Uses the connection string provided in the environment variable `MONGO_URI`.
 * Utiliza la cadena de conexión en la variable de entorno `MONGO_URI`.
 *
 * On success: logs confirmation.
 * En éxito: muestra mensaje de confirmación.
 *
 * On failure: logs the error and terminates the process.
 * En fallo: muestra error y termina el proceso.
 *
 * @async
 * @function connectDB
 * @returns {Promise<void>} Resolves when the connection is established.
 *                          Se resuelve cuando la conexión es establecida.
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,   // Explicitly parse connection strings / Analizar cadena de conexión explícitamente
      useUnifiedTopology: true // Use new server discovery engine / Usar nuevo motor de descubrimiento
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

/**
 * Disconnect from the MongoDB database.
 * Desconectar de la base de datos MongoDB.
 *
 * Gracefully closes the active connection and logs the result.
 * Cierra la conexión activa y muestra el resultado.
 *
 * @async
 * @function disconnectDB
 * @returns {Promise<void>} Resolves when the connection is closed.
 *                          Se resuelve cuando la conexión se cierra.
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
 * Exportar funciones de conexión
 */
module.exports = { connectDB, disconnectDB };
