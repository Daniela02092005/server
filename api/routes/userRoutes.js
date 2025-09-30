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

router.delete("/profile", auth, async (req, res) => {
  try {
    const userId = req.userId; // Middleware auth pone userId en req
    const deletedUser  = await UserDAO.delete(userId);
    res.status(200).json({ message: "Usuario eliminado correctamente", user: deletedUser  });
  } catch (error) {
    res.status(500).json({ message: error.message || "Error eliminando usuario" });
  }
});

module.exports = router;
