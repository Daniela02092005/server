// Enrutador principal / Main router
//importemos express y el módulo de rutas
const express = require("express");
const router = express.Router();

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

/**
 * Export main router instance
 * Exportar instancia principal de enrutador
 *
 * Imported in index.js and mounted under /api/v1
 * Importado en index.js y montado bajo /api/v1
 */
module.exports = router;
