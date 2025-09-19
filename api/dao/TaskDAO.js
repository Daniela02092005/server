/* The commented section in the code is importing necessary modules and classes for the TaskDAO class.
Specifically, it is importing the GlobalDAO class from the "./GlobalDAO" file and the Task model
from the "../models/Task" file. These imports are essential for the TaskDAO class to extend the
GlobalDAO class and work with the Task model. */
//creemos la clase que hereda a GlobalDAO y importa el modelo de task
const GlobalDAO = require("./GlobalDAO");
const Task = require("../models/Task");

/* The TaskDAO class extends GlobalDAO and initializes a constructor that calls the constructor of the
Task class. */
class TaskDAO extends GlobalDAO {
  /**
   * The above function is a constructor that calls the constructor of the Task class.
   */
  constructor() {
    super(Task);
  }

  // Aqui poner lo necesario para las tareas a futuro, por ahora solo importa lo del usuario
}

/* The `module.exports` statement in JavaScript is used to export a module as a single object or
function. In this specific code snippet, `module.exports = new TaskDAO();` is exporting an instance
of the `TaskDAO` class as a module. */
//Exportar
module.exports = new TaskDAO();
