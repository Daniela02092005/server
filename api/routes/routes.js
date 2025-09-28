const express = require("express");
const router = express.Router();


// Import feature-specific route modules
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const taskRoutes = require("./taskRoutes");

/**
 * Mount authentication-related routes under /auth
 */
router.use("/auth", authRoutes);

/**
 * Mount user-related routes under /users
 */
router.use("/users", userRoutes);

/**
 * Mount task-related routes under /tasks
 */
router.use("/tasks", taskRoutes);




/**
 * Export main router instance
 */
module.exports = router;
