const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const auth = require("../middlewares/auth");
const userDAO = require('../dao/UserDAO'); 

/**
 * Get user profile
 */
router.get("/profile", auth, (req, res) => UserController.getProfile(req, res));

/**
 * Update user profile
 */
router.put("/profile", auth, (req, res) => UserController.updateProfile(req, res));

router.delete('/profile', auth, (req, res) => UserController.deleteProfile(req, res));

module.exports = router;
