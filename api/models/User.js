const mongoose = require("mongoose");

/**
 * User schema definition.
 * Represents the users of the application stored in MongoDB.
 * Includes authentication fields, unique email, and recovery tokens.
 */
const UserSchema = new mongoose.Schema(
  {
      /**
     * Unique username.
     */
    username: { type: String, required: true },

     /**
     * User's last name.
     */
    lastName: { type: String, required: true },

    /**
     * User's age.
     */
    age: { type: Number, required: true },

    /**
     * User's email address (must be unique).
     */
    email: { type: String, required: true, unique: true },

    /**
     * User's password (should be hashed before saving).
     */
    password: { type: String, required: true },

   /**
     * Token for password recovery (hashed with sha256).
     */
    resetPasswordToken: { type: String },

    /**
     * Expiration date for the recovery token.
     */
    resetPasswordExpires: { type: Date }
  },
  {
    /**
     * Automatic createdAt and updatedAt fields.
     */
    timestamps: true
  }
);

/**
 * Mongoose model for the `users` collection.
 */
module.exports = mongoose.model("User", UserSchema);
