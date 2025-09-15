/* The GlobalController class is a controller that handles CRUD operations for items using a Data
Access Object (DAO) for database operations. */
//Creamos un controlador global
class GlobalController {
  /**
   * The constructor function initializes an object with a dao property.
   * @param dao - Data Access Object (DAO) instance that will be used for database operations.
   */
  constructor(dao) {
    this.dao = dao;
  }

  /* The `create` method in the `GlobalController` class is handling the creation of a new item. Here's
  a breakdown of what the method is doing: */
  //Create
  async create(req, res) {
    try {
      const item = await this.dao.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /* The `getAll` method in the `GlobalController` class is handling the retrieval of all items using
  the DAO (Data Access Object) associated with the controller. Here's a breakdown of what the method
  is doing: */
  //GetAll
  async getAll(req, res) {
    try {
      const items = await this.dao.getAll(req.query);
      res.status(200).json(items);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

 /* The `read` method in the `GlobalController` class is handling the retrieval of a specific item by
 its ID using the DAO (Data Access Object) associated with the controller. Here's a breakdown of
 what the method is doing: */
  //Read
  async read(req, res) {
    try {
      const item = await this.dao.read(req.params.id);
      res.status(200).json(item);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

 /* The `update` method in the `GlobalController` class is handling the updating of an item using the
 DAO (Data Access Object) associated with the controller. Here's a breakdown of what the method is
 doing: */
  //Update
  async update(req, res) {
    try {
      const item = await this.dao.update(req.params.id, req.body);
      res.status(200).json(item);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /* The `delete` method in the GlobalController class is handling the deletion of an item using the
  DAO (Data Access Object) associated with the controller. Here's a breakdown of what the method is
  doing: */
  //Delete
  async delete(req, res) {
    try {
      const item = await this.dao.delete(req.params.id);
      res.status(200).json(item);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

//Exportar
/* `module.exports = GlobalController;` is exporting the `GlobalController` class so that it can be
imported and used in other files within the JavaScript application. This allows other modules or
files to access and utilize the functionality provided by the `GlobalController` class. */
module.exports = GlobalController;
