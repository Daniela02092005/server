//creemos la clase que hereda a GlobalDAO y importa el modelo de task
const GlobalDAO = require("./GlobalDAO");
const Task = require("../../database/models/Task");

class TaskDAO extends GlobalDAO {
  constructor() {
    super(Task);
  }

  // Aqui poner lo necesario para las tareas a futuro, por ahora solo importa lo del usuario
}

//Exportar
module.exports = new TaskDAO();
