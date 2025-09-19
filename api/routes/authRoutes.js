// Rutas de autenticación / Authentication routes
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

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
 * Recover account (reset password request)
 * Recuperar cuenta (solicitud de restablecimiento de contraseña)
 */
router.post("/recover", (req, res) => UserController.recover(req, res));

/**
 * Export authentication router
 * Exportar enrutador de autenticación
 */
module.exports = router;
