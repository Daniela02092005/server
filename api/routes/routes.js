// Enrutador principal / Main router
//importemos express y el módulo de rutas
const express = require("express");
const router = express.Router();

////agregado
const { sendRecoveryEmail } = require('../services/emailService'); // Ajusta la ruta a donde está tu función sendRecoveryEmail
//Agregado


// Import feature-specific route modules
// Importar módulos de rutas específicas
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const taskRoutes = require("./taskRoutes");

/**
 * Mount authentication-related routes under /auth
 * Montar rutas relacionadas con autenticación bajo /auth
 *
 * Example / Ejemplo:
 *   POST /auth/login
 *   POST /auth/register
 */
router.use("/auth", authRoutes);

/**
 * Mount user-related routes under /users
 * Montar rutas relacionadas con usuarios bajo /users
 *
 * Example / Ejemplo:
 *   PUT /users/profile
 */
router.use("/users", userRoutes);

/**
 * Mount task-related routes under /tasks
 * Montar rutas relacionadas con tareas bajo /tasks
 *
 * Example / Ejemplo:
 *   GET    /tasks
 *   POST   /tasks
 *   GET    /tasks/:id
 *   PUT    /tasks/:id
 *   DELETE /tasks/:id
 */
router.use("/tasks", taskRoutes);

//Agregado
router.post('/test-send-email', async (req, res) => {
  const { to, token } = req.body;
  if (!to || !token) {
    return res.status(400).json({ error: 'Faltan parámetros to o token' });
  }
  try {
    const info = await sendRecoveryEmail(to, token);
    res.json({ message: 'Correo enviado', info });
  } catch (error) {
    console.error('Error enviando correo:', error);
    res.status(500).json({ error: error.message });
  }
});
//agregado



/**
 * Export main router instance
 * Exportar instancia principal de enrutador
 *
 * Imported in index.js and mounted under /api/v1
 * Importado en index.js y montado bajo /api/v1
 */
module.exports = router;
