/**
 * Main server entry point
 * Punto de entrada principal del servidor
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
 *
 * - Parse JSON request bodies
 *   Procesa cuerpos de solicitud en formato JSON
 *
 * - Parse URL-encoded request bodies
 *   Procesa cuerpos de solicitud codificados en URL
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * CORS configuration
 * Configuración de CORS
 *
 * Allows requests only from trusted origins
 * Permite solicitudes solo desde orígenes de confianza
 */
const allowedOrigins = [
  process.env.FRONTEND_URL || "https://client-theta-bay.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      // Allow requests without origin (e.g., Postman)
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      // Accept allowed origins / Aceptar orígenes permitidos
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS / No permitido por CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allowed HTTP methods / Métodos HTTP permitidos
  allowedHeaders: ["Content-Type", "Authorization"], // Headers allowed / Encabezados permitidos
  credentials: true, // Allow cookies and credentials / Permitir cookies y credenciales
};
app.use(cors(corsOptions));

/**
 * Initialize database connection
 * Inicializar conexión a la base de datos
 *
 * Exits the process if the connection fails
 * Finaliza el proceso si la conexión falla
 */
connectDB();

/**
 * Mount the API routes under /api/v1
 * Montar las rutas de la API bajo /api/v1
 *
 * Example / Ejemplo:
 *   /api/v1/auth
 *   /api/v1/users
 *   /api/v1/tasks
 */
app.use("/api/v1", routes);

/**
 * Health check endpoint
 * Endpoint de verificación del servidor
 *
 * Useful to verify that the server is up and running
 * Útil para verificar que el servidor está en ejecución
 */
app.get("/", (req, res) => res.send("Server is running / Servidor en ejecución"));

/**
 * Start the server only if this file is run directly
 * Iniciar el servidor solo si este archivo se ejecuta directamente
 *
 * Prevents multiple servers when testing with imports
 * Previene múltiples servidores al realizar pruebas con imports
 */
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

/**
 * Export the app instance
 * Exportar la instancia de la aplicación
 *
 * Useful for testing or importing into other modules
 * Útil para pruebas o importaciones en otros módulos
 */
module.exports = app;
