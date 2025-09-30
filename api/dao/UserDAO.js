const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const GlobalDAO = require("./GlobalDAO");
const User = require("../models/User");
const { sendRecoveryEmail } = require("../services/emailService");

class UserDAO extends GlobalDAO {
  constructor() {
    super(User);
  }

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

  async update(id, updateData) {
    try {
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }
      const updated = await this.model.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).select("-password -resetPasswordToken -resetPasswordExpires");
      if (!updated) throw new Error("User not found / Usuario no encontrado");
      return updated;
    } catch (error) {
      throw new Error(`Error updating user / Error actualizando usuario: ${error.message}`);
    }
  }

  async findByEmail(email) {
    try {
      return await this.model.findOne({ email }).select('+password');
    } catch (error) {
      throw new Error(`Error finding user by email / Error buscando usuario por email: ${error.message}`);
    }
  }

  async findByEmailAndToken(email, token) {
    try {
      return await this.model.findOne({
        email,
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      }).select('+password');
    } catch (error) {
      throw new Error(`Error finding user by email and token / Error buscando usuario por email y token: ${error.message}`);
    }
  }

  async saveResetToken(userId, token, expires) {
    try {
      const user = await this.model.findById(userId);
      if (!user) throw new Error("Usuario no encontrado");
      user.resetPasswordToken = token;
      user.resetPasswordExpires = expires;
      await user.save({ validateBeforeSave: false });
      return user;
    } catch (error) {
      throw new Error(`Error guardando token de recuperación: ${error.message}`);
    }
  }

  async verifyAndResetPassword(email, token, hashedPassword) {
    try {
      const user = await this.model.findOne({
        email,
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });
      if (!user) throw new Error('Invalid or expired token / Token inválido o expirado');
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      console.log(`Password reset for user ${user._id}`);
      return user;
    } catch (error) {
      throw new Error(`Error verifying and resetting password / Error verificando y reseteando contraseña: ${error.message}`);
    }
  }

  async create(userData) {
    try {
      const existingUser = await this.model.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('Email already exists / Email ya existe');
      }
      return await super.create(userData);
    } catch (error) {
      throw new Error(`Error creating user / Error creando usuario: ${error.message}`);
    }
  }

  async deleteById(userId) {
    try {
      console.log(`[User DAO] Intentando eliminar usuario con ID: ${userId}`);
      const deletedUser  = await this.model.findByIdAndDelete(userId);
      if (!deletedUser ) {
        console.error(`[User DAO] Usuario no encontrado para eliminar con ID: ${userId}`);
        throw new Error("User  not found / Usuario no encontrado");
      }
      console.log(`[User DAO] Usuario eliminado correctamente con ID: ${userId}`);
      return deletedUser ;
    } catch (error) {
      console.error(`[User DAO] Error eliminando usuario con ID: ${userId} - ${error.message}`);
      throw new Error(`Error deleting user / Error eliminando usuario: ${error.message}`);
    }
  }
}

module.exports = new UserDAO();
