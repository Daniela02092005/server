const GlobalController = require("./GlobalController");
const TaskDAO = require("../dao/TaskDAO");

/**
 * Controller class for managing Task resources.
 */
class TaskController extends GlobalController {
  /**
   * Create a new TaskController instance.
   */
  constructor() {
    super(TaskDAO);
  }

  /**
   * Create a new task for the authenticated user.
   */
  async create(req, res) {
    try {
      if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
      console.log('Create request body:', req.body);
      const task = await this.dao.createTask(req.body, req.userId);
      res.status(201).json(task);
    } catch (err) {
      console.error('Error in create:', err); // ← TEMP
      res.status(400).json({ message: err.message });
    }
  }

  /**
   * Get all tasks for the authenticated user.
   */
  async getAll(req, res) {
    try {
      if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
      console.log('DAO instance in getAll:', this.dao);
      console.log('this.dao in getAll:', this.dao);
      const tasks = await this.dao.getUserTasks(req.userId);
      res.status(200).json(tasks);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  /**
   * Get a specific task if it belongs to the user.
   */
  async read(req, res) {
    try {
      if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

      const task = await this.dao.read(req.params.id);
      if (!task || task.user.toString() !== req.userId) {
        return res.status(404).json({ message: "Task not found or unauthorized" });
      }

      res.status(200).json(task);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  /**
   * Update a task if it belongs to the user.
   */
  async update(req, res) {
    try {
      if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized / No autorizado" });
      }
      console.log('=== TASK UPDATE DEBUG ===');
      console.log('User  ID:', req.userId);
      console.log('Task ID:', req.params.id);
      console.log('Request Body:', JSON.stringify(req.body, null, 2));
      console.log('====================');
      const updatedTask = await this.dao.updateTask(req.params.id, req.body, req.userId);
      console.log('Updated Task Response:', JSON.stringify(updatedTask, null, 2));
      res.status(200).json(updatedTask);
    } catch (error) {
      console.error('Error in TaskController.update:', error);
      console.log('Error Details:', error.message);
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Delete a task if it belongs to the user.
   */
  async delete(req, res) {
    try {
      if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

      const deletedTask = await this.dao.deleteTask(req.params.id, req.userId);
      res.status(200).json(deletedTask);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

/**
 * Export a singleton instance of TaskController.
 *
 * This allows reuse across routes without creating multiple instances.
 */
module.exports = new TaskController();
