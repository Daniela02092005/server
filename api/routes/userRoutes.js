// Rutas de usuario / User routes
//importemos a express, y creamos un enrutador aislado
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const auth = require("../middlewares/auth");

/**
 * Update user profile
 * Actualizar perfil de usuario
 *
 * Example / Ejemplo:
 *   PUT /users/profile
 */
router.put("/profile", auth, (req, res) => UserController.updateProfile(req, res));

/**
 * Export user router
 * Exportar enrutador de usuario
 */
module.exports = router;
