let elementos = [];
let carrito = [];

// ==================== CARGAR ELEMENTOS ====================
function cargarElementos() {
axios.get(`${backendURL}/api/elementos`).then(res => {
    elementos = res.data;
    renderizarProductos();
    renderizarVideos();
});
}

// ==================== RENDER PRODUCTOS ====================
function renderizarProductos() {
const contenedor = document.getElementById("carousel-inner");
contenedor.innerHTML = "";

const productos = elementos.filter(e => e.tipo === "imagen");

productos.forEach((prod, index) => {
    const div = document.createElement("div");
    div.className = "carousel-item" + (index === 0 ? " active" : "");
    div.innerHTML = `
    <div class="flex flex-col items-center">
        <img src="${backendURL}${prod.archivo}" class="max-h-80 rounded shadow">
        <div class="mt-2 text-center">
        <h5 class="font-bold">${prod.nombre}</h5>
        <p class="text-gray-700">$${prod.precio}</p>
        <button class="bg-blue-600 text-white px-3 py-1 rounded mt-2"
        onclick="agregarAlCarrito(${prod.id})">Agregar</button>
        </div>
    </div>`;
    contenedor.appendChild(div);
});
}

// ==================== RENDER VIDEOS ====================
function renderizarVideos() {
const contenedor = document.getElementById("galeria-videos");
contenedor.innerHTML = "";

const videos = elementos.filter(e => e.tipo === "video");

videos.forEach(video => {
    const div = document.createElement("div");
    div.className = "col-span-1";
    div.innerHTML = `
    <video controls class="w-full rounded shadow">
        <source src="${backendURL}${video.archivo}" type="video/mp4">
    </video>`;
    contenedor.appendChild(div);
});
}

// ==================== CARRITO ====================
function agregarAlCarrito(id) {
const prod = elementos.find(p => p.id === id);
if (!prod) return;

const existente = carrito.find(p => p.id === id);
if (existente) {
    existente.cantidad++;
} else {
    carrito.push({ ...prod, cantidad: 1 });
}
renderizarCarrito();
}

function quitarDelCarrito(id) {
const item = carrito.find(p => p.id === id);
if (item && item.cantidad > 1) {
    item.cantidad--;
} else {
    carrito = carrito.filter(p => p.id !== id);
}
renderizarCarrito();
}

function renderizarCarrito() {
const contenedor = document.getElementById("carrito-contenido");
contenedor.innerHTML = "";

let total = 0;

carrito.forEach(item => {
    total += item.precio * item.cantidad;
    const div = document.createElement("div");
    div.className = "flex justify-between items-center border-b py-2 text-sm";
    div.innerHTML = `
    <span>${item.nombre} (x${item.cantidad})</span>
    <div>
        <button class="bg-red-500 text-white px-2 rounded" onclick="quitarDelCarrito(${item.id})">-</button>
        <button class="bg-green-500 text-white px-2 rounded ml-1" onclick="agregarAlCarrito(${item.id})">+</button>
    </div>`;
    contenedor.appendChild(div);
});

document.getElementById("carrito-total").textContent = `Total: $${total.toFixed(2)}`;
}

// ==================== ENVIAR PEDIDO ====================
document.getElementById("btn-finalizar").addEventListener("click", () => {
if (carrito.length === 0) {
    alert("🛒 Tu carrito está vacío.");
    return;
}

let mensaje = "Hola, quiero hacer un pedido:\n\n";
carrito.forEach(item => {
    mensaje += `- ${item.nombre} x${item.cantidad} ($${item.precio})\n`;
});
  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
mensaje += `\nTOTAL: $${total.toFixed(2)}`;

const url = `https://wa.me/5491168915378?text=${encodeURIComponent(mensaje)}`;
window.open(url, "_blank");
});

cargarElementos();
