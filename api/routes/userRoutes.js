const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const auth = require("../middlewares/auth");

/**
 * Get user profile
 */
router.get("/profile", auth, (req, res) => UserController.getProfile(req, res));

/**
 * Update user profile
 */
router.put("/profile", auth, (req, res) => UserController.updateProfile(req, res));

module.exports = router;
