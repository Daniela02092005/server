//Crear Constructor de dao
class GlobalDAO {
  constructor(model) {
    this.model = model;
  }

  //Create
  async create(data) {
    try {
      const doc = new this.model(data);
      return await doc.save();
    } catch (error) {
      throw new Error(`Error creating document: ${error.message}`);
    }
  }

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

  //GetAll
  async getAll(filter = {}) {
    try {
      return await this.model.find(filter);
    } catch (error) {
      throw new Error(`Error getting documents: ${error.message}`);
    }
  }
}

//Exportar DAO
module.exports = GlobalDAO;
