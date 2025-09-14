// server/api/controllers/TaskController.js
const GlobalController = require("./GlobalController");
const TaskDAO = require("../dao/TaskDAO");

class TaskController extends GlobalController {
  constructor() {
    super(TaskDAO);
  }

  // Create
  async create(req, res) {
    try {
      if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
      const data = { ...req.body, userId: req.userId };
      const task = await this.dao.create(data);
      res.status(201).json(task);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // getAll
  async getAll(req, res) {
    try {
      if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
      const filter = { userId: req.userId }; // Filter tasks by the authenticated user's ID
      const tasks = await this.dao.getAll(filter);
      res.status(200).json(tasks);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Read
  async read(req, res) {
    try {
      if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
      const item = await this.dao.read(req.params.id);
      if (!item || item.userId.toString() !== req.userId) {
        return res.status(404).json({ message: "Task not found or unauthorized" });
      }
      res.status(200).json(item);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  // Update
  async update(req, res) {
    try {
      if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
      const existingTask = await this.dao.read(req.params.id);
      if (!existingTask || existingTask.userId.toString() !== req.userId) {
        return res.status(404).json({ message: "Task not found or unauthorized" });
      }
      // Ensure userId is not updated
      const updateData = { ...req.body };
      delete updateData.userId;
      const item = await this.dao.update(req.params.id, updateData);
      res.status(200).json(item);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Delete
  async delete(req, res) {
    try {
      if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
      const existingTask = await this.dao.read(req.params.id);
      if (!existingTask || existingTask.userId.toString() !== req.userId) {
        return res.status(404).json({ message: "Task not found or unauthorized" });
      }
      const item = await this.dao.delete(req.params.id);
      res.status(200).json(item);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

//Exportar
module.exports = new TaskController();
