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
export async function registerUser ({ username, email, password }) {
  try {
    const response = await http.post('/api/v1/auth/register', { username, email, password });
    return response;
  } catch (error) {
    // El error ya es un objeto Error con el mensaje del backend gracias a http.js
    // No necesitamos acceder a error.response.data.message
    throw error; // Simplemente relanzamos el error
  }
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


/**
 * Log out the current user.
 *
 * Removes the authentication token from localStorage.
 * Optionally, you can call the backend to invalidate the token.
 */
export function logoutUser () {
  localStorage.removeItem('token');
  // Si tu backend soporta logout, descomenta la siguiente línea:
  // http.post('/api/v1/auth/logout');
}
