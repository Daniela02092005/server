//Creamos el esquema de las tareas
const mongoose = require("mongoose");

/**
 * Task schema definition.
 * Definición del esquema de tareas.
 *
 * Represents tasks created by users in the application.
 * Representa las tareas creadas por los usuarios en la aplicación.
 *
 * Includes title, detail, date/time, status, and user reference.
 * Incluye título, detalle, fecha/hora, estado y referencia al usuario.
 */
const TaskSchema = new mongoose.Schema(
  {
    /**
     * Title of the task.
     * Título de la tarea.
     */
    title: { type: String, required: true },

    /**
     * Detailed description of the task (optional).
     * Descripción detallada de la tarea (opcional).
     */
    detail: { type: String },

    /**
     * Date and time of the task.
     * Fecha y hora de la tarea.
     */
    datetime: { type: Date, required: true },

    /**
     * Status of the task: pending, in-progress, or done.
     * Estado de la tarea: pendiente, en progreso o completada.
     */
    status: { type: String, enum: ['pending', 'in-progress', 'done'], default: "pending" },

    /**
     * Reference to the user who owns the task.
     * Referencia al usuario dueño de la tarea.
     */
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  {
    /**
     * Adds `createdAt` and `updatedAt` automatically.
     * Añade `createdAt` y `updatedAt` automáticamente.
     */
    timestamps: true
  }
);

/**
 * Mongoose model for the Task collection.
 * Modelo Mongoose para la colección Task.
 */
module.exports = mongoose.model('Task', TaskSchema);