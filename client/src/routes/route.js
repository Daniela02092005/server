import { registerUser, loginUser, recoverPassword } from '../services/userService.js';
import { createTask, getTasks, getTaskById, updateTask, deleteTask } from '../services/taskService.js';

const app = document.getElementById('app');

/**
 * Build a safe URL for fetching view fragments inside Vite (dev and build).
 * @param {string} name - The name of the view (without extension).
 * @returns {URL} The resolved URL for the view HTML file.
 */
const viewURL = (name) => new URL(`../views/${name}.html`, import.meta.url);

/**
 * Load an HTML fragment by view name and initialize its corresponding logic.
 * @async
 * @param {string} name - The view name to load (e.g., "home", "board").
 * @param {string} [params=''] - Optional parameters for view initialization.
 * @throws {Error} If the view cannot be fetched.
 */
async function loadView(name, params = '') {
  const res = await fetch(viewURL(name));
  if (!res.ok) throw new Error(`Failed to load view: ${name}`);
  const html = await res.text();
  app.innerHTML = html;

  // Initialize view-specific logic
  switch (name) {
    case 'home':
      initHome();
      break;
    case 'board':
      initBoard();
      break;
    case 'login':
      initLogin();
      break;
    case 'sign-up':
      initSignUp();
      break;
    case 'recover_password':
      initRecoverPassword();
      break;
    case 'list_tasks':
      initListTasks();
      break;
    case 'new_task':
      initNewTask();
      break;
    case 'edit_tasks':
      initEditTask(params); // Pass params for task ID
      break;
    case 'edit_profile':
      initEditProfile();
      break;
    // Add other cases for new views
  }
}

/**
 * Initialize the hash-based router.
 * Attaches an event listener for URL changes and triggers the first render.
 */
export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute(); // first render
}

/**
 * Handle the current route based on the location hash.
 * Fallback to 'login' if the route is unknown or empty.
 */
function handleRoute() {
  const hash = location.hash.startsWith('#/') ? location.hash.slice(2) : '';
  const [path, queryString] = hash.split('?');
  const knownRoutes = [
    'home', 'board', 'login', 'sign-up', 'recover_password',
    'list_tasks', 'new_task', 'edit_tasks', 'edit_profile'
  ];
  // Set 'login' as the default route if no hash or an unknown hash is present
  const route = knownRoutes.includes(path) ? path : 'login';

  loadView(route, queryString).catch(err => {
    console.error(err);
    app.innerHTML = `<p style="color:#ffb4b4">Error loading the view.</p>`;
  });
}

/* ---- View-specific logic (existing and new) ---- */

/**
 * Initialize the "home" view.
 * Attaches a submit handler to the register form to navigate to the board.
 */
function initHome() {
  const form = document.getElementById('registerForm'); // This form ID is used in sign-up.html, not home.html
  const userInput = document.getElementById('username'); // This input ID is not present in home.html
  const passInput = document.getElementById('password'); // This input ID is not present in home.html
  const msg = document.getElementById('registerMsg'); // This element ID is not present in home.html

  // The original initHome logic seems to be for a registration form,
  // but home.html is a simple welcome page.
  // If home.html is meant to be a registration page, its content needs to be updated.
  // For now, assuming home.html is just a static welcome page, no specific JS interaction is needed.
  // If it's meant to be a registration, the form IDs and logic should match sign-up.html or be a separate form.

  // If home.html is just a landing page, you might want to add navigation buttons here.
  // For example:
  const loginButton = document.getElementById('goToLogin');
  if (loginButton) {
    loginButton.addEventListener('click', () => {
      location.hash = '#/login';
    });
  }
  const signUpButton = document.getElementById('goToSignUp');
  if (signUpButton) {
    signUpButton.addEventListener('click', () => {
      location.hash = '#/sign-up';
    });
  }
}


/**
 * Initialize the "board" view.
 * Sets up the todo form, input, and list with create/remove/toggle logic.
 */
function initBoard() {
  const form = document.getElementById('todoForm');
  const input = document.getElementById('newTodo');
  const list = document.getElementById('todoList');
  if (!form || !input || !list) return;

  // Add new todo item
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = input.value.trim();
    if (!title) return;

    const li = document.createElement('li');
    li.className = 'todo';
    li.innerHTML = `
      <label>
        <input type="checkbox" class="check">
        <span>${title}</span>
      </label>
      <button class="link remove" type="button">Eliminar</button>
    `;
    list.prepend(li);
    input.value = '';
  });

  // Handle remove and toggle completion
  list.addEventListener('click', (e) => {
    const li = e.target.closest('.todo');
    if (!li) return;
    if (e.target.matches('.remove')) li.remove();
    if (e.target.matches('.check')) li.classList.toggle('completed', e.target.checked);
  });
}

/**
 * Initialize the "login" view.
 */
function initLogin() {
  const form = document.querySelector(".form"); // Use class selector as login.html form doesn't have an ID
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = e.target.userEmail.value;
    const password = e.target.userPassword.value;

    try {
      const data = await loginUser({ email, password }); // Call the userService login function
      if (data.token) {
        localStorage.setItem('token', data.token); // Store token
        alert("Login exitoso");
        location.hash = "#/list_tasks"; // Navigate to list_tasks
      } else {
        alert(data.message || "Error en login");
      }
    } catch (error) {
      alert(error.message);
    }
  });

  // Add event listener for "CREAR CUENTA" button
  const createAccountButton = form.querySelector('button[onclick*="register.html"]');
  if (createAccountButton) {
    createAccountButton.addEventListener('click', () => {
      location.hash = '#/sign-up';
    });
  }

  // Add event listener for "¿Olvidaste tu contraseña?" link
  const recoverPasswordLink = form.querySelector('p a');
  if (recoverPasswordLink) {
    recoverPasswordLink.addEventListener('click', (e) => {
      e.preventDefault();
      location.hash = '#/recover_password';
    });
  }
}

/**
 * Initialize the "sign-up" view.
 */
function initSignUp() {
  const form = document.querySelector(".form"); // Use class selector as sign-up.html form doesn't have an ID
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = e.target.userName.value;
    const email = e.target.userEmail.value;
    const password = e.target.userPassword.value;
    const confirmPassword = e.target.confirPassword.value;
    const termsAccepted = e.target.termsAndConditions.checked;

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    if (!termsAccepted) {
      alert("Debes aceptar los términos y condiciones.");
      return;
    }

    try {
      const data = await registerUser({ username, email, password }); // Call the userService register function
      if (data.id) {
        alert("Registro exitoso, por favor inicia sesión");
        location.hash = "#/login"; // Navigate to login
      } else {
        alert(data.message || "Error en registro");
      }
    } catch (error) {
      alert(error.message);
    }
  });
}

/**
 * Initialize the "recover_password" view.
 */
function initRecoverPassword() {
  const form = document.querySelector(".form"); // Use class selector as recover_password.html form doesn't have an ID
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = e.target.userEmail.value;

    try {
      const data = await recoverPassword({ email }); // Call the userService recover function
      alert(data.message || "Si el correo existe, se ha enviado un enlace de recuperación");
      location.hash = "#/login"; // Redirect to login after sending recovery link
    } catch (error) {
      alert(error.message);
    }
  });

  // Add event listener for "Volver a inicio de sesión" link
  const backToLoginLink = form.querySelector('a');
  if (backToLoginLink) {
    backToLoginLink.addEventListener('click', (e) => {
      e.preventDefault();
      location.hash = '#/login';
    });
  }
}

/**
 * Initialize the "list_tasks" view.
 */
async function initListTasks() {
  const tbody = document.querySelector(".task-table tbody");
  if (!tbody) return;

  const token = localStorage.getItem('token');
  if (!token) {
    alert("Por favor inicia sesión");
    location.hash = "#/login";
    return;
  }

  try {
    const tasks = await getTasks(token); // Call the taskService getTasks function
    tbody.innerHTML = "";

    tasks.forEach((task) => {
      const tr = document.createElement("tr");
      const dateObj = new Date(task.datetime);
      tr.innerHTML = `
        <td><input type="checkbox" ${task.status === "done" ? "checked" : ""} disabled></td>
        <td>${task.title}</td>
        <td>${task.detail || ""}</td>
        <td>${task.status}</td>
        <td>${dateObj.toLocaleDateString()}</td>
        <td>${dateObj.toLocaleTimeString()}</td>
        <td>
          <button class="edit-task-btn" data-id="${task._id}">Editar</button>
          <button class="delete-task-btn" data-id="${task._id}">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Add event listeners for edit and delete buttons
    tbody.querySelectorAll('.edit-task-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const taskId = e.target.dataset.id;
        location.hash = `#/edit_tasks?id=${taskId}`;
      });
    });

    // Implement delete functionality (you'll need a deleteTask service function)
    tbody.querySelectorAll('.delete-task-btn').forEach(button => {
      button.addEventListener('click', async (e) => {
        const taskId = e.target.dataset.id;
        if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
          try {
            await deleteTask(taskId, token); // Implement this in taskService
            alert('Tarea eliminada');
            initListTasks(); // Reload tasks
          } catch (error) {
            alert(`Error al eliminar tarea: ${error.message}`);
          }
        }
      });
    });

    // Add event listener for the "back-btn" to navigate to a relevant page, e.g., home or board
    const backButton = document.querySelector('.back-btn');
    if (backButton) {
      backButton.addEventListener('click', (e) => {
        e.preventDefault();
        location.hash = '#/home'; // Or '#/board' depending on desired navigation
      });
    }

    // Add event listener for the user icon to navigate to edit_profile
    const userIcon = document.querySelector('.user-icon');
    if (userIcon) {
      userIcon.addEventListener('click', () => {
        location.hash = '#/edit_profile';
      });
    }

  } catch (error) {
    alert(`Error al cargar tareas: ${error.message}`);
    location.hash = "#/login"; // Redirect to login on error
  }
}

/**
 * Initialize the "new_task" view.
 */
function initNewTask() {
  const form = document.querySelector(".form"); // Use class selector as new_task.html form doesn't have an ID
  if (!form) return;

  // Assign IDs to form elements for easier access
  form.querySelector('input[type="text"]:nth-of-type(1)').id = 'title';
  form.querySelector('input[type="text"]:nth-of-type(2)').id = 'detail';
  form.querySelector('input[type="text"]:nth-of-type(3)').id = 'status';
  form.querySelector('input[type="text"]:nth-of-type(4)').id = 'date'; // This should be type="date" in HTML
  form.querySelector('input[type="time"]').id = 'time';

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Por favor inicia sesión");
      location.hash = "#/login";
      return;
    }

    const title = form.title.value;
    const detail = form.detail.value;
    const status = form.status.value;
    const date = form.date.value;
    const time = form.time.value;

    const datetime = new Date(`${date}T${time}`).toISOString();

    try {
      await createTask({ title, detail, status, datetime }, token); // Call the taskService createTask function
      alert("Tarea creada con éxito");
      location.hash = "#/list_tasks";
    } catch (error) {
      alert(`Error al crear tarea: ${error.message}`);
    }
  });

  const cancelButton = form.querySelector('.btn-cancel');
  if (cancelButton) {
    cancelButton.addEventListener('click', () => {
      location.hash = '#/list_tasks';
    });
  }
}

/**
 * Initialize the "edit_tasks" view.
 * @param {string} queryString - The query string containing the task ID.
 */
async function initEditTask(queryString) {
  const urlParams = new URLSearchParams(queryString);
  const taskId = urlParams.get("id");
  const form = document.querySelector(".form"); // Use class selector as edit_tasks.html form doesn't have an ID
  if (!form || !taskId) {
    alert("ID de tarea no encontrado o formulario no disponible.");
    location.hash = "#/list_tasks";
    return;
  }

  // Assign IDs to form elements for easier access
  form.querySelector('input[type="text"]:nth-of-type(1)').id = 'title';
  form.querySelector('input[type="text"]:nth-of-type(2)').id = 'detail';
  form.querySelector('input[type="text"]:nth-of-type(3)').id = 'status';
  form.querySelector('input[type="text"]:nth-of-type(4)').id = 'date'; // This should be type="date" in HTML
  form.querySelector('input[type="time"]').id = 'time';

  const token = localStorage.getItem('token');
  if (!token) {
    alert("Por favor inicia sesión");
    location.hash = "#/login";
    return;
  }

  try {
    const task = await getTaskById(taskId, token); // You'll need to implement getTaskById in taskService
    form.title.value = task.title;
    form.detail.value = task.detail || "";
    form.status.value = task.status;
    const dateObj = new Date(task.datetime);
    form.date.value = dateObj.toISOString().split("T")[0];
    form.time.value = dateObj.toTimeString().split(" ")[0].slice(0, 5);
  } catch (error) {
    alert(`Error al cargar tarea: ${error.message}`);
    location.hash = "#/list_tasks";
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = form.title.value;
    const detail = form.detail.value;
    const status = form.status.value;
    const date = form.date.value;
    const time = form.time.value;
    const datetime = new Date(`${date}T${time}`).toISOString();

    try {
      await updateTask(taskId, { title, detail, status, datetime }, token); // Call the taskService updateTask function
      alert("Tarea actualizada");
      location.hash = "#/list_tasks";
    } catch (error) {
      alert(`Error al actualizar tarea: ${error.message}`);
    }
  });

  const cancelButton = form.querySelector('.btn-cancel');
  if (cancelButton) {
    cancelButton.addEventListener('click', () => {
      location.hash = '#/list_tasks';
    });
  }
}

/**
 * Initialize the "edit_profile" view.
 */
function initEditProfile() {
  const form = document.querySelector(".profile-form");
  if (!form) return;

  // You would typically load user data here to pre-fill the form
  // For now, just handle the submit and cancel buttons
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    alert("Funcionalidad de guardar perfil no implementada aún.");
    // Here you would call a userService function to update the user profile
    // const userName = form.userName.value;
    // const userLastName = form.userLastName.value;
    // const userAge = form.userAge.value;
    // const userEmail = form.userEmail.value;
    // try {
    //   await updateProfile({ userName, userLastName, userAge, userEmail }, token);
    //   alert("Perfil actualizado con éxito");
    //   location.hash = "#/some_other_page"; // Redirect after update
    // } catch (error) {
    //   alert(`Error al actualizar perfil: ${error.message}`);
    // }
  });

  const cancelButton = form.querySelector('.btn-cancel');
  if (cancelButton) {
    cancelButton.addEventListener('click', () => {
      // Decide where to go after canceling profile edit, e.g., back to task list
      location.hash = '#/list_tasks';
    });
  }
}
