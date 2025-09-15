/* The lines `const GlobalController = require("./GlobalController");` and `const TaskDAO =
require("../dao/TaskDAO");` are importing external modules into the current file. */
const GlobalController = require("./GlobalController");
const TaskDAO = require("../dao/TaskDAO");

/* The `TaskController` class manages CRUD operations for tasks associated with authenticated users. */
class TaskController extends GlobalController {
  /**
   * The constructor function initializes an object with TaskDAO as its superclass.
   */
  constructor() {
    super(TaskDAO);
  }

 /* The `create` method in the `TaskController` class is responsible for creating a new task. Here's a
 breakdown of what the method does: */
  // Create
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

  /* The `getAll` method in the `TaskController` class is responsible for retrieving all tasks
  associated with the authenticated user. Here's a breakdown of what the method does: */
  // getAll
  async getAll(req, res) {
    try {
      if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
      const filter = { userId: req.userId }; // Filter tasks by the authenticated user's ID
      const tasks = await this.dao.getAll(filter);
      res.status(200).json(tasks);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

 /* The `read` method in the `TaskController` class is responsible for handling the retrieval of a
 specific task based on the provided task ID. Here is a breakdown of what the method does: */
  // Read
  async read(req, res) {
    try {
      if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
      const item = await this.dao.read(req.params.id);
      if (!item || item.userId.toString() !== req.userId) {
        return res.status(404).json({ message: "Task not found or unauthorized" });
      }
      res.status(200).json(item);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  /* The `update` method in the `TaskController` class is responsible for handling the updating of a
  task. Here is a breakdown of what the method does: */
  // Update
  async update(req, res) {
    try {
      if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
      const existingTask = await this.dao.read(req.params.id);
      if (!existingTask || existingTask.userId.toString() !== req.userId) {
        return res.status(404).json({ message: "Task not found or unauthorized" });
      }
      // Ensure userId is not updated
      const updateData = { ...req.body };
      delete updateData.userId;
      const item = await this.dao.update(req.params.id, updateData);
      res.status(200).json(item);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /* The `delete` method in the `TaskController` class is responsible for handling the deletion of a
  task. Here is a breakdown of what the method does: */
  // Delete
  async delete(req, res) {
    try {
      if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
      const existingTask = await this.dao.read(req.params.id);
      if (!existingTask || existingTask.userId.toString() !== req.userId) {
        return res.status(404).json({ message: "Task not found or unauthorized" });
      }
      const item = await this.dao.delete(req.params.id);
      res.status(200).json(item);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

//Exportar
/* `module.exports = new TaskController();` is exporting an instance of the `TaskController` class.
This allows other parts of the codebase to import and use this instance of the `TaskController`
class, which provides access to the methods defined within the class such as create, getAll, read,
update, and delete for handling tasks in the application. */
module.exports = new TaskController();
