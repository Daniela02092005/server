//Creacion del controlador tareas
const GlobalController = require("./GlobalController");
const TaskDAO = require("../dao/TaskDAO");

/**
 * Controller class for managing Task resources.
 * Clase controladora para gestionar recursos de Tareas.
 *
 * Extends the generic {@link GlobalController} to inherit CRUD operations,
 * and overrides specific methods to ensure tasks are always associated
 * with the authenticated user.
 *
 * Extiende el {@link GlobalController} genérico para heredar operaciones CRUD,
 * y sobreescribe métodos específicos para asegurar que las tareas siempre estén
 * asociadas al usuario autenticado.
 */
class TaskController extends GlobalController {
  /**
   * Create a new TaskController instance.
   * Crear una nueva instancia de TaskController.
   *
   * The constructor passes the TaskDAO to the parent class so that
   * all inherited methods (create, read, update, delete, getAll)
   * operate on the Task model.
   *
   * El constructor pasa el TaskDAO a la clase padre para que todos
   * los métodos heredados operen sobre el modelo de tareas.
   */
  constructor() {
    super(TaskDAO);
  }

  /**
   * Create a new task for the authenticated user.
   * Crear una nueva tarea para el usuario autenticado.
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
   * Obtener todas las tareas del usuario autenticado.
   */
  async getAll(req, res) {
    try {
      if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
      const tasks = await this.dao.getUserTasks(req.userId);
      res.status(200).json(tasks);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  /**
   * Get a specific task if it belongs to the user.
   * Obtener una tarea específica si pertenece al usuario.
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
   * Actualizar una tarea si pertenece al usuario.
   */
  async update(req, res) {
    try {
      if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
      console.log('Update request body:', req.body);
      console.log('Updating task ID:', req.params.id, 'for user:', req.userId);
      const updatedTask = await this.dao.updateTask(req.params.id, req.body, req.userId);
      console.log('Updated task:', updatedTask);
      res.status(200).json(updatedTask);
    } catch (error) {
      console.error('Error in update:', error);
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Delete a task if it belongs to the user.
   * Eliminar una tarea si pertenece al usuario.
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
 * Exportar una instancia única de TaskController.
 *
 * This allows reuse across routes without creating multiple instances.
 * Esto permite reutilizarlo en las rutas sin crear múltiples instancias.
 */
module.exports = new TaskController();
