//creemos la clase que hereda a GlobalDAO y importa el modelo del User

//Importaciones
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const GlobalDAO = require("./GlobalDAO");
const User = require("../models/User");

class UserDAO extends GlobalDAO {
  constructor() {
    super(User);
  }

  //Register
  async register({ username, email, password }) {
    const exists = await this.model.findOne({ email });
    if (exists) throw new Error("Email already registered");
    const hash = await bcrypt.hash(password, 10);
    const user = await this.create({ username, email, password: hash });
    return { id: user._id, username: user.username, email: user.email, createdAt: user.createdAt };
  }

  //Login
  async login({ email, password }) {
    const user = await this.model.findOne({ email });
    if (!user) throw new Error("Invalid credentials");
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new Error("Invalid credentials");
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return { token, user: { id: user._id, username: user.username, email: user.email } };
  }

  //Recover
  async recover({ email }) {
    const user = await this.model.findOne({ email });
    if (!user) throw new Error("User  not found");
    const token = crypto.randomBytes(16).toString("hex");
    user.resetToken = token;
    user.resetTokenExp = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();
    return token;
  }
}

//Exportar
module.exports = new UserDAO();
