//cargamos dependencias y variables de entorno
/*The code `const mongoose = require("mongoose"); require("dotenv").config();` is loading the
`mongoose` library and configuring the environment variables using `dotenv`. */
const mongoose = require("mongoose");
require("dotenv").config();

//Creamos dos funciones asincrónicas para conectar y otra para desconectar a la BD
/**
 * The function `connectDB` connects to a MongoDB database using the Mongoose library in JavaScript.
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

/**
 * The `disconnectDB` function asynchronously disconnects from MongoDB and logs a message upon
 * successful disconnection or an error message if there is an error.
 */
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error.message);
  }
};


/* `module.exports = { connectDB, disconnectDB };` is exporting the `connectDB` and `disconnectDB`
functions so that they can be used in other files or modules. This allows other parts of the
codebase to import and utilize these functions for connecting to and disconnecting from a MongoDB
database using Mongoose. */
module.exports = { connectDB, disconnectDB };
