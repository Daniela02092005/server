/* The code `//creamos el esquema de las tareas` is a comment written in Spanish, which translates to
"we create the tasks schema" in English. It is indicating that the following code is defining the
schema for tasks in a MongoDB database using Mongoose, a MongoDB object modeling tool designed to
work in an asynchronous environment. */
//creamos el esquema de las tareas
const mongoose = require("mongoose");

/* This code snippet is defining a Mongoose schema for tasks in a MongoDB database. Let's break down
what each part of the schema is doing: */
const TaskSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  detail:   { type: String },
  datetime: { type: Date },
  status:   { type: String, enum: ["pending", "done"], default: "pending" },
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User" } // Changed "User " to "User"
}, { timestamps: true });

/* `module.exports = mongoose.model("Task", TaskSchema);` is exporting a Mongoose model named "Task"
based on the TaskSchema defined earlier. This line of code allows other parts of the application to
import and use the "Task" model to interact with the MongoDB database collection that stores tasks.
The model will have properties defined in the TaskSchema, such as title, detail, datetime, status,
and userId, along with timestamps for createdAt and updatedAt. */
module.exports = mongoose.model("Task", TaskSchema);
