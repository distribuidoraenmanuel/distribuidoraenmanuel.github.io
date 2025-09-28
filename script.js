/* script.js - Carrito optimizado con edición estable + recargos distritos */

const WHATSAPP_NUMBER = "51983528309";

const DISCOUNT_3 = 10;
const DISCOUNT_10 = 20;
const MIN_UNITS_MURO = 1000;

const materiales = {
  "king kong 18 huecos": { tipo: "muro", precio: 800 },
  "king kong 18 hercules": { tipo: "muro", precio: 745 },
  "king kong 18 30% (infes)": { tipo: "muro", precio: 1205 },
  "pandereta raya": { tipo: "muro", precio: 725 },
  "hueco 8": { tipo: "techo", precio: 2260},
  "hueco 12": { tipo: "techo", precio: 2310 },
  "hueco 15": { tipo: "techo", precio: 2430 },
  "hueco 20": { tipo: "techo", precio: 3910 },
  "pastelero": { tipo: "acabados", precio: 1610 },
  "teja": { tipo: "acabados", precio: 1510 },
  "caravista 6": { tipo: "acabados", precio: 1210 },
  "caravista 9": { tipo: "acabados", precio: 1340 }
};

// Recargos por distrito y tipo de producto
const recargosDistritos = {
  "Mi Perú": { muro: 40, techo: 65, acabados: 40 },
  "Puente Piedra": { muro: 40, techo: 70, acabados: 40 },
  "Carabayllo": { muro: 50, techo: 80, acabados: 50 },
  "Comas": { muro: 50, techo: 80, acabados: 50 },
  "Los Olivos": { muro: 50, techo: 85, acabados: 50 },
  "Ventanilla": { muro: 50, techo: 80, acabados: 50 },
  "Ancón": { muro: 60, techo: 110, acabados: 60 },
  "Santa Rosa": { muro: 60, techo: 110, acabados: 60 },
  "Rímac": { muro: 70, techo: 125, acabados: 70 },
  "San Martín de Porres": { muro: 70, techo: 125, acabados: 70 },
  "Lima (Cercado de Lima)": { muro: 75, techo: 135, acabados: 75 },
  "Bellavista": { muro: 80, techo: 140, acabados: 80 },
  "Independencia": { muro: 80, techo: 140, acabados: 80 },
  "Breña": { muro: 85, techo: 145, acabados: 85 },
  "Callao": { muro: 85, techo: 150, acabados: 85 },
  "San Isidro": { muro: 85, techo: 150, acabados: 85 },
  "Carmen de la Legua-Reynoso": { muro: 90, techo: 135, acabados: 90 },
  "Jesús María": { muro: 90, techo: 160, acabados: 90 },
  "La Perla": { muro: 90, techo: 160, acabados: 90 },
  "Lince": { muro: 90, techo: 160, acabados: 90 },
  "Magdalena del Mar": { muro: 90, techo: 160, acabados: 90 },
  "Pueblo Libre": { muro: 90, techo: 160, acabados: 90 },
  "La Victoria": { muro: 95, techo: 165, acabados: 95 },
  "San Miguel": { muro: 95, techo: 165, acabados: 95 },
  "La Punta": { muro: 100, techo: 180, acabados: 100 },
  "El Agustino": { muro: 120, techo: 210, acabados: 120 },
  "Miraflores": { muro: 120, techo: 210, acabados: 120 },
  "Santa Anita": { muro: 120, techo: 210, acabados: 120 },
  "San Luis": { muro: 135, techo: 235, acabados: 135 },
  "San Juan de Lurigancho": { muro: 140, techo: 245, acabados: 140 },
  "Surquillo": { muro: 140, techo: 245, acabados: 140 },
  "La Molina": { muro: 150, techo: 260, acabados: 150 },
  "Ate": { muro: 160, techo: 280, acabados: 160 },
  "Santiago de Surco": { muro: 165, techo: 225, acabados: 165 },
  "Barranco": { muro: 170, techo: 240, acabados: 170 },
  "San Juan de Miraflores": { muro: 175, techo: 245, acabados: 175 },
  "Chorrillos": { muro: 180, techo: 280, acabados: 180 },
  "Chaclacayo": { muro: 200, techo: 345, acabados: 200 },
  "Villa María del Triunfo": { muro: 200, techo: 295, acabados: 200 },
  "Villa El Salvador": { muro: 205, techo: 300, acabados: 205 },
  "Cieneguilla": { muro: 210, techo: 370, acabados: 210 },
  "Lurín": { muro: 245, techo: 375, acabados: 245 },
  "Pachacámac": { muro: 275, techo: 425, acabados: 275 },
  "Punta Hermosa": { muro: 275, techo: 425, acabados: 275 },
  "Punta Negra": { muro: 275, techo: 425, acabados: 275 },
  "San Bartolo": { muro: 360, techo: 590, acabados: 360 }
};


let carrito = [];
let ultimoCalculo = null;

document.addEventListener("DOMContentLoaded", () => {
  const inputs = ["nombre", "distrito", "material", "cantidad"];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", calcular); // cálculo automático
  });

  const btnAgregar = document.getElementById("btnAgregar");
  if (btnAgregar) btnAgregar.addEventListener("click", agregarAlCarrito);

  // Eliminar item del carrito
  document.addEventListener("click", (e) => {
    if (e.target && e.target.matches(".btn-eliminar")) {
      const idx = parseInt(e.target.dataset.index, 10);
      if (!isNaN(idx)) eliminarItem(idx);
    }
  });

  // Editar cantidad en carrito
  document.addEventListener("change", (e) => {
    if (e.target && e.target.matches(".input-cantidad-carrito")) {
      const idx = parseInt(e.target.dataset.index, 10);
      const nuevaCantidad = parseInt(e.target.value, 10);
      if (!isNaN(idx) && nuevaCantidad > 0) {
        editarCantidadCarrito(idx, nuevaCantidad);
      }
    }
  });

  if (document.getElementById("carrito")) mostrarCarrito();
});

/* ================= FUNCIONES ================= */

function calcular() {
  const nombre = getInputValue("nombre");
  const distrito = getInputValue("distrito");
  const material = getInputValue("material");
  const unidades = parseInt(getInputValue("cantidad"), 10) || 0;
  const resultadoDiv = document.getElementById("resultado");

  if (!resultadoDiv) return;

  if (!material || !distrito || !unidades || unidades <= 0) {
    resultadoDiv.innerHTML = `<p class="error">⚠️ Completa todos los campos.</p>`;
    ultimoCalculo = null;
    return;
  }

  const data = materiales[material];
  if (!data) {
    resultadoDiv.innerHTML = `<p class="error">⚠️ Material no válido.</p>`;
    ultimoCalculo = null;
    return;
  }

  const millares = unidades / 1000;

  if (data.tipo === "muro" && unidades < MIN_UNITS_MURO) {
    resultadoDiv.innerHTML = `
      <p class="error">
        ⚠️ Pedido mínimo para MURO: ${MIN_UNITS_MURO} unidades.
        <br>🚚 Los precios publicados son <strong>puestos en obra</strong>.
        <br>🧱 Para cantidades menores, aplica <strong>recojo en tienda</strong>.
      </p>`;
    ultimoCalculo = null;
    return;
  }

  let precioBase = data.precio;
  let precioMillar = precioBase;

  // Recargo por distrito
  let recargo = 0;
  if (recargosDistritos[distrito] && recargosDistritos[distrito][data.tipo] !== undefined) {
    recargo = recargosDistritos[distrito][data.tipo];
  }
  precioBase += recargo;
  precioMillar += recargo;

  let mensaje = "";
if (data.tipo === "muro" || data.tipo === "acabados") {
  if (millares >= 10) {
    precioMillar -= DISCOUNT_10;
    mensaje = `
      🎉 <strong>${millares.toFixed(2)} millares</strong> → 
      <span class="oferta">¡Super descuento de S/${DISCOUNT_10} por millar!</span> 💰🔥
      <br>✅ Estás ahorrando más en cada millar. ¡Excelente decisión!
    `;
  } else if (millares >= 3) {
    precioMillar -= DISCOUNT_3;
    const faltan = (10 - millares).toFixed(2);
    mensaje = `
      🔥 <strong>${millares.toFixed(2)} millares</strong> → 
      descuento de <span class="oferta">S/${DISCOUNT_3} por millar</span>. 🎊
      <br>💡 Si completas <strong>${faltan} millares más</strong> (total 10), 
      ¡tu descuento sube a <span class="oferta">S/${DISCOUNT_10} por millar</span>! 🚀
    `;
  } else {
    const faltan = (3 - millares).toFixed(2);
    mensaje = `
      ℹ️ Actualmente no aplica descuento.
      <br>👉 Si compras <strong>${faltan} millares más</strong> (total 3), 
      recibes <span class="oferta">S/${DISCOUNT_3} de descuento por millar</span>. 🎉
    `;
  }
}


  const precioUnitario = precioMillar / 1000;
  const total = unidades * precioUnitario;

  // Mostrar precio tachado solo si hubo descuento
  let precioHtml = (precioMillar < precioBase)
    ? `<s>S/ ${precioBase.toFixed(2)}</s> → <span class="precio-final">S/ ${precioMillar.toFixed(2)}</span>`
    : `S/ ${precioBase.toFixed(2)}`;

  resultadoDiv.innerHTML = `
    <p><strong>Material:</strong> ${material}</p>
    <p><strong>Cantidad:</strong> ${unidades} unidades (${millares.toFixed(2)} millares)</p>
    <p><strong>Precio por millar:</strong> ${precioHtml}</p>
    <p><strong>Subtotal:</strong> S/ ${total.toFixed(2)}</p>
    <p class="mensaje">${mensaje}</p>
  `;

  ultimoCalculo = {
    nombre, distrito, material,
    unidades, millares,
    precioBase, precioMillar, precioUnitario,
    total
  };
}

function agregarAlCarrito() {
  if (!ultimoCalculo) {
    alert("Primero ingresa la cantidad y se calculará automáticamente.");
    return;
  }

  const idx = carrito.findIndex(item => item.material === ultimoCalculo.material);

  if (idx !== -1) {
    carrito[idx].unidades += ultimoCalculo.unidades;
    carrito[idx].millares = carrito[idx].unidades / 1000;
    aplicarDescuentos(carrito[idx]);
  } else {
    carrito.push({ ...ultimoCalculo });
  }

  ultimoCalculo = null;
  mostrarCarrito();

  const resultadoDiv = document.getElementById("resultado");
  if (resultadoDiv) resultadoDiv.innerHTML = `<p>Producto añadido al carrito ✅</p>`;
}

function mostrarCarrito() {
  const cont = document.getElementById("carrito");
  if (!cont) return;

  cont.innerHTML = "";

  if (carrito.length === 0) {
    cont.innerHTML = "<p>🛒 Tu carrito está vacío.</p>";
    return;
  }

  let totalGeneral = 0;
  let nombreCliente = carrito[0].nombre || "";
  let distritoGeneral = carrito[0].distrito || "";

  carrito.forEach((item, idx) => {
    totalGeneral += item.total;
    cont.innerHTML += `
      <div class="item-carrito">
        <p><strong>${item.material}</strong></p>
        <p>
          <input type="number" class="input-cantidad-carrito" 
                 data-index="${idx}" 
                 value="${item.unidades}" min="1" step="100">
          unidades (${item.millares.toFixed(2)} millares)
        </p>
        <p>Precio x millar: S/${item.precioMillar.toFixed(2)}</p>
        <p>Subtotal: S/${item.total.toFixed(2)}</p>
        <button class="btn-eliminar" data-index="${idx}">❌ Eliminar</button>
      </div>
    `;
  });

  cont.innerHTML += `<h4>Total general: S/ ${totalGeneral.toFixed(2)}</h4>`;

  let mensaje = `Hola, quiero hacer este pedido:%0A`;
  if (nombreCliente) mensaje += `Cliente: ${encodeURIComponent(nombreCliente)}%0A`;
  if (distritoGeneral) mensaje += `Distrito: ${encodeURIComponent(distritoGeneral)}%0A%0A`;

  carrito.forEach(item => {
    mensaje += `- ${item.material}: ${item.unidades} u (${item.millares.toFixed(2)} millares)%0A`;
    mensaje += `   Precio x millar: S/${item.precioMillar.toFixed(2)} — Subtotal: S/${item.total.toFixed(2)}%0A%0A`;
  });

  mensaje += `%0ATotal: S/${totalGeneral.toFixed(2)}`;

  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`;
  cont.innerHTML += `<a class="btn-whatsapp" href="${waLink}" target="_blank">📲 Solicitar pedido por WhatsApp</a>`;
}

function editarCantidadCarrito(idx, nuevaCantidad) {
  if (idx < 0 || idx >= carrito.length) return;
  carrito[idx].unidades = nuevaCantidad;
  carrito[idx].millares = nuevaCantidad / 1000;
  aplicarDescuentos(carrito[idx]);
  mostrarCarrito();
}

function aplicarDescuentos(item) {
  let precioMillar = materiales[item.material].precio;
  const tipo = materiales[item.material].tipo;

  // Recargo por distrito
  let recargo = 0;
  if (recargosDistritos[item.distrito] && recargosDistritos[item.distrito][tipo] !== undefined) {
    recargo = recargosDistritos[item.distrito][tipo];
  }
  precioMillar += recargo;

  if (["muro", "acabados"].includes(tipo)) {
    if (item.millares >= 10) {
      precioMillar -= DISCOUNT_10;
    } else if (item.millares >= 3) {
      precioMillar -= DISCOUNT_3;
    }
  }

  item.precioMillar = precioMillar;
  item.precioUnitario = precioMillar / 1000;
  item.total = item.unidades * item.precioUnitario;
}

function eliminarItem(idx) {
  if (idx >= 0 && idx < carrito.length) {
    carrito.splice(idx, 1);
    mostrarCarrito();
  }
}

function getInputValue(id) {
  const el = document.getElementById(id);
  return el ? el.value : "";
}
