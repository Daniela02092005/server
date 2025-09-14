import { http } from '../api/http.js';

/**
 * Register a new user in the system.
 *
 * Sends a POST request to the backend API (`/api/v1/auth/register`)
 * with the provided username, email, and password.
 *
 * @async
 * @function registerUser
 * @param {Object} params - User registration data.
 * @param {string} params.username - The username of the new user.
 * @param {string} params.email - The email of the new user.
 * @param {string} params.password - The password of the new user.
 * @returns {Promise<Object>} The created user object returned by the API.
 * @throws {Error} If the API responds with an error status or message.
 */
export async function registerUser({ username, email, password }) {
  return http.post('/api/v1/auth/register', { username, email, password });
}

/**
 * Log in a user.
 *
 * Sends a POST request to the backend API (`/api/v1/auth/login`)
 * with the provided email and password.
 *
 * @async
 * @function loginUser
 * @param {Object} params - User login data.
 * @param {string} params.email - The email of the user.
 * @param {string} params.password - The password of the user.
 * @returns {Promise<Object>} An object containing the authentication token and user details.
 * @throws {Error} If the API responds with an error status or message.
 */
export async function loginUser({ email, password }) {
  return http.post('/api/v1/auth/login', { email, password });
}

/**
 * Initiate password recovery for a user.
 *
 * Sends a POST request to the backend API (`/api/v1/auth/recover`)
 * with the provided email.
 *
 * @async
 * @function recoverPassword
 * @param {Object} params - Password recovery data.
 * @param {string} params.email - The email of the user requesting recovery.
 * @returns {Promise<Object>} A message indicating the recovery process has started.
 * @throws {Error} If the API responds with an error status or message.
 */
export async function recoverPassword({ email }) {
  return http.post('/api/v1/auth/recover', { email });
}

// You might want to add a logout function here as well
export function logoutUser() {
  localStorage.removeItem('token');
  // Optionally, make a backend call to invalidate the token if your backend supports it
  // http.post('/api/v1/auth/logout');
}