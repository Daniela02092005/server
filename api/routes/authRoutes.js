const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const authMiddleware = require("../middlewares/auth");

// ==============================
// Authentication-related routes
// ==============================

/**
 * Register a new user
 * POST /api/v1/auth/register
 */
router.post("/register", (req, res) => UserController.register(req, res));

/**
 * Login user and return token
 * POST /api/v1/auth/login
 */
router.post("/login", (req, res) => UserController.login(req, res));

/**
 * Logout user
 * POST /api/v1/auth/logout
 */
router.post("/logout", (req, res) => UserController.logout(req, res));

/**
 * (Legacy) Recover account
 * POST /api/v1/auth/recover
 * ⚠️ Opción antigua, puedes eliminar si ya no la usas.
 * router.post("/recover", (req, res) => UserController.recover(req, res));
 */


/**
 * Forgot password (send recovery email)
 * POST /api/v1/auth/forgot-password
 */
router.post("/forgot-password", (req, res) => UserController.forgotPassword(req, res));

/**
 * Reset user password with token
 * POST /api/v1/auth/reset-password
 */
router.post("/reset-password", (req, res) => UserController.resetPassword(req, res));

/**
 * Get authenticated user profile
 * GET /api/v1/auth/profile
 */
router.get("/profile", authMiddleware, (req, res) => UserController.getProfile(req, res));

/**
 * Update authenticated user profile
 * PUT /api/v1/auth/profile
 */
router.put("/profile", authMiddleware, (req, res) => UserController.updateProfile(req, res));

// ==============================
// Export router
// ==============================
module.exports = router;
