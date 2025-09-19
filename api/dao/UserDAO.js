//creemos la clase que hereda a GlobalDAO y importa el modelo del User

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const GlobalDAO = require("./GlobalDAO");
const User = require("../models/User");

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
   * Generate a password recovery token.
   * Generar un token para recuperación de contraseña.
   *
   * @param {Object} param0 - { email }
   * @returns {Promise<string>} Reset token
   */
  async recover({ email }) {
    const user = await this.model.findOne({ email });
    if (!user) throw new Error("User not found / Usuario no encontrado");

    const token = crypto.randomBytes(16).toString("hex");
    user.resetToken = token;
    user.resetTokenExp = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
    await user.save();

    return token;
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

