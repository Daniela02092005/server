const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const authMiddleware = require("../middlewares/auth");

// Authentication-related routes

/**
 * Register a new user
 */
router.post("/register", (req, res) => UserController.register(req, res));
/**
 * Login user and return token
 */
router.post("/login", (req, res) => UserController.login(req, res));
/**
 * Logout user
 */
router.post("/logout", (req, res) => UserController.logout(req, res));
/**
 * Recover account (start password reset process)
 */
router.post("/recover", (req, res) => UserController.recover(req, res));
/**
 * Get profile of authenticated user
 */
router.get("/profile", authMiddleware, (req, res) => UserController.getProfile(req, res));
/**
* Reset user password
*/
router.post("/reset-password", (req, res) => UserController.resetPassword(req, res));

/**
 * Export authentication router
 */
module.exports = router;
