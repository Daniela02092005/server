/**
 * Generic Data Access Object (DAO) class.
 */
class GlobalDAO {
  /**
   * Create a new GlobalDAO.
   */
  constructor(model) {
    this.model = model;
  }

  /**
   * Create and persist a new document.
   */
  async create(data) {
    try {
      const doc = new this.model(data); 
      return await doc.save();
    } catch (error) {
      throw new Error(`Error creating document / Error creando documento: ${error.message}`);
    }
  }

  /**
   * Find a document by its ID.
   */
  async read(id) {
    try {
      const doc = await this.model.findById(id);
      if (!doc) throw new Error("Document not found / Documento no encontrado");
      return doc;
    } catch (error) {
      throw new Error(`Error getting document by ID / Error obteniendo documento por ID: ${error.message}`);
    }
  }

  /**
   * Update a document by ID.
   */
  async update(id, updateData) {
    try {
      const updated = await this.model.findByIdAndUpdate( 
        id,
        updateData,
        { new: true, runValidators: true }
      );
      if (!updated) throw new Error("Document not found / Documento no encontrado");
      return updated;
    } catch (error) {
      throw new Error(`Error updating document / Error actualizando documento: ${error.message}`);
    }
  }

  /**
   * Delete a document by ID.
   */
  async delete(id) {
    try {
      const deleted = await this.model.findByIdAndDelete(id); 
      if (!deleted) throw new Error("Document not found / Documento no encontrado");
      return deleted;
    } catch (error) {
      throw new Error(`Error deleting document / Error eliminando documento: ${error.message}`);
    }
  }

  /**
   * Retrieve all documents matching the given filter.
   */
  async getAll(filter = {}) {
    try {
      return await this.model.find(filter);
    } catch (error) {
      throw new Error(`Error getting documents / Error obteniendo documentos: ${error.message}`);
    }
  }
}

/**
 * Export the DAO class so it can be used by specific DAOs.
 */
module.exports = GlobalDAO;
