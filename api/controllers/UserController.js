const GlobalController = require("./GlobalController");
const UserDAO = require("../dao/UserDAO");
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { sendRecoveryEmail } = require("../services/emailService");

/**
 * Controller class for managing User resources and authentication.
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
      console.error("Error in updateProfile:", err);
      res.status(400).json({ message: err.message });
    }
  }
  /**
   * Get profile of the authenticated user.
   * Requires the `auth` middleware to set `req.userId`.
   */
  async getProfile(req, res) {
    try {
      console.log("getProfile called with userId:", req.userId);
      const userId = req.userId;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const user = await UserDAO.model
        .findById(userId)
        .select("-password -resetPasswordToken -resetPasswordExpires");

      if (!user) {
        console.log("User  not found for ID:", userId);
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
      if (!email) {
        return res.status(400).json({ message: "Email es requerido" });
      }
      const user = await this.dao.findByEmail(email);
      if (!user) {
        return res.status(200).json({ message: "Si el email existe, se ha enviado un enlace de recuperación" });
      }
      
      const resetToken = jwt.sign(
        {
          id: user._id,
          type: 'recovery',
          email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      const resetTokenExpires = Date.now() + 3600000; // 1 hour in ms
      await this.dao.saveResetToken(user._id, resetToken, resetTokenExpires);
      console.log("Antes de enviar email");
      await sendRecoveryEmail(user.email, resetToken);
      console.log("Después de enviar email");
      res.status(200).json({
        message: "Email de recuperación enviado. Revisa tu bandeja de entrada."
      });
    } catch (error) {
      console.error('Error en forgotPassword:', error);
      res.status(500).json({ message: "Error del servidor" });
    }
  }

  /**
   * Reset password with token + email.
   */
  async resetPassword(req, res) {
    try {
      const { email, password, token } = req.body;
      if (!email || !password || !token) {
        return res.status(400).json({ message: "Email, contraseña y token son requeridos" });
      }
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.type !== 'recovery' || decoded.email !== email) {
          throw new Error('Token inválido');
        }
      } catch (jwtError) {
        return res.status(400).json({ message: "Token inválido o expirado" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      await this.dao.verifyAndResetPassword(email, token, hashedPassword);
      res.status(200).json({
        message: "Contraseña restablecida exitosamente"
      });
    } catch (error) {
      console.error('Error en resetPassword:', error);
      res.status(400).json({ message: error.message || "Token inválido o expirado" });
    }
  }
}
/**
 * Export a singleton instance of UserController.
 */
module.exports = new UserController();
