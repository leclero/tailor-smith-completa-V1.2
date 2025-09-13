let elementos = [];
let carrito = [];

// ===============================
// 🔹 Cargar elementos desde backend
// ===============================
function cargarElementos() {
  axios.get(`${backendURL}/api/elementos`).then((res) => {
    elementos = res.data;
    renderizarProductos();
    renderizarVideos();
  }).catch(err => {
    console.error("❌ Error cargando elementos:", err);
  });
}

// ===============================
// 🔹 Renderizar productos (imágenes)
// ===============================
function renderizarProductos() {
  const contenedor = document.getElementById("carousel-inner");
  contenedor.innerHTML = "";

  const productos = elementos.filter((e) => e.tipo === "imagen");

  productos.forEach((prod, index) => {
    const div = document.createElement("div");
    div.className = "carousel-item" + (index === 0 ? " active" : "");
    div.innerHTML = `
      <img src="${prod.archivo}" 
           alt="${prod.nombre}" 
           class="d-block mx-auto rounded shadow" 
           style="max-height: 400px;">
      <div class="carousel-caption bg-dark bg-opacity-50 p-2 rounded">
        <h5>${prod.nombre}</h5>
        <p>$${prod.precio}</p>
        <button class="btn btn-primary" onclick="agregarAlCarrito(${prod.id})">Agregar</button>
      </div>
    `;
    contenedor.appendChild(div);
  });
}

// ===============================
// 🔹 Renderizar videos
// ===============================
function renderizarVideos() {
  const contenedor = document.getElementById("galeria-videos");
  contenedor.innerHTML = "";

  const videos = elementos.filter((e) => e.tipo === "video");

  videos.forEach((video) => {
    const div = document.createElement("div");
    div.className = "col-md-4 mb-4";
    div.innerHTML = `
      <video controls width="100%" class="rounded shadow">
        <source src="${video.archivo}" type="video/mp4">
      </video>
    `;
    contenedor.appendChild(div);
  });
}

// ===============================
// 🔹 Carrito
// ===============================
function agregarAlCarrito(id) {
  const producto = elementos.find((e) => e.id === id);
  if (!producto) return;

  const existente = carrito.find((p) => p.id === id);
  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  renderizarCarrito();
}

function renderizarCarrito() {
  const contenedor = document.getElementById("carrito-contenido");
  contenedor.innerHTML = "";
  let total = 0;

  carrito.forEach((item, index) => {
    total += item.precio * item.cantidad;
    const div = document.createElement("div");
    div.className = "flex justify-between items-center mb-2";
    div.innerHTML = `
      <span>${item.nombre} - $${item.precio} x ${item.cantidad}</span>
      <div class="space-x-2">
        <button class="bg-green-500 text-white px-2" onclick="cambiarCantidad(${index}, 1)">+</button>
        <button class="bg-yellow-500 text-white px-2" onclick="cambiarCantidad(${index}, -1)">-</button>
        <button class="bg-red-600 text-white px-2" onclick="eliminarDelCarrito(${index})">❌</button>
      </div>
    `;
    contenedor.appendChild(div);
  });

  document.getElementById("carrito-total").textContent = `Total: $${total.toFixed(2)}`;
}

function cambiarCantidad(index, delta) {
  carrito[index].cantidad += delta;
  if (carrito[index].cantidad <= 0) {
    carrito.splice(index, 1);
  }
  renderizarCarrito();
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  renderizarCarrito();
}

// ===============================
// 🔹 Enviar pedido a WhatsApp
// ===============================
document.getElementById("btn-finalizar").addEventListener("click", () => {
  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  let mensaje = "🛒 Pedido:\n\n";
  carrito.forEach((item) => {
    mensaje += `${item.nombre} - $${item.precio} x ${item.cantidad}\n`;
  });
  mensaje += `\nTotal: $${document
    .getElementById("carrito-total")
    .textContent.replace("Total: ", "")}`;

  const whatsappURL = `https://wa.me/5491168915378?text=${encodeURIComponent(mensaje)}`;
  window.open(whatsappURL, "_blank");
});

// ===============================
// 🔹 Inicializar
// ===============================
cargarElementos();
