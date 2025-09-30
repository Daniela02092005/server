const GlobalController = require("./GlobalController");
const UserDAO = require("../dao/UserDAO");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const { sendRecoveryEmail } = require("../services/emailService");

class UserController extends GlobalController {
  constructor() {
    super(UserDAO);
  }

  async register(req, res) {
    try {
      const { username, lastName, age, email, password } = req.body;
      const user = await UserDAO.register({ username, lastName, age, email, password });
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async login(req, res) {
    try {
      const result = await UserDAO.login(req.body);
      res.json(result);
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  }

  logout(req, res) {
    res.json({ message: "Logout successful" });
  }

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

      const updatedUser = await UserDAO.update(req.userId, allowedUpdates);

      res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (err) {
      console.error("Error in updateProfile:", err);
      res.status(400).json({ message: err.message });
    }
  }

  async getProfile(req, res) {
    try {
      const userId = req.userId;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const user = await UserDAO.model
        .findById(userId)
        .select("-password -resetPasswordToken -resetPasswordExpires");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
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

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required / Email requerido" });
      }
      const user = await this.dao.findByEmail(email);
      if (!user) {
        return res.status(200).json({ message: "If the email exists, a recovery link has been sent" });
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

      const resetTokenExpires = Date.now() + 3600000; // 1 hour
      await this.dao.saveResetToken(user._id, resetToken, resetTokenExpires);

      await sendRecoveryEmail(user.email, resetToken);

      res.status(200).json({
        message: "Recovery email sent. Check your inbox."
      });
    } catch (error) {
      console.error('Error in forgotPassword:', error);
      res.status(500).json({ message: "Server error" });
    }
  }

  async resetPassword(req, res) {
    try {
      const { email, password, token } = req.body;
      if (!email || !password || !token) {
        return res.status(400).json({ message: "Email, password, and token are required" });
      }

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.type !== 'recovery' || decoded.email !== email) {
          throw new Error('Invalid token');
        }
      } catch (jwtError) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      await this.dao.verifyAndResetPassword(email, token, hashedPassword);

      res.status(200).json({
        message: "Password reset successfully"
      });
    } catch (error) {
      console.error('Error in resetPassword:', error);
      res.status(400).json({ message: error.message || "Invalid or expired token" });
    }
  }

  async deleteProfile(req, res) {
    try {
      console.log(`[User Controller] Solicitud para eliminar perfil del usuario ID: ${req.userId}`);
      if (!req.userId) {
        console.warn("[User Controller] Usuario no autenticado intentando eliminar perfil");
        return res.status(401).json({ message: "Unauthorized" });
      }
      await UserDAO.deleteById(req.userId);
      console.log(`[User Controller] Usuario eliminado correctamente ID: ${req.userId}`);
      res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      console.error(`[User Controller] Error en deleteProfile para usuario ID: ${req.userId} - ${error.message}`);
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new UserController();
