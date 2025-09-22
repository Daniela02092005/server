//creemos la clase que hereda a GlobalDAO y importa el modelo del User
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const GlobalDAO = require("./GlobalDAO");
const User = require("../models/User");
// Importar el servicio de correo
const { sendRecoveryEmail, sendPasswordByEmail } = require("../services/emailService"); // Importar nueva función

/**
 * Data Access Object (DAO) for the User model.
 * DAO de Acceso a Datos para el modelo de Usuario.
 *
 * Extends the generic {@link GlobalDAO} class to provide
 * database operations (create, read, update, delete, getAll)
 * specifically for User documents.
 *
 * Extiende la clase genérica {@link GlobalDAO} para proporcionar
 * operaciones de base de datos específicamente para documentos de Usuario.
 */
class UserDAO extends GlobalDAO {
  /**
   * Create a new UserDAO instance.
   * Crear una nueva instancia de UserDAO.
   *
   * Passes the User Mongoose model to the parent class so that
   * all inherited CRUD methods operate on the User collection.
   *
   * Pasa el modelo de Mongoose `User` a la clase padre para que
   * todos los métodos CRUD heredados operen sobre la colección User.
   */
  constructor() {
    super(User);
  }

  /**
   * Register a new user with hashed password.
   * Registrar un nuevo usuario con contraseña encriptada.
   *
   * @param {Object} param0 - { username, lastName, age, email, password }
   * @returns {Promise<Object>} Newly created user (without sensitive data).
   */
  async register({ username, lastName, age, email, password }) { // Añadir lastName y age
    const exists = await this.model.findOne({ email });
    if (exists) throw new Error("Email already registered / Correo ya registrado");
    const hash = await bcrypt.hash(password, 10);
    const user = await this.create({ username, lastName, age, email, password: hash }); // Guardar nuevos campos
    return {
      id: user._id,
      username: user.username,
      lastName: user.lastName, // Incluir en la respuesta
      age: user.age,           // Incluir en la respuesta
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  /**
   * Authenticate a user and return JWT token.
   * Autenticar un usuario y devolver un token JWT.
   *
   * @param {Object} param0 - { email, password }
   * @returns {Promise<Object>} { token, user }
   */
  async login({ email, password }) {
    const user = await this.model.findOne({ email });
    if (!user) throw new Error("Invalid credentials / Credenciales inválidas");
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new Error("Invalid credentials / Credenciales inválidas");
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return {
      token,
      user: { id: user._id, username: user.username, lastName: user.lastName, age: user.age, email: user.email }, // Incluir nuevos campos
    };
  }

  /**
  * Generate a password recovery token and send email.
  * Generar un token para recuperación de contraseña y enviar correo.
  *
  * @param {Object} data - { email }
  * @returns {Promise<string>} Message indicating recovery started.
  */
  async recover({ email }) { // Recibe directamente el email
    const user = await this.model.findOne({ email });

    if (!user) {
      throw new Error("User with this email does not exist."); // Mensaje explícito
    }


    // **Opción 2 (Generar una nueva contraseña temporal y enviarla - Menos insegura que la 1, pero no es "la del usuario"):**
    const newTempPassword = crypto.randomBytes(8).toString('hex'); // Generar una nueva contraseña temporal
    user.password = await bcrypt.hash(newTempPassword, 10); // Hashear y guardar la nueva contraseña
    user.resetToken = undefined; // Limpiar tokens de reset si existieran
    user.resetTokenExp = undefined;
    await user.save();
    await sendPasswordByEmail(user.email, newTempPassword); // Enviar la nueva contraseña temporal
    return "A new temporary password has been sent to your email."; // Mensaje actualizado

  }

  /**
   * Update a user's profile.
   * Actualizar el perfil de un usuario.
   *
   * @param {string} id - User ID.
   * @param {Object} updateData - Data to update.
   * @returns {Promise<Object>} Updated user.
   */
  async update(id, updateData) {
    try {
      // Asegurarse de que la contraseña se hashee si se está actualizando
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }
      const updated = await this.model.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).select("-password -resetToken -resetTokenExp"); // Excluir campos sensibles de la respuesta
      if (!updated) throw new Error("User not found / Usuario no encontrado");
      return updated;
    } catch (error) {
      throw new Error(`Error updating user / Error actualizando usuario: ${error.message}`);
    }
  }

  /**
  * Reset user password using a recovery token.
  * Restablecer la contraseña del usuario usando un token de recuperación.
  *
  * @param {string} token - The recovery token.
  * @param {string} newPassword - The new password.
  * @returns {Promise<Object>} The updated user.
  */
  async resetPassword(token, newPassword) {
    const user = await this.model.findOne({
      resetToken: token,
      resetTokenExp: { $gt: Date.now() }, // Token no expirado
    });
    if (!user) {
      throw new Error("Invalid or expired password reset token / Token de restablecimiento de contraseña inválido o expirado");
    }

    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    user.resetToken = undefined; // Limpiar el token
    user.resetTokenExp = undefined; // Limpiar la expiración del token
    await user.save();
    return { message: "Password reset successfully / Contraseña restablecida exitosamente" };
  }

}

/**
 * Export a singleton instance of UserDAO.
 * Exportar una instancia única de UserDAO.
 *
 * This ensures the same DAO instance is reused across the app,
 * avoiding redundant instantiations.
 * Esto asegura que la misma instancia sea reutilizada en toda la app,
 * evitando instanciaciones redundantes.
 */
module.exports = new UserDAO();
