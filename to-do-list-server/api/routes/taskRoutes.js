//importemos a express, y creamos un enrutador aislado
const express = require("express");
const router = express.Router();
const TaskController = require("../controllers/TaskController");
const auth = require("../middlewares/auth");

// Definir rutas
router.post("/", auth, (req, res) => TaskController.create(req, res));
router.get("/", auth, (req, res) => TaskController.getAll(req, res));


//Exportar el enrutador 
module.exports = router;

