/**
 * Main server entry point
 */
const express = require("express");
require("dotenv").config();
const cors = require("cors");

const { connectDB } = require("./config/database");
const routes = require("./routes/routes.js");
const authMiddleware = require("./middlewares/auth"); // Importar el middleware de auth

const app = express();

/**
 * Middleware configuration
 * Configuración de middlewares
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// RUTA DE HEALTH CHECK: SIEMPRE PRIMERO (no depende de DB, para warm-ups y monitoreo)
app.get("/api/v1/health", (req, res) => {
  console.log("Health check accessed at:", new Date().toISOString()); // Log para Render
  res.status(200).json({
    status: "OK",
    message: "Server is alive and ready (DB connection pending if first start)",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

/**
 * CORS configuration
 * Configuración de CORS
 */
const allowedOrigins = [
  process.env.FRONTEND_URL,  // https://client-theta-bay.vercel.app
].filter(Boolean); // Filtrar valores undefined/null para producción limpia

const corsOptions = {
  origin: function (origin, callback) {   
    const originBase = origin ? new URL(origin).origin : null;
    console.log("🔍 Incoming origin:", originBase || "No origin"); // Log temporal para debug

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
 * Iniciar el servidor solo si este archivo se ejecuta directamente
 */
if (require.main === module) {
  const startServer = async () => {
    const PORT = process.env.PORT || 3000;

    try {
      // ESPERAR CONEXIÓN A DB ANTES DE RUTAS Y LISTEN
      await connectDB();  // Ahora await: Bloquea hasta éxito o exit(1)

      // UNA VEZ CONECTADA LA DB, REGISTRAR RUTAS DEPENDIENTES
      app.use("/api/v1", routes);  // MOVIDO AQUÍ: Solo si DB OK

      // ✅ AGREGAR: Log para verificar rutas cargadas (DESPUÉS de routes)
      console.log("📋 =========================================");
      console.log("📋 RUTAS REGISTRADAS EN EL SISTEMA:");
      console.log("📋 =========================================");
      console.log("🔐 AUTH ROUTES:");
      console.log("   POST /api/v1/auth/register");
      console.log("   POST /api/v1/auth/login");
      console.log("   POST /api/v1/auth/logout");
      console.log("   POST /api/v1/auth/recover");
      console.log("   POST /api/v1/auth/reset-password");
      console.log("");
      console.log("👤 USER ROUTES:");
      console.log("   GET  /api/v1/users/profile");
      console.log("   PUT  /api/v1/users/profile");
      console.log("");
      console.log("📝 TASK ROUTES:");
      console.log("   GET    /api/v1/tasks");
      console.log("   POST   /api/v1/tasks");
      console.log("   GET    /api/v1/tasks/:id");
      console.log("   PUT    /api/v1/tasks/:id");
      console.log("   DELETE /api/v1/tasks/:id");
      console.log("📋 =========================================");

      // ✅ RUTA TEMPORAL PARA DEBUGGING - Verificar que el servidor responde
      app.get("/api/v1/debug/routes", (req, res) => {
        console.log("🔍 Debug route accessed - Verifying server responsiveness");
        res.json({
          success: true,
          message: "Debug route is working correctly",
          serverTime: new Date().toISOString(),
          availableRoutes: {
            auth: [
              "POST /api/v1/auth/register",
              "POST /api/v1/auth/login",
              "POST /api/v1/auth/recover",
              "POST /api/v1/auth/reset-password"
            ],
            users: [
              "GET /api/v1/users/profile",
              "PUT /api/v1/users/profile"
            ],
            tasks: [
              "GET /api/v1/tasks",
              "POST /api/v1/tasks",
              "GET /api/v1/tasks/:id",
              "PUT /api/v1/tasks/:id",
              "DELETE /api/v1/tasks/:id"
            ]
          }
        });
      });

      // ✅ RUTA TEMPORAL PARA VERIFICAR LA RUTA DE PERFIL SIN AUTENTICACIÓN
      app.get("/api/v1/debug/profile-route", (req, res) => {
        console.log("🔍 Profile route debug accessed");
        res.json({
          success: true,
          message: "Profile route exists but requires authentication",
          instruction: "Use GET /api/v1/users/profile with Bearer token",
          requiredHeaders: {
            "Authorization": "Bearer <your-jwt-token>"
          }
        });
      });

      // Health check en raíz (opcional, después de DB para full status)
      app.get("/", (req, res) => {
        res.json({
          message: "Server is running with DB connected / Servidor en ejecución con DB conectada",
          dbStatus: "Connected",
          timestamp: new Date().toISOString(),
          routes: {
            debug: [
              "GET /api/v1/debug/routes",
              "GET /api/v1/debug/profile-route"
            ],
            users: [
              "GET /api/v1/users/profile",
              "PUT /api/v1/users/profile"
            ]
          }
        });
      });

      // INICIAR SERVIDOR SOLO SI TODO OK
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT} (accessible via Render URL)`);
        console.log("✅ Full server ready: DB connected and routes mounted");
        console.log("🌐 Frontend URL:", process.env.FRONTEND_URL || "https://client-theta-bay.vercel.app");
        console.log("🔧 Debug routes available:");
        console.log("   - GET /api/v1/debug/routes");
        console.log("   - GET /api/v1/debug/profile-route");
      });
    } catch (error) {
      console.error("❌ Failed to start server:", error);
      process.exit(1);
    }
  };

  startServer();
}

/**
 * Export the app instance (para testing, sin DB wait)
 */
module.exports = app;
