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
    // Puedes personalizar el manejo de errores aquí
    throw new Error(error?.response?.data?.message || 'Error registering user');
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
 */
export async function loginUser ({ email, password }) {
  try {
    const response = await http.post('/api/v1/auth/login', { email, password });
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.message || 'Error logging in');
  }
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
  try {
    const response = await http.post('/api/v1/auth/recover', { email });
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.message || 'Error recovering password');
  }
}

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
