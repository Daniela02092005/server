// Rutas de autenticación / Authentication routes
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const authMiddleware = require("../middlewares/auth"); // Middleware de autenticación

// Authentication-related routes / Rutas relacionadas con autenticación

/**
 * Register a new user
 * Registrar un nuevo usuario
 */
router.post("/register", (req, res) => UserController.register(req, res));

/**
 * Login user and return token
 * Iniciar sesión de usuario y devolver token
 */
router.post("/login", (req, res) => UserController.login(req, res));

/**
 * Logout user
 * Cerrar sesión de usuario
 */
router.post("/logout", (req, res) => UserController.logout(req, res));

/**
 * Recover account (start password reset process)
 * Recuperar cuenta (iniciar proceso de restablecimiento de contraseña)
 */
router.post("/recover", (req, res) => UserController.recover(req, res));

/**
 * Get profile of authenticated user
 * Obtener perfil del usuario autenticado
 */
router.get("/profile", authMiddleware, (req, res) => UserController.getProfile(req, res));

/**
 * Export authentication router
 * Exportar enrutador de autenticación
 */
module.exports = router;

/**
* Reset user password
* Restablecer contraseña de usuario
*/
router.post("/reset-password", (req, res) => UserController.resetPassword(req, res));