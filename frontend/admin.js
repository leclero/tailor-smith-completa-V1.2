let elementos = [];

// ===============================
// 🔹 Login
// ===============================
function login() {
  const usuario = document.getElementById("usuario").value;
  const clave = document.getElementById("clave").value;

  if (usuario === "admin" && clave === "smith2025") {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("admin-panel").style.display = "block";
    cargarElementos();
  } else {
    document.getElementById("mensaje-login").textContent =
      "Usuario o contraseña incorrectos.";
  }
}

// Permitir login con tecla Enter
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Enter" &&
    document.getElementById("login-section").style.display !== "none"
  ) {
    login();
  }
});

// ===============================
// 🔹 Subida de archivos
// ===============================
function subirArchivo() {
  const archivo = document.getElementById("input-archivo").files[0];
  if (!archivo) {
    alert("Selecciona un archivo.");
    return;
  }
  enviarArchivo(archivo);
}

function manejarDrop(event) {
  event.preventDefault();
  const archivos = event.dataTransfer.files;
  for (let i = 0; i < archivos.length; i++) {
    enviarArchivo(archivos[i]);
  }
}

function enviarArchivo(archivo) {
  const formData = new FormData();
  formData.append("archivo", archivo);

  axios.post(`${backendURL}/api/upload`, formData).then((res) => {
    document.getElementById("mensaje").textContent =
      "✅ Archivo subido correctamente.";

    elementos.push({
      id: res.data.id,
      tipo: res.data.tipo,
      archivo: res.data.archivo,
      nombre: "Nuevo elemento",
      precio: 0,
    });

    guardarCambios();
    renderizarElementos();
  });
}

// ===============================
// 🔹 Cargar y renderizar elementos
// ===============================
function cargarElementos() {
  axios.get(`${backendURL}/api/elementos`).then((res) => {
    elementos = res.data;
    renderizarElementos();
  });
}

function renderizarElementos() {
  const contenedor = document.getElementById("lista-elementos");
  contenedor.innerHTML = "";
  contenedor.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";

  elementos.forEach((elem, index) => {
    const media =
      elem.tipo === "video"
        ? `<video src="${elem.archivo}" class="w-full rounded mb-2" controls></video>`
        : `<img src="${elem.archivo}" class="w-full rounded mb-2">`;

    const div = document.createElement("div");
    div.className =
      "p-4 border rounded bg-white shadow space-y-2 flex flex-col";

    div.innerHTML = `
      ${media}
      <label><strong>Nombre o Descripción:</strong></label>
      <input type="text" value="${elem.nombre}" 
            class="border p-2 w-full rounded"
            onchange="elementos[${index}].nombre = this.value">

      <label><strong>Precio o Valor:</strong></label>
      <input type="number" value="${elem.precio}" 
            class="border p-2 w-full rounded"
            onchange="elementos[${index}].precio = parseFloat(this.value)">

      <button onclick="elementos.splice(${index},1); guardarCambios(); renderizarElementos()"
              class="bg-red-600 text-white px-3 py-1 rounded mt-2">
        ❌ Eliminar
      </button>
    `;

    contenedor.appendChild(div);
  });
}

// ===============================
// 🔹 Guardar catálogo
// ===============================
function guardarCambios() {
  axios.put(`${backendURL}/api/elementos`, elementos).then(() => {
    document.getElementById("mensaje").textContent =
      "💾 Catálogo guardado correctamente.";
  });
}

// ===============================
// 🔹 Salir
// ===============================
function salirAdmin() {
  window.location.href = "index.html";
}
