const express = require("express");
const router = express.Router();
const TaskController = require("../controllers/TaskController");
const auth = require("../middlewares/auth");

/**
 * Create a new task
 * Crear una nueva tarea
 */
router.post("/", auth, (req, res) => TaskController.create(req, res));

/**
 * Get all tasks
 * Obtener todas las tareas
 */
router.get("/", auth, (req, res) => TaskController.getAll(req, res));

/**
 * Get a task by ID
 * Obtener una tarea por ID
 */
router.get("/:id", auth, (req, res) => TaskController.read(req, res));

/**
 * Update a task by ID
 * Actualizar una tarea por ID
 */
router.put("/:id", auth, (req, res) => TaskController.update(req, res));

/**
 * Delete a task by ID
 * Eliminar una tarea por ID
 */
router.delete("/:id", auth, (req, res) => TaskController.delete(req, res));

/**
 * Export task router
 * Exportar enrutador de tareas
 */
module.exports = router;
