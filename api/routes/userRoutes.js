// Rutas de usuario / User routes
//importemos a express, y creamos un enrutador aislado
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const auth = require("../middlewares/auth");


/**
 * Get user profile
 * Obtener perfil de usuario
 */
router.get("/profile", auth, (req, res) => UserController.getProfile(req, res));

/**
 * Update user profile
 * Actualizar perfil de usuario
 */
router.put("/profile", auth, (req, res) => UserController.updateProfile(req, res));

/**
 * Export user router
 * Exportar enrutador de usuario
 */
module.exports = router;
