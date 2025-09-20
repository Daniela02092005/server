//creemos la clase que hereda a GlobalDAO y importa el modelo del User
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const GlobalDAO = require("./GlobalDAO");
const User = require("../models/User");
// Importar el servicio de correo
const { sendRecoveryEmail } = require("../services/emailService"); 

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
   * @param {Object} param0 - { username, email, password }
   * @returns {Promise<Object>} Newly created user (without sensitive data).
   */
  async register({ username, email, password }) {
    const exists = await this.model.findOne({ email });
    if (exists) throw new Error("Email already registered / Correo ya registrado");

    const hash = await bcrypt.hash(password, 10);
    const user = await this.create({ username, email, password: hash });

    return {
      id: user._id,
      username: user.username,
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
      user: { id: user._id, username: user.username, email: user.email },
    };
  }

  /**
  * Generate a password recovery token and send email.
  * Generar un token para recuperación de contraseña y enviar correo.
  *
  * @param {Object} param0 - { email }
  * @returns {Promise<string>} Message indicating recovery started.
  */
  async recover({ data }) { // Recibe el objeto completo
    const email = data.email; // Acceder a la propiedad email
    const user = await this.model.findOne({ email });
    if (!user) {
      // No revelar si el usuario existe o no por seguridad
      console.log(`Intento de recuperación de contraseña para correo no registrado: ${email}`);
      throw new Error("If the email exists, a recovery link has been sent / Si el correo existe, se ha enviado un enlace de recuperación");
    }

    const token = crypto.randomBytes(32).toString("hex"); // Token más largo para mayor seguridad
    user.resetToken = token;
    user.resetTokenExp = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
    await user.save();
    
    // Enviar el correo electrónico
    try {
      await sendRecoveryEmail(user.email, token);
      return "Recovery email sent / Correo de recuperación enviado";
    } catch (emailError) {
      console.error("Error sending recovery email:", emailError);
      throw new Error("Error sending recovery email / Error al enviar correo de recuperación");
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

