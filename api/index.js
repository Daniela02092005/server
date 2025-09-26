/**
 * Main server entry point
 */
const express = require("express");
require("dotenv").config();
const cors = require("cors");

const { connectDB } = require("./config/database");
const routes = require("./routes/routes.js");

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
  process.env.FRONTEND_URL || "https://client-theta-bay.vercel.app",
  "http://localhost:5173",  // Para desarrollo local (Vite default port)
  "http://localhost:3000"   // Opcional: si pruebas frontend en otro puerto
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin y de los dominios permitidos
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.warn("CORS blocked origin:", origin);
      // En producción, mejor no mostrar error detallado
      callback(null, true); // Temporal: permitir todos para testing
      // callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,  // Cambiar a true para cookies/tokens
  preflightContinue: false,
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

      // Health check en raíz (opcional, después de DB para full status)
      app.get("/", (req, res) => {
        res.json({ 
          message: "Server is running with DB connected / Servidor en ejecución con DB conectada",
          dbStatus: "Connected"
        });
      });

      // INICIAR SERVIDOR SOLO SI TODO OK
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log("Full server ready: DB connected and routes mounted");
      });
    } catch (error) {
      // connectDB ya maneja exit(1) en su catch, pero esto es backup
      console.error("Failed to start server:", error);
      process.exit(1);
    }
  };

  startServer();  // Llamar la función async
}

/**
 * Export the app instance (para testing, sin DB wait)
 */
module.exports = app;
