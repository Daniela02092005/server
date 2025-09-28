/**
 * Generic global controller class providing common CRUD operations.
 */

class GlobalController {
  /**
   * Create a new GlobalController.
   */
  constructor(dao) {
    this.dao = dao;
  }

  /**
   * Create a new document in the database.
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
 */
module.exports = GlobalController;
