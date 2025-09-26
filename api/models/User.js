const mongoose = require("mongoose");

/**
 * User schema definition.
 * Represents application users stored in MongoDB.
 * Includes authentication fields, email, and recovery tokens.
 */
const UserSchema = new mongoose.Schema(
  {
    /**
     * Unique username of the user.
     */
    username: { type: String, required: true },
    /**
    * Last name of the user.
    */
    lastName: { type: String, required: true },
    /**
    * Age of the user.
    */
    age: { type: Number, required: true },
    /**
     * User email address (must be unique).
     */
    email: { type: String, required: true, unique: true },
    /**
     * User password (should be hashed before storing).
     */
    password: { type: String, required: true },
    /**
     * Token for password recovery (optional).
     */
    resetToken: { type: String },
    /**
     * Expiration date of the reset token.
     */
    resetTokenExp: { type: Date }
  },
  {
    /**
     * Adds `createdAt` and `updatedAt` automatically.
     */
    timestamps: true
  }
);

/**
 * Mongoose model for the User collection.
 */
module.exports = mongoose.model("User", UserSchema);
