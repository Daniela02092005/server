//importemos a express, y creamos un enrutador aislado
const express = require("express");
const router = express.Router();
const TaskController = require("../controllers/TaskController");
const auth = require("../middlewares/auth");

// Definir rutas
router.post("/", auth, (req, res) => TaskController.create(req, res));
router.get("/", auth, (req, res) => TaskController.getAll(req, res));
router.get("/:id", auth, (req, res) => TaskController.read(req, res)); // Added read route
router.put("/:id", auth, (req, res) => TaskController.update(req, res)); // Added update route
router.delete("/:id", auth, (req, res) => TaskController.delete(req, res)); // Added delete route

//Exportar el enrutador
module.exports = router;

