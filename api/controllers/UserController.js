//Creacion del controlador User
const GlobalController = require("./GlobalController");
const UserDAO = require("../dao/UserDAO");

/**
 * Controller class for managing User resources and authentication.
 * Clase controladora para gestionar recursos de usuario y autenticación.
 *
 * Extends the generic {@link GlobalController} to inherit CRUD operations,
 * and adds specific methods for user registration, login, logout,
 * password recovery, and profile updates.
 *
 * Extiende el {@link GlobalController} genérico para heredar operaciones CRUD,
 * y agrega métodos específicos para registro de usuarios, inicio/cierre de sesión,
 * recuperación de contraseña y actualización de perfil.
 */
class UserController extends GlobalController {
  constructor() {
    super(UserDAO);
  }

  /**
   * Handle user registration.
   * Maneja el registro de usuario.
   */
  async register(req, res) {
    try {
      // Asegurarse de pasar todos los campos necesarios al DAO
      const { username, lastName, age, email, password } = req.body;
      const user = await UserDAO.register({ username, lastName, age, email, password });
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  /**
   * Handle user login.
   * Maneja el inicio de sesión de usuario.
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
   * Maneja el cierre de sesión de usuario.
   */
  logout(req, res) {
    res.json({ message: "Logout successful" });
  }

  /**
   * Handle user account recovery.
   * Maneja la recuperación de cuenta de usuario.
   */
  async recover(req, res) {
    try {
      // Pasar directamente req.body.email al DAO
      const message = await UserDAO.recover({ email: req.body.email });
      res.json({ message });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  /**
   * Update user profile (excluding password and email by default).
   * Actualiza el perfil del usuario (excluye contraseña y correo por defecto).
   */
  async updateProfile(req, res) {
    try {
      if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
      const updateData = { ...req.body };
      // Permitir la actualización de username, lastName y age
      const allowedUpdates = {};
      if (updateData.username) allowedUpdates.username = updateData.username;
      if (updateData.lastName) allowedUpdates.lastName = updateData.lastName; // Nuevo campo
      if (updateData.age) allowedUpdates.age = updateData.age;             // Nuevo campo
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
   * Obtener el perfil del usuario autenticado.
   *
   * Requires the `auth` middleware to set `req.userId`.
   * Requiere que el middleware `auth` establezca `req.userId`.
   */
  async getProfile(req, res) {
    try {
      const userId = req.userId;
      const user = await UserDAO.model
        .findById(userId)
        .select("-password -resetToken -resetTokenExp"); // Excluir campos sensibles
      if (!user) return res.status(404).json({ message: "User not found" });
      // Asegurarse de que los campos lastName y age se incluyan en la respuesta
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
