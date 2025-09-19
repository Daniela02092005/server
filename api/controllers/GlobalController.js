/**
 * Generic global controller class providing common CRUD operations.
 * Clase controladora global genérica que proporciona operaciones CRUD comunes.
 *
 * It delegates the actual database logic to a corresponding DAO (Data Access Object).
 * Delega la lógica real de base de datos a un DAO (Objeto de Acceso a Datos) correspondiente.
 */
//Creamos un Controlador Global
class GlobalController {
  /**
   * Create a new GlobalController.
   * Crear un nuevo GlobalController.
   *
   * @param {object} dao - The DAO instance used to interact with the database.
   *                       La instancia de DAO usada para interactuar con la base de datos.
   */
  constructor(dao) {
    this.dao = dao;
  }

  /**
   * Create a new document in the database.
   * Crear un nuevo documento en la base de datos.
   *
   * @async
   * @param {import('express').Request} req - Express request object containing the data in `req.body`.
   *                                          Objeto de solicitud de Express con los datos en `req.body`.
   * @param {import('express').Response} res - Express response object.
   *                                           Objeto de respuesta de Express.
   * @returns {Promise<void>} Sends status 201 with the created document, or 400 on error.
   *                          Envía estado 201 con el documento creado, o 400 en caso de error.
   */
  async create(req, res) {
    try {
      const item = await this.dao.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Retrieve all documents, optionally filtered by query parameters.
   * Recuperar todos los documentos, opcionalmente filtrados por parámetros de consulta.
   *
   * @async
   * @param {import('express').Request} req - Express request object (filters in `req.query`).
   *                                          Objeto de solicitud de Express (filtros en `req.query`).
   * @param {import('express').Response} res - Express response object.
   *                                           Objeto de respuesta de Express.
   * @returns {Promise<void>} Sends status 200 with the array of documents, or 400 on error.
   *                          Envía estado 200 con el arreglo de documentos, o 400 en caso de error.
   */
  async getAll(req, res) {
    try {
      const items = await this.dao.getAll(req.query);
      res.status(200).json(items);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Retrieve a document by ID.
   * Recuperar un documento por ID.
   *
   * @async
   * @param {import('express').Request} req - Express request object with `req.params.id`.
   *                                          Objeto de solicitud de Express con `req.params.id`.
   * @param {import('express').Response} res - Express response object.
   *                                           Objeto de respuesta de Express.
   * @returns {Promise<void>} Sends status 200 with the document, or 404 if not found.
   *                          Envía estado 200 con el documento, o 404 si no se encuentra.
   */
  async read(req, res) {
    try {
      const item = await this.dao.read(req.params.id);
      res.status(200).json(item);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  /**
   * Update an existing document by ID.
   * Actualizar un documento existente por ID.
   *
   * @async
   * @param {import('express').Request} req - Express request object with `req.params.id` and update data in `req.body`.
   *                                          Objeto de solicitud de Express con `req.params.id` y los datos de actualización en `req.body`.
   * @param {import('express').Response} res - Express response object.
   *                                           Objeto de respuesta de Express.
   * @returns {Promise<void>} Sends status 200 with the updated document, or 400 on validation error.
   *                          Envía estado 200 con el documento actualizado, o 400 en caso de error de validación.
   */
  async update(req, res) {
    try {
      const item = await this.dao.update(req.params.id, req.body);
      res.status(200).json(item);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Delete a document by ID.
   * Eliminar un documento por ID.
   *
   * @async
   * @param {import('express').Request} req - Express request object with `req.params.id`.
   *                                          Objeto de solicitud de Express con `req.params.id`.
   * @param {import('express').Response} res - Express response object.
   *                                           Objeto de respuesta de Express.
   * @returns {Promise<void>} Sends status 200 with the deleted document, or 404 if not found.
   *                          Envía estado 200 con el documento eliminado, o 404 si no se encuentra.
   */
  async delete(req, res) {
    try {
      const item = await this.dao.delete(req.params.id);
      res.status(200).json(item);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

/**
 * Export GlobalController class
 * Exportar clase GlobalController
 */
module.exports = GlobalController;
