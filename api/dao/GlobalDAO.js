/**
 * Generic Data Access Object (DAO) class.
 * Clase Genérica de Acceso a Datos (DAO).
 *
 * Provides reusable CRUD operations for any Mongoose model.
 * Proporciona operaciones CRUD reutilizables para cualquier modelo de Mongoose.
 *
 * Specific DAOs (e.g., UserDAO, TaskDAO) should extend this class
 * DAOs específicos (ej: UserDAO, TaskDAO) deben extender esta clase
 * and inject their model via the constructor.
 * e inyectar su modelo a través del constructor.
 */
class GlobalDAO {
  /**
   * Create a new GlobalDAO.
   * Crear un nuevo GlobalDAO.
   * @param {import("mongoose").Model} model - The Mongoose model to operate on.
   *                                           El modelo de Mongoose con el que operar.
   */
  constructor(model) {
    this.model = model;
  }

  /**
   * Create and persist a new document.
   * Crear y guardar un nuevo documento.
   * @async
   * @param {Object} data - The data used to create the document.
   *                        Los datos usados para crear el documento.
   * @returns {Promise<Object>} The created document. / El documento creado.
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
   * Buscar un documento por su ID.
   * @async
   * @param {string} id - The document's unique identifier.
   *                      El identificador único del documento.
   * @returns {Promise<Object>} The found document. / El documento encontrado.
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
   * Actualizar un documento por su ID.
   * @async
   * @param {string} id - The document's unique identifier.
   *                      El identificador único del documento.
   * @param {Object} updateData - The data to update the document with.
   *                              Los datos para actualizar el documento.
   * @returns {Promise<Object>} The updated document. / El documento actualizado.
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
   * Eliminar un documento por su ID.
   * @async
   * @param {string} id - The document's unique identifier.
   *                      El identificador único del documento.
   * @returns {Promise<Object>} The deleted document. / El documento eliminado.
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
   * Recuperar todos los documentos que coincidan con el filtro dado.
   * @async
   * @param {Object} [filter={}] - Optional MongoDB filter object.
   *                               Objeto de filtro de MongoDB opcional.
   * @returns {Promise<Array>} An array of matching documents. 
   *                           Un arreglo con los documentos encontrados.
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
 * Exportar la clase DAO para que pueda ser usada por DAOs específicos.
 *
 * Example / Ejemplo:
 *   const UserDAO = new GlobalDAO(UserModel);
 */
module.exports = GlobalDAO;
