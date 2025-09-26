const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); 

const GlobalDAO = require("./GlobalDAO");
const User = require("../models/User");
const { sendRecoveryEmail } = require("../services/emailService"); 
/**
 * Data Access Object (DAO) for the User model.
 *
 * Extends the generic {@link GlobalDAO} class to provide
 * database operations (create, read, update, delete, getAll)
 * specifically for User documents.
 */
class UserDAO extends GlobalDAO {
  /**
   * Create a new UserDAO instance.
   *
   * Passes the User Mongoose model to the parent class so that
   * all inherited CRUD methods operate on the User collection.
   *
   */
  constructor() {
    super(User);
  }

  /**
   * Register a new user with hashed password.
   *
   * @param {Object} param0 - { username, lastName, age, email, password }
   * @returns {Promise<Object>} Newly created user (without sensitive data).
   */
  async register({ username, lastName, age, email, password }) {
    const exists = await this.model.findOne({ email });
    if (exists) throw new Error("Email already registered / Correo ya registrado");
    const hash = await bcrypt.hash(password, 10);
    const user = await this.create({ username, lastName, age, email, password: hash });
    return {
      id: user._id,
      username: user.username,
      lastName: user.lastName,
      age: user.age,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  /**
   * Authenticate a user and return JWT token.
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
      user: { id: user._id, username: user.username, lastName: user.lastName, age: user.age, email: user.email },
    };
  }

  /**
  * Generate a password recovery token and send email.
  *
  * @param {Object} data - { email }
  * @returns {Promise<string>} Message indicating recovery started.
  */
  async recover({ email }) {
    const user = await this.model.findOne({ email });
    if (!user) {
      throw new Error("User with this email does not exist.");
    }
    // Generar un token de recuperación único
    const resetToken = crypto.randomBytes(32).toString('hex');
    // Establecer una fecha de expiración (ej. 1 hora)
    const resetTokenExp = Date.now() + 3600000; // 1 hora en milisegundos
    user.resetToken = resetToken;
    user.resetTokenExp = resetTokenExp;
    await user.save();
    // Enviar el correo con el enlace de recuperación
    await sendRecoveryEmail(user.email, resetToken);
    return "Password recovery email sent / Correo de recuperación de contraseña enviado.";
  }

  /**
   * Update a user's profile.
   *
   * @param {string} id - User ID.
   * @param {Object} updateData - Data to update.
   * @returns {Promise<Object>} Updated user.
   */
  async update(id, updateData) {
    try {
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }
      const updated = await this.model.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).select("-password -resetToken -resetTokenExp");
      if (!updated) throw new Error("User not found / Usuario no encontrado");
      return updated;
    } catch (error) {
      throw new Error(`Error updating user / Error actualizando usuario: ${error.message}`);
    }
  }

  /**
  * Reset user password using a recovery token.
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
    user.resetToken = undefined;
    user.resetTokenExp = undefined;
    await user.save();
    return { message: "Password reset successfully / Contraseña restablecida exitosamente" };
  }

}

/**
 * Export a singleton instance of UserDAO.
 *
 * This ensures the same DAO instance is reused across the app,
 * avoiding redundant instantiations.
 */
module.exports = new UserDAO();
