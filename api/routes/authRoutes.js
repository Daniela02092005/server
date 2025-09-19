// Rutas auth - importemos a express, y creamos un enrutador aislado
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

//Definir rutas
router.post("/register", (req, res) => UserController.register(req, res));
router.post("/login", (req, res) => UserController.login(req, res));
router.post("/logout", (req, res) => UserController.logout(req, res));
router.post("/recover", (req, res) => UserController.recover(req, res));

//Ruta actualizacion

router.put("/profile", auth, (req, res) => UserController.updateProfile(req, res));
        
            
module.exports = router;
