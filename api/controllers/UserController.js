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
  /**
   * Create a new UserController instance.
   * Crear una nueva instancia de UserController.
   *
   * The constructor passes the UserDAO to the parent class so that
   * all inherited methods (create, read, update, delete, getAll)
   * operate on the User model.
   *
   * El constructor pasa el UserDAO a la clase padre para que todos los
   * métodos heredados (create, read, update, delete, getAll) operen
   * sobre el modelo de usuario.
   */
  constructor() {
    super(UserDAO);
  }

  /**
   * Handle user registration.
   * Maneja el registro de usuario.
   */
  async register(req, res) {
    try {
      const user = await UserDAO.register(req.body);
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
      const token = await UserDAO.recover(req.body);
      res.json({ message: "Recovery started", token });
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
      // Prevent sensitive fields from being updated directly / Evitar actualización directa de campos sensibles
      delete updateData.password;
      delete updateData.email;

      const updatedUser = await UserDAO.update(req.userId, updateData);
      res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}

/**
 * Export a singleton instance of UserController.
 * Exportar una instancia única de UserController.
 *
 * This allows reuse across routes without creating multiple instances.
 * Esto permite reutilizarlo en las rutas sin crear múltiples instancias.
 */
module.exports = new UserController();
