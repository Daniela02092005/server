// Task Data Access Object / Objeto de Acceso a Datos para Tareas
const GlobalDAO = require("./GlobalDAO");
const Task = require("../models/Task");

/**
 * Data Access Object (DAO) for the Task model.
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
   */
  async createTask(data, userId) {
    try {
      // Mapeo de valores legacy para status (previene errores con datos antiguos)
      let normalizedStatus = data.status || 'pending'; // Default si no se proporciona
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

        // Validar después del mapeo
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

      // Log para depuración
      console.log(`Task created for user ${userId}. ID: ${task._id}, Status: ${task.status}`);

      return task;
    } catch (error) {
      console.error('Error in TaskDAO.createTask:', error);
      // Captura errores específicos de validación
      if (error.name === 'ValidationError') {
        console.error('Validation details:', error.errors);
      }
      throw new Error(`Error creating task / Error creando tarea: ${error.message}`);
    }
  }

  /**
   * Get all tasks for a specific user
   * Obtener todas las tareas de un usuario específico
   */
  async getUserTasks(userId) {
    try {
      return await this.model.find({ user: userId }).sort({ createdAt: -1 }); // Ordenar por más reciente (opcional, mejora UX)
    } catch (error) {
      console.error('Error in TaskDAO.getUser Tasks:', error);
      throw new Error(`Error getting user tasks / Error obteniendo tareas del usuario: ${error.message}`);
    }
  }

  /**
   * Update a task if it belongs to the user
   * Actualizar una tarea si pertenece al usuario
   */
  async updateTask(taskId, updateData, userId) {
    try {
      // Mapeo de valores legacy para status (previene errores con datos antiguos)
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

        // Validar después del mapeo
        if (!['pending', 'in-progress', 'done'].includes(updateData.status)) {
          throw new Error('Invalid status after mapping. Must be: pending, in-progress, or done / Estado inválido después del mapeo. Debe ser: pending, in-progress o done');
        }
      }

      // Preparar datos de actualización con timestamp
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

      // Log para depuración
      console.log(`Task ${taskId} updated for user ${userId}. New status: ${updated.status}`);

      return updated;
    } catch (error) {
      console.error('Error in TaskDAO.updateTask:', error);
      // Captura errores específicos de validación
      if (error.name === 'ValidationError') {
        console.error('Validation details:', error.errors);
        throw new Error(`Validation error: ${error.message} / Error de validación: ${error.message}`);
      }
      throw new Error(`Error updating task / Error actualizando tarea: ${error.message}`);
    }
  }

  /**
   * Delete a task if it belongs to the user
   * Eliminar una tarea si pertenece al usuario
   */
  async deleteTask(taskId, userId) {
    try {
      const deleted = await this.model.findOneAndDelete({ _id: taskId, user: userId });
      if (!deleted) {
        throw new Error("Task not found or not authorized / Tarea no encontrada o no autorizada");
      }

      // Log para depuración (opcional)
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
 * Exportar instancia singleton de TaskDAO
 */
module.exports = new TaskDAO();
