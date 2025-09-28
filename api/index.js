/**
 * Main server entry point
 */
const express = require("express");
require("dotenv").config();
const cors = require("cors");

const { connectDB } = require("./config/database");
const routes = require("./routes/routes.js");
const authMiddleware = require("./middlewares/auth"); 

const app = express();

/**
 * Middleware configuration
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route (always first, no DB dependency)
app.get("/api/v1/health", (req, res) => {
  console.log("Health check accessed at:", new Date().toISOString()); 
  res.status(200).json({
    status: "OK",
    message: "Server is alive and ready",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

/**
 * CORS configuration
 */
const allowedOrigins = [
  process.env.FRONTEND_URL,  // https://client-theta-bay.vercel.app
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {   
    const originBase = origin ? new URL(origin).origin : null;

    if (!originBase || allowedOrigins.includes(originBase)) {
      callback(null, true);
    } else {
      console.warn("CORS blocked origin:", originBase);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

/**
 * Start the server only if this file is run directly
 */
if (require.main === module) {
  const startServer = async () => {
    const PORT = process.env.PORT || 3000;

    try {
      // Wait for DB connection before mounting routes
      await connectDB();  // Await: Blocks until success or exit(1)

      // Mount routes only after DB is connected
      app.use("/api/v1", routes);  

      // Start server
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT} (accessible via Render URL)`);
        console.log("✅ Full server ready: DB connected and routes mounted");
        console.log("🌐 Frontend URL:", process.env.FRONTEND_URL || "https://client-theta-bay.vercel.app");
      });
    } catch (error) {
      console.error("❌ Failed to start server:", error);
      process.exit(1);
    }
  };

  startServer();
}

/**
 * Export the app instance (for testing)
 */
module.exports = app;
