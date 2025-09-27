// Rutas de usuario / User routes
//importemos a express, y creamos un enrutador aislado
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const auth = require("../middlewares/auth");

/**
 * Get user profile
 * Obtener perfil de usuario
 * 
 * Ruta final: GET /api/v1/users/profile
 */
router.get("/profile", auth, (req, res) => UserController.getProfile(req, res));
/**
 * Update user profile
 * Actualizar perfil de usuario
 * 
 * Ruta final: PUT /api/v1/users/profile
 */
router.put("/profile", auth, (req, res) => UserController.updateProfile(req, res));

module.exports = router;
