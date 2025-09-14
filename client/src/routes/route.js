// src/routes/route.js
const app = document.getElementById('app');

/**
 * Construye la URL segura para cargar vistas HTML desde src/views/
 */
const viewURL = (name) => new URL(`../views/${name}.html`, import.meta.url);

/**
 * Carga una vista y ejecuta la lógica asociada si aplica
 */
async function loadView(name) {
  const res = await fetch(viewURL(name));
  if (!res.ok) throw new Error(`No se pudo cargar la vista: ${name}`);
  const html = await res.text();
  app.innerHTML = html;

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
  const path = (location.hash.startsWith('#/') ? location.hash.slice(2) : '') || 'login';
  const known = [
    'login',
    'sign-up',
    'list_tasks',
    'new_task',
    'edit_task',
    'edit_profile',
    'recover_password'
  ];
  const route = known.includes(path) ? path : 'login';

  loadView(route).catch(err => {
    console.error(err);
    app.innerHTML = `<p style="color:#ffb4b4">Error cargando la vista.</p>`;
  });
}

/* ---------------- LÓGICA POR VISTA ---------------- */

/**
 * Vista: login
 */
function initLogin() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = e.target.userEmail.value;
    const password = e.target.userPassword.value;

    try {
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

    const username = e.target.userName.value;
    const email = e.target.userEmail.value;
    const password = e.target.userPassword.value;
    const confirmPassword = e.target.confirPassword.value;

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const data = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
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
    const email = e.target.userEmail.value;

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