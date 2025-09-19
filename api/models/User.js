/* The code `//creamos el esquema del usuario` is a comment written in Spanish, which translates to
"create the user schema". It is indicating that the following code is defining the schema for a user
in a MongoDB database using Mongoose, a Node.js library for MongoDB. */
//creamos el esquema del usuario
const mongoose = require("mongoose");

/* This code is defining a Mongoose schema for a user in a MongoDB database. Here's a breakdown of what
each property in the schema represents: */
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetToken:    { type: String },
  resetTokenExp: { type: Date }
}, { timestamps: true });

/* This line of code is exporting a Mongoose model named "User" based on the UserSchema that was
defined earlier. */
module.exports = mongoose.model("User", UserSchema); 

