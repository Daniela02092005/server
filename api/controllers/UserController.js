const GlobalController = require("./GlobalController");
const UserDAO = require("../dao/UserDAO");

/**
 * Controller class for managing User resources and authentication.
 *
 * Extends the generic {@link GlobalController} to inherit CRUD operations,
 * and adds specific methods for user registration, login, logout,
 * password recovery, and profile updates.
 */
class UserController extends GlobalController {
  constructor() {
    super(UserDAO);
  }
  /**
   * Handle user registration.
   */
  async register(req, res) {
    try {
      const { username, lastName, age, email, password } = req.body;
      const user = await UserDAO.register({ username, lastName, age, email, password });
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
  /**
   * Handle user login.
   */
  async login(req, res) {
    try {
      const result = await UserDAO.login(req.body);
      res.json(result);
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  }
  /**
   * Handle user logout.
   */
  logout(req, res) {
    res.json({ message: "Logout successful" });
  }
  /**
   * Handle user account recovery.
   */
  async recover(req, res) {
    try {
      const message = await UserDAO.recover({ email: req.body.email });
      res.json({ message });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
  /**
   * Update user profile (excluding password and email by default).
   */
  async updateProfile(req, res) {
    try {
      if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
      const updateData = { ...req.body };
      const allowedUpdates = {};
      if (updateData.username) allowedUpdates.username = updateData.username;
      if (updateData.lastName) allowedUpdates.lastName = updateData.lastName; 
      if (updateData.age) allowedUpdates.age = updateData.age;            
      // No permitir la actualización de password o email directamente a través de esta ruta
      delete allowedUpdates.password;
      delete allowedUpdates.email;
      if (Object.keys(allowedUpdates).length === 0) {
        return res.status(400).json({ message: "No valid fields to update." });
      }
      const updatedUser = await UserDAO.update(req.userId, allowedUpdates);
      // Devolver el usuario actualizado con los campos correctos
      res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
  /**
   * Get profile of the authenticated user.
   *
   * Requires the `auth` middleware to set `req.userId`.
   */
  async getProfile(req, res) {
    try {
      console.log("📱 GET Profile called - User ID:", req.userId);
      console.log("📱 Headers:", req.headers);

      const userId = req.userId;
      if (!userId) {
        console.log("❌ No user ID in request");
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await UserDAO.model
        .findById(userId)
        .select("-password -resetToken -resetTokenExp");

      if (!user) {
        console.log("❌ User not found in database");
        return res.status(404).json({ message: "User not found" });
      }

      console.log("✅ User found:", user.email);

      res.status(200).json({
        _id: user._id,
        username: user.username,
        lastName: user.lastName,
        age: user.age,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      });
    } catch (err) {
      console.error("❌ Error in getProfile:", err.message);
      res.status(500).json({ message: err.message });
    }
  }
  /**
  * Handle password reset.
  * Maneja el restablecimiento de contraseña.
  */
  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;
      const result = await UserDAO.resetPassword(token, newPassword);
      res.json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

}
/**
 * Export a singleton instance of UserController.
 * Exportar una instancia única de UserController.
 */
module.exports = new UserController();
