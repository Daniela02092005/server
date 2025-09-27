const mongoose = require("mongoose");

/**
 * User schema definition.
 * Representa los usuarios de la aplicación almacenados en MongoDB.
 * Incluye campos de autenticación, email único y tokens de recuperación.
 */
const UserSchema = new mongoose.Schema(
  {
    /**
     * Nombre de usuario único.
     */
    username: { type: String, required: true },

    /**
     * Apellido del usuario.
     */
    lastName: { type: String, required: true },

    /**
     * Edad del usuario.
     */
    age: { type: Number, required: true },

    /**
     * Dirección de correo electrónico del usuario (única).
     */
    email: { type: String, required: true, unique: true },

    /**
     * Contraseña del usuario (debe estar hasheada antes de guardarse).
     */
    password: { type: String, required: true },

    /**
     * Token para recuperación de contraseña (hashed con sha256).
     */
    resetPasswordToken: { type: String },

    /**
     * Fecha de expiración del token de recuperación.
     */
    resetPasswordExpires: { type: Date }
  },
  {
    /**
     * createdAt y updatedAt automáticos.
     */
    timestamps: true
  }
);

/**
 * Modelo Mongoose para la colección `users`.
 */
module.exports = mongoose.model("User", UserSchema);
