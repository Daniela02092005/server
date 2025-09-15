//Crear Constructor de dao
/* The `GlobalDAO` class is a JavaScript constructor that provides methods for creating, reading,
updating, deleting, and retrieving documents from a database. */
class GlobalDAO {
  /**
   * The above function is a JavaScript constructor that initializes an object with a model property.
   * @param model - The `model` parameter in the constructor function is used to initialize and store
   * the model value for the object being created.
   */
  constructor(model) {
    this.model = model;
  }

  /* The `create` method in the `GlobalDAO` class is a function that is responsible for creating a new
  document in the database. Here's a breakdown of what it does: */
  //Create
  async create(data) {
    try {
      const doc = new this.model(data);
      return await doc.save();
    } catch (error) {
      throw new Error(`Error creating document: ${error.message}`);
    }
  }

  /* The `read` method in the `GlobalDAO` class is a function that retrieves a document from the
  database based on the provided `id`. Here's a breakdown of what it does: */
  //Read
  async read(id) {
    try {
      const doc = await this.model.findById(id);
      if (!doc) throw new Error("Document not found");
      return doc;
    } catch (error) {
      throw new Error(`Error getting document by ID: ${error.message}`);
    }
  }

  /* The `update` method in the `GlobalDAO` class is a function that updates a document in the database
  based on the provided `id` and `updateData`. Here's a breakdown of what it does: */
  //Update
  async update(id, updateData) {
    try {
      const updated = await this.model.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
      if (!updated) throw new Error("Document not found");
      return updated;
    } catch (error) {
      throw new Error(`Error updating document: ${error.message}`);
    }
  }

  /* The `delete` method in the `GlobalDAO` class is a function that deletes a document from the
  database based on the provided `id`. Here's a breakdown of what it does: */
  //Delete
  async delete(id) {
    try {
      const deleted = await this.model.findByIdAndDelete(id);
      if (!deleted) throw new Error("Document not found");
      return deleted;
    } catch (error) {
      throw new Error(`Error deleting document: ${error.message}`);
    }
  }

 /* The `getAll` method in the `GlobalDAO` class is a function that retrieves all documents from the
 database based on an optional filter. Here's a breakdown of what it does: */
  //GetAll
  async getAll(filter = {}) {
    try {
      return await this.model.find(filter);
    } catch (error) {
      throw new Error(`Error getting documents: ${error.message}`);
    }
  }
}

/* The `//Exportar DAO` comment is indicating that the following line `module.exports = GlobalDAO;` is
exporting the `GlobalDAO` class so that it can be used in other files/modules. By exporting the
`GlobalDAO` class, other files can import and use this class to interact with the database using the
defined CRUD operations. */
//Exportar DAO
module.exports = GlobalDAO;
