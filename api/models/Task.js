const mongoose = require("mongoose");

/**
 * Task schema definition.
 *
 * Represents tasks created by users in the application.
 *
 * Includes title, detail, date/time, status, and user reference.
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
     */
    datetime: { type: Date, required: true },

    /**
     * Status of the task: pending, in-progress, or done.
     */
    status: { type: String, enum: ['pending', 'in-progress', 'done'], default: "pending" },

    /**
     * Reference to the user who owns the task.
     */
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  {
    /**
     * Adds `createdAt` and `updatedAt` automatically.
     */
    timestamps: true
  }
);

/**
 * Mongoose model for the Task collection.
 */
module.exports = mongoose.model('Task', TaskSchema);