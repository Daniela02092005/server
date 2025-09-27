const GlobalController = require("./GlobalController");
const UserDAO = require("../dao/UserDAO");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { sendRecoveryEmail } = require("../services/emailService");

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

      // No permitir password/email aquí
      delete allowedUpdates.password;
      delete allowedUpdates.email;

      if (Object.keys(allowedUpdates).length === 0) {
        return res.status(400).json({ message: "No valid fields to update. Provide username, lastName, or age." });
      }

      const updatedUser  = await UserDAO.update(req.userId, allowedUpdates);

      res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser ,
      });
    } catch (err) {
      console.error("Error in updateProfile:", err); // Logging para debug
      res.status(400).json({ message: err.message });
    }
  }
  /**
   * Get profile of the authenticated user.
   * Requires the `auth` middleware to set `req.userId`.
   */
  async getProfile(req, res) {
    try {
      console.log("getProfile called with userId:", req.userId); // Logging para debug 404
      const userId = req.userId;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const user = await UserDAO.model
        .findById(userId)
        .select("-password -resetPasswordToken -resetPasswordExpires");

      if (!user) {
        console.log("User  not found for ID:", userId); // Logging para debug
        return res.status(404).json({ message: "User  not found" });
      }

      res.status(200).json({
        _id: user._id,
        username: user.username,
        lastName: user.lastName,
        age: user.age,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } catch (err) {
      console.error("❌ Error in getProfile:", err.message);
      res.status(500).json({ message: err.message });
    }
  }
  /**
   * Forgot password: generates token, saves to DB and sends recovery email.
   */
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ message: "Email requerido" });

      const user = await UserDAO.model.findOne({ email });
      if (!user) {
        // Por seguridad, no revelar si el email existe
        return res.status(200).json({ message: "Si el email existe, te enviaremos instrucciones" });
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashed = crypto.createHash("sha256").update(resetToken).digest("hex");

      user.resetPasswordToken = hashed;
      user.resetPasswordExpires = Date.now() + 3600 * 1000; // 1 hora
      await user.save();

      await sendRecoveryEmail(user.email, resetToken, user.email);
      res.json({ message: "Email de recuperación enviado" });
    } catch (err) {
      console.error("forgotPassword error:", err);
      res.status(500).json({ message: "Error interno al enviar email" });
    }
  }
  /**
   * Reset password with token + email.
   */
  async resetPassword(req, res) {
    try {
      const { token, email, password } = req.body;
      if (!token || !email || !password)
        return res.status(400).json({ message: "Faltan datos: token, email y password" });

      const hashed = crypto.createHash("sha256").update(token).digest("hex");

      const user = await UserDAO.model.findOne({
        email,
        resetPasswordToken: hashed,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) return res.status(400).json({ message: "Token inválido o expirado" });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save();
      res.json({ message: "Contraseña actualizada correctamente" });
    } catch (err) {
      console.error("resetPassword error:", err);
      res.status(500).json({ message: "Error interno" });
    }
  }
}
/**
 * Export a singleton instance of UserController.
 */
module.exports = new UserController();
