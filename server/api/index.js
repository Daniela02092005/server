//importamos express configuremos a dotenv e inializamos a app, cors
// Import express, configure dotenv, initialize app, and enable CORS
const express = require("express");
require("dotenv").config();
const cors = require("cors");

// Importamos a connectDB
// Import MongoDB connection function
const { connectDB } = require("./config/database");
// Importamos el router principal en index.js
// Import main router from routes/index.js
const routes = require("./routes/routes.js");

const app = express();

// Middlewares
// Middlewares to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de CORS
// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || "https://client-theta-bay.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

// Conexión a MongoDB
// Connect to MongoDB
connectDB();

// Rutas
// API routes
app.use("/api/v1", routes);

// Ruta básica
// Basic route to confirm server is running
app.get("/", (req, res) => res.send("Server is running"));

// Start server only if this file is executed directly
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

/* `module.exports = app;` is exporting the `app` object so that it can be imported and used in other
files. This allows other modules to access and use the `app` object created in this file, typically
for setting up routes, middleware, and other configurations defined in this script. */
module.exports = app;

// Establishes a connection to the MongoDB database using the configuration 
// defined in ./config/database. This is necessary for handling data persistence 
// such as users, products, or any other collections used by the application.


