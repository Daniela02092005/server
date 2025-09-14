//Creacion de el controlador user
const UserDAO = require("../dao/UserDAO");

class UserController {
    
    //Register
  async register(req, res) {
    try {
      const user = await UserDAO.register(req.body);
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  //Login
  async login(req, res) {
    try {
      const result = await UserDAO.login(req.body);
      res.json(result);
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  }

  //Logout
  logout(req, res) {
    res.json({ message: "Logout successful" });
  }

  //Recover
  async recover(req, res) {
    try {
      const token = await UserDAO.recover(req.body);
      res.json({ message: "Recovery started", token });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}

//Exportar
module.exports = new UserController();
