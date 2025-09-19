// Task Data Access Object / Objeto de Acceso a Datos para Tareas
//creemos la clase que hereda a GlobalDAO y importa el modelo de task
const GlobalDAO = require("./GlobalDAO");
const Task = require("../models/Task");

/**
 * Data Access Object (DAO) for the Task model.
 * DAO de Acceso a Datos para el modelo Task.
 *
 * Extends the generic {@link GlobalDAO} class to provide
 * operations specifically for Task documents.
 * Extiende la clase genérica {@link GlobalDAO} para operaciones
 * específicas de documentos de tareas.
 */
class TaskDAO extends GlobalDAO {
  /**
   * Create a new TaskDAO instance
   * Crear una nueva instancia de TaskDAO
   */
  constructor() {
    super(Task);
  }

  /**
   * Create a new task assigned to a user
   * Crear una nueva tarea asignada a un usuario
   *
   * @param {Object} data - Task data / Datos de la tarea
   * @param {string} userId - ID of the user creating the task / ID del usuario que crea la tarea
   * @returns {Promise<Object>} The created task / La tarea creada
   */
  async createTask(data, userId) {
    try {
      const task = await this.create({ ...data, user: userId });
      return task;
    } catch (error) {
      throw new Error(`Error creating task / Error creando tarea: ${error.message}`);
    }
  }

  /**
   * Get all tasks for a specific user
   * Obtener todas las tareas de un usuario específico
   *
   * @param {string} userId - ID of the user / ID del usuario
   * @returns {Promise<Array>} List of tasks / Lista de tareas
   */
  async getUserTasks(userId) {
    try {
      return await this.model.find({ user: userId });
    } catch (error) {
      throw new Error(`Error getting user tasks / Error obteniendo tareas del usuario: ${error.message}`);
    }
  }

  /**
   * Update a task if it belongs to the user
   * Actualizar una tarea si pertenece al usuario
   *
   * @param {string} taskId - ID of the task / ID de la tarea
   * @param {Object} updateData - Data to update / Datos a actualizar
   * @param {string} userId - ID of the user / ID del usuario
   * @returns {Promise<Object>} Updated task / Tarea actualizada
   */
  async updateTask(taskId, updateData, userId) {
    try {
      const updated = await this.model.findOneAndUpdate(
        { _id: taskId, user: userId }, // only update if task belongs to user / solo actualizar si la tarea pertenece al usuario
        updateData,
        { new: true, runValidators: true }
      );
      if (!updated) throw new Error("Task not found or not authorized / Tarea no encontrada o no autorizada");
      return updated;
    } catch (error) {
      throw new Error(`Error updating task / Error actualizando tarea: ${error.message}`);
    }
  }

  /**
   * Delete a task if it belongs to the user
   * Eliminar una tarea si pertenece al usuario
   *
   * @param {string} taskId - ID of the task / ID de la tarea
   * @param {string} userId - ID of the user / ID del usuario
   * @returns {Promise<Object>} Deleted task / Tarea eliminada
   */
  async deleteTask(taskId, userId) {
    try {
      const deleted = await this.model.findOneAndDelete({ _id: taskId, user: userId });
      if (!deleted) throw new Error("Task not found or not authorized / Tarea no encontrada o no autorizada");
      return deleted;
    } catch (error) {
      throw new Error(`Error deleting task / Error eliminando tarea: ${error.message}`);
    }
  }
}

/**
 * Export singleton instance of TaskDAO
 * Exportar instancia única de TaskDAO
 */
module.exports = new TaskDAO();
