//importemos express y el módulo de rutas
const express = require("express");
const router = express.Router();

//Crear enrutadores raiz
// Import feature-specific route modules
const authRoutes = require("./authRoutes");
const taskRoutes = require("./taskRoutes");

/**
 * Mount authentication-related routes.
 *
 * All routes defined in {@link authRoutes} will be accessible under `/auth`.
 * Example:
 *   - POST   /auth/login       → User login
 *   - POST   /auth/register    → User registration
 *   - GET    /auth/profile     → Get logged user profile
 */
//Montamos el enrutador auth
router.use("/auth", authRoutes);

/**
 * Mount task-related routes.
 *
 * All routes defined in {@link taskRoutes} will be accessible under `/tasks`.
 * Example:
 *   - GET    /tasks            → Get all tasks
 *   - POST   /tasks            → Create a new task
 *   - GET    /tasks/:id        → Get task by ID
 *   - PUT    /tasks/:id        → Update task by ID
 *   - DELETE /tasks/:id        → Delete task by ID
 */
//Montamos el enrutador tasks
router.use("/tasks", taskRoutes);

/**
 * Export the main router instance.
 * This is imported in `index.js` and mounted under `/api/v1`.
 */

//Exportamos el enrutador
module.exports = router;
