// Task Data Access Object 
const GlobalDAO = require("./GlobalDAO");
const Task = require("../models/Task");

/**
 * Data Access Object (DAO) for the Task model.
 */
class TaskDAO extends GlobalDAO {
  /**
   * Create a new TaskDAO instance
   */
  constructor() {
    super(Task);
  }

  /**
   * Create a new task assigned to a user
   */
  async createTask(data, userId) {
    try {
      
      let normalizedStatus = data.status || 'pending';
      if (data.status !== undefined) {
        const legacyMap = {
          'por-hacer': 'pending',
          'por hacer': 'pending',
          'todo': 'pending',
          'en-progreso': 'in-progress',
          'en progreso': 'in-progress',
          'doing': 'in-progress',
          'hecho': 'done',
          'completed': 'done',
          null: 'pending',
          undefined: 'pending'
        };
        const lowerStatus = (data.status || '').toString().toLowerCase().trim();
        normalizedStatus = legacyMap[lowerStatus] || data.status;
        if (!['pending', 'in-progress', 'done'].includes(normalizedStatus)) {
          throw new Error('Invalid status on creation. Must be: pending, in-progress, or done / Estado inválido en creación. Debe ser: pending, in-progress o done');
        }
      }

      const taskData = {
        ...data,
        user: userId,
        status: normalizedStatus,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const task = await this.create(taskData);
      console.log(`Task created for user ${userId}. ID: ${task._id}, Status: ${task.status}`);

      return task;
    } catch (error) {
      console.error('Error in TaskDAO.createTask:', error);
      if (error.name === 'ValidationError') {
        console.error('Validation details:', error.errors);
      }
      throw new Error(`Error creating task / Error creando tarea: ${error.message}`);
    }
  }

  /**
   * Get all tasks for a specific user
   */
  async getUserTasks(userId) {
    try {
      return await this.model.find({ user: userId }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error in TaskDAO.getUser Tasks:', error);
      throw new Error(`Error getting user tasks / Error obteniendo tareas del usuario: ${error.message}`);
    }
  }

  /**
   * Update a task if it belongs to the user
   */
  async updateTask(taskId, updateData, userId) {
    try {
      if (updateData.status !== undefined) {
        const legacyMap = {
          'por-hacer': 'pending',
          'por hacer': 'pending',
          'todo': 'pending',
          'en-progreso': 'in-progress',
          'en progreso': 'in-progress',
          'doing': 'in-progress',
          'hecho': 'done',
          'completed': 'done',
          null: 'pending',
          undefined: 'pending'
        };
        const lowerStatus = (updateData.status || '').toString().toLowerCase().trim();
        updateData.status = legacyMap[lowerStatus] || updateData.status;

        if (!['pending', 'in-progress', 'done'].includes(updateData.status)) {
          throw new Error('Invalid status after mapping. Must be: pending, in-progress, or done / Estado inválido después del mapeo. Debe ser: pending, in-progress o done');
        }
      }

      const updateWithTimestamp = {
        ...updateData,
        updatedAt: new Date()
      };

      const updated = await this.model.findOneAndUpdate(
        { _id: taskId, user: userId },
        updateWithTimestamp,
        { new: true, runValidators: true }
      );

      if (!updated) {
        throw new Error("Task not found or not authorized / Tarea no encontrada o no autorizada");
      }

      console.log(`Task ${taskId} updated for user ${userId}. New status: ${updated.status}`);

      return updated;
    } catch (error) {
      console.error('Error in TaskDAO.updateTask:', error);
      if (error.name === 'ValidationError') {
        console.error('Validation details:', error.errors);
        throw new Error(`Validation error: ${error.message} / Error de validación: ${error.message}`);
      }
      throw new Error(`Error updating task / Error actualizando tarea: ${error.message}`);
    }
  }

  /**
   * Delete a task if it belongs to the user
   */
  async deleteTask(taskId, userId) {
    try {
      const deleted = await this.model.findOneAndDelete({ _id: taskId, user: userId });
      if (!deleted) {
        throw new Error("Task not found or not authorized / Tarea no encontrada o no autorizada");
      }
      console.log(`Task ${taskId} deleted for user ${userId}`);

      return deleted;
    } catch (error) {
      console.error('Error in TaskDAO.deleteTask:', error);
      throw new Error(`Error deleting task / Error eliminando tarea: ${error.message}`);
    }
  }
}

/**
 * Export singleton instance of TaskDAO
 */
module.exports = new TaskDAO();
