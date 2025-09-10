let elementos = [];

axios.get(`${backendURL}/api/elementos`).then((res) => {
  elementos = res.data;
  renderizarProductos();
  renderizarVideos();
});

function renderizarProductos() {
  const container = document.getElementById("productos");
  if (!container) return;
  container.innerHTML = "";

  const productos = elementos.filter(e => e.tipo === "imagen");

  productos.forEach((prod) => {
    const div = document.createElement("div");
    div.className = "p-4 text-center";

    div.innerHTML = `
      <img src="${prod.archivo}" class="mx-auto rounded shadow max-h-80 mb-2">
      <p class="font-bold">${prod.nombre}</p>
      <p class="text-gray-600">$${prod.precio.toFixed(2)}</p>
    `;

    container.appendChild(div);
  });
}

function renderizarVideos() {
  const container = document.getElementById("videos");
  if (!container) return;
  container.innerHTML = "";

  const videos = elementos.filter(e => e.tipo === "video");

  videos.forEach((video) => {
    const div = document.createElement("div");
    div.className = "p-4";

    div.innerHTML = `
      <video controls width="100%" class="rounded shadow">
        <source src="${video.archivo}" type="video/mp4">
      </video>
      <p class="mt-2 font-semibold">${video.nombre}</p>
    `;

    container.appendChild(div);
  });
}
