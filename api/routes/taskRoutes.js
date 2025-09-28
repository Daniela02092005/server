const express = require("express");
const router = express.Router();
const TaskController = require("../controllers/TaskController");
const auth = require("../middlewares/auth");

/**
 * Create a new task
 */
router.post("/", auth, (req, res) => TaskController.create(req, res));

/**
 * Get all tasks
 */
router.get("/", auth, (req, res) => TaskController.getAll(req, res));

/**
 * Get a task by ID
 */
router.get("/:id", auth, (req, res) => TaskController.read(req, res));

/**
 * Update a task by ID
 */
router.put("/:id", auth, (req, res) => TaskController.update(req, res));

/**
 * Delete a task by ID
 */
router.delete("/:id", auth, (req, res) => TaskController.delete(req, res));

/**
 * Export task router
 */
module.exports = router;
