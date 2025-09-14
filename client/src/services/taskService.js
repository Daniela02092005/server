import { http } from '../api/http.js';

/**
 * Helper to get authorization headers.
 * @returns {Object} Headers object with Authorization token if available.
 */
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Create a new task.
 *
 * @async
 * @param {Object} taskData - The task data (title, detail, status, datetime).
 * @param {string} token - The authentication token.
 * @returns {Promise<Object>} The created task object.
 * @throws {Error} If the API responds with an error.
 */
export async function createTask(taskData, token) {
  return http.post('/api/v1/tasks', taskData, { headers: getAuthHeaders() });
}

/**
 * Get all tasks for the authenticated user.
 *
 * @async
 * @param {string} token - The authentication token.
 * @returns {Promise<Array<Object>>} An array of task objects.
 * @throws {Error} If the API responds with an error.
 */
export async function getTasks(token) {
  return http.get('/api/v1/tasks', { headers: getAuthHeaders() });
}

/**
 * Get a single task by its ID.
 *
 * @async
 * @param {string} taskId - The ID of the task to retrieve.
 * @param {string} token - The authentication token.
 * @returns {Promise<Object>} The task object.
 * @throws {Error} If the API responds with an error.
 */
export async function getTaskById(taskId, token) {
  return http.get(`/api/v1/tasks/${taskId}`, { headers: getAuthHeaders() });
}

/**
 * Update an existing task.
 *
 * @async
 * @param {string} taskId - The ID of the task to update.
 * @param {Object} taskData - The updated task data.
 * @param {string} token - The authentication token.
 * @returns {Promise<Object>} The updated task object.
 * @throws {Error} If the API responds with an error.
 */
export async function updateTask(taskId, taskData, token) {
  return http.put(`/api/v1/tasks/${taskId}`, taskData, { headers: getAuthHeaders() });
}

/**
 * Delete a task.
 *
 * @async
 * @param {string} taskId - The ID of the task to delete.
 * @param {string} token - The authentication token.
 * @returns {Promise<Object>} A confirmation message or the deleted task object.
 * @throws {Error} If the API responds with an error.
 */
export async function deleteTask(taskId, token) {
  return http.del(`/api/v1/tasks/${taskId}`, { headers: getAuthHeaders() });
}
