//Creamos el esquema del usuario
const mongoose = require("mongoose");

/**
 * User schema definition.
 * Definición del esquema de usuario.
 *
 * Represents application users stored in MongoDB.
 * Representa los usuarios de la aplicación almacenados en MongoDB.
 *
 * Includes authentication fields, email, and recovery tokens.
 * Incluye campos de autenticación, correo electrónico y tokens de recuperación.
 */
const UserSchema = new mongoose.Schema(
  {
    /**
     * Unique username of the user.
     * Nombre de usuario único.
     */
    username: { type: String, required: true },

    /**
     * User email address (must be unique).
     * Dirección de correo del usuario (debe ser única).
     */
    email: { type: String, required: true, unique: true },

    /**
     * User password (should be hashed before storing).
     * Contraseña del usuario (debe ser hasheada antes de guardar).
     */
    password: { type: String, required: true },

    /**
     * Token for password recovery (optional).
     * Token de recuperación de contraseña (opcional).
     */
    resetToken: { type: String },

    /**
     * Expiration date of the reset token.
     * Fecha de expiración del token de recuperación.
     */
    resetTokenExp: { type: Date }
  },
  {
    /**
     * Adds `createdAt` and `updatedAt` automatically.
     * Añade `createdAt` y `updatedAt` automáticamente.
     */
    timestamps: true
  }
);

/**
 * Mongoose model for the User collection.
 * Modelo Mongoose para la colección User.
 */
module.exports = mongoose.model("User", UserSchema);
