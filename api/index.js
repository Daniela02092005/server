const express = require("express");
require("dotenv").config();
const cors = require("cors");

const { connectDB } = require("./config/database");
const routes = require("./routes/routes.js");

const app = express();

/**
 * Middleware configuration
 * - Parse JSON request bodies
 * - Parse URL-encoded request bodies
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * CORS configuration
 * Allows requests only from trusted origins
 */
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

/**
 * Initialize database connection.
 * Exits the process if the connection fails.
 */
connectDB();

/**
 * Mount the API routes.
 * All feature routes are grouped under `/api/v1`.
 */
app.use("/api/v1", routes);

/**
 * Health check endpoint.
 * Useful to verify that the server is up and running.
 */
app.get("/", (req, res) => res.send("Server is running"));

/**
 * Start the server only if this file is run directly
 * (prevents multiple servers when testing with imports).
 */
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

/**
 * Export the app instance.
 * Useful for testing or importing into other modules.
 */
module.exports = app;
