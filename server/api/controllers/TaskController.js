//Creacion de el controlador task- hereda GlobalController
const GlobalController = require("./GlobalController");
const TaskDAO = require("../dao/TaskDAO");

class TaskController extends GlobalController {
  constructor() {
    super(TaskDAO);
  }

  // override create to attach userId from auth middleware
  async create(req, res) {
    try {
      if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
      const data = { ...req.body, userId: req.userId };
      const task = await this.dao.create(data);
      res.status(201).json(task);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // override getAll to return user's tasks
  async getAll(req, res) {
    try {
      const filter = req.userId ? { userId: req.userId } : {};
      const tasks = await this.dao.getAll(filter);
      res.status(200).json(tasks);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

//Exportar
module.exports = new TaskController();
