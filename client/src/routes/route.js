import { registerUser, loginUser, recoverPassword } from '../services/userService.js';
import { createTask, getTasks, getTaskById, updateTask, deleteTask } from '../services/taskService.js';


const app = document.getElementById('app');


/**
 * Construye la URL segura para cargar vistas HTML desde src/views/
 */
const viewURL = (name) => new URL(`../views/${name}.html`, import.meta.url);

/**
 * Load an HTML fragment by view name and initialize its corresponding logic.
 * @async
 * @param {string} name - The view name to load (e.g., "home", "board").
 * @param {string} [params=''] - Optional parameters for view initialization.
 * @throws {Error} If the view cannot be fetched.
 * Carga una vista y ejecuta la lógica asociada si aplica
 */
async function loadView(name, params = '') {
  const res = await fetch(viewURL(name));
  if (!res.ok) throw new Error(`No se pudo cargar la vista: ${name}`);
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
  // Inicializar lógica según la vista
  if (name === 'login') initLogin();
  if (name === 'sign-up') initSignUp();
  if (name === 'list_tasks') initListTasks();
  if (name === 'new_task') initNewTask();
  if (name === 'edit_task') initEditTask();
  if (name === 'edit_profile') initEditProfile();
  if (name === 'recover_password') initRecoverPassword();
}

/**
 * Inicializa el router basado en hash
 */
export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute(); // primera carga
}

/**
 * Resuelve la ruta actual según el hash
 */
function handleRoute() {
  const hash = location.hash.startsWith('#/') ? location.hash.slice(2) : '';
  const [path, queryString] = hash.split('?');
  const knownRoutes = [
    'home', 'board', 'login', 'sign-up', 'recover_password',
    'list_tasks', 'new_task', 'edit_tasks', 'edit_profile'
  ];
  const route = knownRoutes.includes(path) ? path : 'home';
  const path = (location.hash.startsWith('#/') ? location.hash.slice(2) : '') || 'login';
  const known = [
    'login',
    'sign-up',
    'list_tasks',
    'new_task',
    'edit_task',   // 🔹 corregido (antes "edit_tasks")
    'edit_profile',
    'recover_password'
  ];
  const route = known.includes(path) ? path : 'login';

  loadView(route, queryString).catch(err => {
    console.error(err);
    app.innerHTML = `<p style="color:#ffb4b4">Error cargando la vista.</p>`;
  });
}

/* ---- View-specific logic (existing and new) ---- *//* ---------------- LÓGICA POR VISTA ---------------- */

/**
 * Vista: login
 */
function initLogin() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.userEmail.value;
    const password = form.userPassword.value;

    if (!email || !password) {
      alert('Por favor completa usuario y contraseña.');
      return;
    }

    form.querySelector('button[type="submit"]').disabled = true;

    try {
      // NOTE: The backend register expects 'email' and 'password'.
      // For initHome to work with the current backend, 'username' should ideally be 'email'.
      // If 'username' is intended as a display name, the backend register function needs adjustment
      // or this form should collect an email.
      // For now, we'll use 'username' as 'email' for the registerUser call to match backend.
      const data = await registerUser({ username: username, email: username, password: password });
      msg.textContent = 'Registro exitoso. Por favor, inicia sesión.';

      setTimeout(() => (location.hash = '#/login'), 400); // Redirect to login after registration
    } catch (err) {
      msg.textContent = `No se pudo registrar: ${err.message}`;
      const data = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }).then(res => res.json());

      if (data.token) {
        setToken(data.token);
        alert("Login exitoso");
        location.hash = "#/list_tasks";
      } else {
        alert(data.message || "Error en login");
      }
    } catch (error) {
      alert(error.message);
    } finally {
      form.querySelector('button[type="submit"]').disabled = false;
    }
  });
}

/**
 * Vista: registro (sign-up)
 */
function initSignUp() {
  const form = document.getElementById("registerForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = form.userName.value;
    const lastName = form.userLastName.value;
    const age = form.userAge.value;
    const email = form.userEmail.value;
    const password = form.userPassword.value;
    const confirmPassword = form.confirPassword.value;

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const data = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, lastName, age, email, password }),
      }).then(res => res.json());

      if (data.id) {
        alert("Registro exitoso, por favor inicia sesión");
        location.hash = "#/login";
      } else {
        alert(data.message || "Error en registro");
      }
    } catch (error) {
      alert(error.message);
    }
  });
}

/**
 * Vista: recuperar contraseña
 */
function initRecoverPassword() {
  const form = document.getElementById("recoverForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = form.userEmail.value;

    try {
      const data = await fetch(`${API}/auth/recover`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }).then(res => res.json());

      alert(data.message || "Si el correo existe, se ha enviado un enlace de recuperación");
    } catch (error) {
      alert(error.message);
    }
  });
}

/**
 * Vista: lista de tareas
 */
function initListTasks() {
  async function loadTasks() {
    const token = getToken();
    if (!token) {
      alert("Por favor inicia sesión");
      location.hash = "#/login";
      return;
    }

    try {
      const tasks = await fetchWithAuth(`${API}/tasks`);
      const tbody = document.querySelector(".task-table tbody");
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
        `;
        tbody.appendChild(tr);
      });
    } catch (error) {
      alert(error.message);
    }
  }

  loadTasks();
}

/**
 * Vista: nueva tarea
 */
function initNewTask() {
  const form = document.getElementById("createTaskForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = getToken();
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
      await fetchWithAuth(`${API}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, detail, status, datetime }),
      });

      alert("Tarea creada con éxito");
      location.hash = "#/list_tasks";
    } catch (error) {
      alert(error.message);
    }
  });
}

/**
 * Vista: editar tarea
 */
function initEditTask() {
  const form = document.getElementById("editTaskForm");
  if (!form) return;

  const urlParams = new URLSearchParams(window.location.search);
  const taskId = urlParams.get("id");
  const token = getToken();

  if (!token) {
    alert("Por favor inicia sesión");
    location.hash = "#/login";
    return;
  }

  async function loadTask() {
    try {
      const task = await fetchWithAuth(`${API}/tasks/${taskId}`);
      form.title.value = task.title;
      form.detail.value = task.detail || "";
      form.status.value = task.status;
      const dateObj = new Date(task.datetime);
      form.date.value = dateObj.toISOString().split("T")[0];
      form.time.value = dateObj.toTimeString().split(" ")[0].slice(0, 5);
    } catch (error) {
      alert(error.message);
    }
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
      await fetchWithAuth(`${API}/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, detail, status, datetime }),
      });
      alert("Tarea actualizada");
      location.hash = "#/list_tasks";
    } catch (error) {
      alert(error.message);
    }
  });

  loadTask();
}

/**
 * Vista: editar perfil
 */
function initEditProfile() {
  const form = document.querySelector(".profile-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Perfil actualizado (implementa la lógica con tu API)");
  });
}

/**
 * Initialize the "login" view.
 */
function initLogin() {
  const form = document.getElementById("loginForm");
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
}

/**
 * Initialize the "sign-up" view.
 */
function initSignUp() {
  const form = document.getElementById("registerForm");
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
  const form = document.getElementById("recoverForm");
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

  } catch (error) {
    alert(`Error al cargar tareas: ${error.message}`);
    location.hash = "#/login"; // Redirect to login on error
  }
}

/**
 * Initialize the "new_task" view.
 */
function initNewTask() {
  const form = document.getElementById("createTaskForm");
  if (!form) return;

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
  const form = document.getElementById("editTaskForm");
  if (!form || !taskId) {
    alert("ID de tarea no encontrado o formulario no disponible.");
    location.hash = "#/list_tasks";
    return;
  }

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
