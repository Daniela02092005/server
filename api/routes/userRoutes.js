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

/**
 * Delete authenticated user profile
 * DELETE /api/v1/users/profile
 */
router.delete('/profile', auth, (req, res) => {
  console.log(`[userRoutes] DELETE /profile llamada por usuario ID: ${req.userId}`);
  UserController.deleteProfile(req, res);
});


module.exports = router;
