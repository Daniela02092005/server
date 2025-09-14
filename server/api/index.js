//importamos express configuremos a dotenv e inializamos a app, cors
const express = require("express");
require("dotenv").config();
const cors = require("cors");

// Importamos a connectDB
const { connectDB } = require("./config/database");
// Importamos el router principal en index.js
const routes = require("./routes/routes.js");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de CORS
const allowedOrigins = [
  process.env.FRONTEND_URL || "https://code-nova-project.vercel.app",
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
connectDB();

// Rutas
app.use("/api/v1", routes);

// Ruta básica
app.get("/", (req, res) => res.send("Server is running"));

// Start server
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
module.exports = app;

