<<<<<<< HEAD
// admin.js
// Usa config.js para el backendURL
=======
const backendURL = '192.168.0.141:3000';  // Cambia esto por la IP real del backend
>>>>>>> b8239bad5b2b3ca9c3151be86a38dd262cdb7526

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

let elementos = [];

// ==================== SUBIDA ====================
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

axios.post(`${backendURL}/api/upload`, formData).then(() => {
    document.getElementById("mensaje").textContent =
    "✅ Archivo subido correctamente.";
    cargarElementos();
});
}

// ==================== RENDER LISTA ====================
function cargarElementos() {
axios.get(`${backendURL}/api/elementos`).then(res => {
    elementos = res.data;
    renderizarElementos();
});
}

function renderizarElementos() {
const contenedor = document.getElementById("lista-elementos");
contenedor.innerHTML = "";

elementos.forEach((elem, index) => {
    const media =
    elem.tipo === "video"
        ? `<video src="${backendURL}${elem.archivo}" class="w-32 rounded" controls></video>`
        : `<img src="${backendURL}${elem.archivo}" class="w-32 rounded">`;

    const div = document.createElement("div");
    div.className =
    "bg-white p-4 rounded shadow flex flex-col items-start space-y-2";

    div.innerHTML = `
    ${media}
    <label class="text-sm font-bold">Nombre o Descripción:</label>
    <input type="text" value="${elem.nombre}"
        class="border p-1 rounded w-full"
        onfocus="if(this.value==='Nuevo elemento') this.value='';"
        onblur="if(this.value==='') this.value='Nuevo elemento';"
        onchange="elementos[${index}].nombre = this.value">

    <label class="text-sm font-bold">Precio o Valor:</label>
    <input type="number" value="${elem.precio}"
        class="border p-1 rounded w-full"
        onchange="elementos[${index}].precio = parseFloat(this.value)">

    <button class="bg-red-600 text-white px-3 py-1 rounded"
        onclick="elementos.splice(${index},1); renderizarElementos()">❌ Eliminar</button>
    `;

    contenedor.appendChild(div);
});
}

// ==================== GUARDAR ====================
function guardarCambios() {
axios.put(`${backendURL}/api/elementos`, elementos).then(() => {
    document.getElementById("mensaje").textContent =
    "💾 Catálogo guardado correctamente.";
});
}

// ==================== SALIR ====================
function salirAdmin() {
window.location.href = "index.html";
}

// ==================== ENTER para login ====================
document.addEventListener("keydown", function (event) {
if (event.key === "Enter" && document.getElementById("login-section").style.display !== "none") {
    login();
}
});
