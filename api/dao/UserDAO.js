//creemos la clase que hereda a GlobalDAO y importa el modelo del User

/* The lines `const bcrypt = require("bcryptjs");` and `const jwt = require("jsonwebtoken");` are
importing the necessary modules `bcryptjs` and `jsonwebtoken` in the JavaScript code snippet. */
//Importaciones
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
/* The lines `const crypto = require("crypto");`, `const GlobalDAO = require("./GlobalDAO");`, and
`const User = require("../models/User");` are importing necessary modules and classes for the
`UserDAO` class in the JavaScript code snippet provided. */
const crypto = require("crypto");
const GlobalDAO = require("./GlobalDAO");
const User = require("../models/User");

/* The `UserDAO` class contains methods for user registration, login, and password recovery, utilizing
bcrypt for password hashing and jwt for token generation. */
class UserDAO extends GlobalDAO {
  /**
   * The above function is attempting to call the constructor of the superclass "User".
   */
  constructor() {
    super(User);
  }

  /* The `register` method in the `UserDAO` class is a function that handles the registration process
  for a new user. Here is a breakdown of what it does: */
  //Register
  async register({ username, email, password }) {
    const exists = await this.model.findOne({ email });
    if (exists) throw new Error("Email already registered");
    const hash = await bcrypt.hash(password, 10);
    const user = await this.create({ username, email, password: hash });
    return { id: user._id, username: user.username, email: user.email, createdAt: user.createdAt };
  }

  /* The `login` method in the `UserDAO` class is a function that handles the login process for a user.
  Here is a breakdown of what it does: */
  //Login
  async login({ email, password }) {
    const user = await this.model.findOne({ email });
    if (!user) throw new Error("Invalid credentials");
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new Error("Invalid credentials");
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return { token, user: { id: user._id, username: user.username, email: user.email } };
  }

  /* The `recover` method in the `UserDAO` class is a function that handles the password recovery
  process for a user. Here is a breakdown of what it does: */
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

/* The `//Exportar` comment is indicating that the following code is exporting the `UserDAO` class
instance as a module. */
//Exportar
module.exports = new UserDAO();
