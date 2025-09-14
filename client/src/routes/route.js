import { registerUser , loginUser , recoverPassword } from '../services/userService.js';
import { createTask, getTasks, getTaskById, updateTask, deleteTask } from '../services/taskService.js';

const app = document.getElementById('app');

const viewURL = (name) => new URL(`../views/${name}.html`, import.meta.url);

async function loadView(name, params = '') {
  const res = await fetch(viewURL(name));
  if (!res.ok) throw new Error(`Failed to load view: ${name}`);
  const html = await res.text();
  app.innerHTML = html;

  switch (name) {
    case 'home': initHome(); break;
    case 'board': initBoard(); break;
    case 'login': initLogin(); break;
    case 'sign-up': initSignUp(); break;
    case 'recover_password': initRecoverPassword(); break;
    case 'list_tasks': initListTasks(); break;
    case 'new_task': initNewTask(); break;
    case 'edit_tasks': initEditTask(params); break;
    case 'edit_profile': initEditProfile(); break;
  }
}

export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

function handleRoute() {
  const hash = location.hash.startsWith('#/') ? location.hash.slice(2) : '';
  const [path, queryString] = hash.split('?');
  const knownRoutes = [
    'home', 'board', 'login', 'sign-up', 'recover_password',
    'list_tasks', 'new_task', 'edit_tasks', 'edit_profile'
  ];
  const route = knownRoutes.includes(path) ? path : 'home';

  loadView(route, queryString).catch(err => {
    console.error(err);
    app.innerHTML = `<p style="color:#ffb4b4">Error loading the view.</p>`;
  });
}

function initHome() {
  const form = document.getElementById('registerForm');
  const userInput = document.getElementById('username');
  const passInput = document.getElementById('password');
  const msg = document.getElementById('registerMsg');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = '';
    const username = userInput?.value.trim();
    const password = passInput?.value.trim();
    if (!username || !password) {
      msg.textContent = 'Por favor completa usuario y contraseña.';
      return;
    }
    form.querySelector('button[type="submit"]').disabled = true;
    try {
      const data = await registerUser ({ username, email: username, password });
      msg.textContent = 'Registro exitoso. Por favor, inicia sesión.';
      setTimeout(() => (location.hash = '#/login'), 400);
    } catch (err) {
      msg.textContent = `No se pudo registrar: ${err.message}`;
    } finally {
      form.querySelector('button[type="submit"]').disabled = false;
    }
  });
}

function initBoard() {
  const form = document.getElementById('todoForm');
  const input = document.getElementById('newTodo');
  const list = document.getElementById('todoList');
  if (!form || !input || !list) return;

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

  list.addEventListener('click', (e) => {
    const li = e.target.closest('.todo');
    if (!li) return;
    if (e.target.matches('.remove')) li.remove();
    if (e.target.matches('.check')) li.classList.toggle('completed', e.target.checked);
  });
}

function initLogin() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = e.target.userEmail.value;
    const password = e.target.userPassword.value;
    try {
      const data = await loginUser ({ email, password });
      if (data.token) {
        localStorage.setItem('token', data.token);
        alert("Login exitoso");
        location.hash = "#/list_tasks";
      } else {
        alert(data.message || "Error en login");
      }
    } catch (error) {
      alert(error.message);
    }
  });
}

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
      const data = await registerUser ({ username, email, password });
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

function initRecoverPassword() {
  const form = document.getElementById("recoverForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = e.target.userEmail.value;
    try {
      const data = await recoverPassword({ email });
      alert(data.message || "Si el correo existe, se ha enviado un enlace de recuperación");
      location.hash = "#/login";
    } catch (error) {
      alert(error.message);
    }
  });
}

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
    const tasks = await getTasks(token);
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
    tbody.querySelectorAll('.edit-task-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const taskId = e.target.dataset.id;
        location.hash = `#/edit_tasks?id=${taskId}`;
      });
    });
    tbody.querySelectorAll('.delete-task-btn').forEach(button => {
      button.addEventListener('click', async (e) => {
        const taskId = e.target.dataset.id;
        if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
          try {
            await deleteTask(taskId, token);
            alert('Tarea eliminada');
            initListTasks();
          } catch (error) {
            alert(`Error al eliminar tarea: ${error.message}`);
          }
        }
      });
    });
  } catch (error) {
    alert(`Error al cargar tareas: ${error.message}`);
    location.hash = "#/login";
  }
}

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
      await createTask({ title, detail, status, datetime }, token);
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
    const task = await getTaskById(taskId, token);
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
      await updateTask(taskId, { title, detail, status, datetime }, token);
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

function initEditProfile() {
  const form = document.querySelector(".profile-form");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    alert("Funcionalidad de guardar perfil no implementada aún.");
  });
  const cancelButton = form.querySelector('.btn-cancel');
  if (cancelButton) {
    cancelButton.addEventListener('click', () => {
      location.hash = '#/list_tasks';
    });
  }
}