/* The code snippet `//Creacion de el controlador user` is a comment written in Spanish, which
translates to "Creation of the user controller" in English. It is likely indicating the purpose or
intention of the following code block, which includes importing the `UserDAO` module from the
"../dao/UserDAO" path. This import statement is essential for the `UserController` class to interact
with the data access object (DAO) responsible for handling user-related database operations. */
//Creacion de el controlador user
const UserDAO = require("../dao/UserDAO");

/* The `UserController` class in JavaScript handles user registration, login, logout, and recovery
functionalities. */
class UserController {
    
 /* The `register` method in the `UserController` class is handling the registration functionality for
 a user. Here's a breakdown of what it does: */
  //Register
  async register(req, res) {
    try {
      const user = await UserDAO.register(req.body);
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  /* The `login` method in the `UserController` class is handling the login functionality for a user.
  Here's a breakdown of what it does: */
  //Login
  async login(req, res) {
    try {
      const result = await UserDAO.login(req.body);
      res.json(result);
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  }

  /* The `logout` method in the `UserController` class is handling the logout functionality for a user.
  When this method is called, it simply responds with a JSON object containing a message indicating
  that the logout was successful. This method does not perform any complex operations but serves as
  a simple confirmation message to indicate that the user has been successfully logged out. */
  //Logout
  logout(req, res) {
    res.json({ message: "Logout successful" });
  }

  /* The `recover` method in the `UserController` class is handling the recovery process for a user.
  Here's a breakdown of what it does: */
  //Recover
  async recover(req, res) {
    try {
      const token = await UserDAO.recover(req.body);
      res.json({ message: "Recovery started", token });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  //Update prifile
  async updateProfile(req, res) {
    try {
      if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
      const updateData = { ...req.body };
      // Evitar que se actualice la contraseña o el email directamente por esta ruta si no es el propósito
      delete updateData.password; 
      delete updateData.email;
      const updatedUser = await UserDAO.update(req.userId, updateData);
      res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

}

//Exportar
/* `module.exports = new UserController();` is exporting an instance of the `UserController` class.
This allows other parts of the codebase to import and use the methods defined in the
`UserController` class. By exporting an instance of the class, you can access the methods like
`register`, `login`, `logout`, and `recover` in other files that import this module. */
module.exports = new UserController();
