/**
 * main.js
 * Funciones de renderizado que arman el DOM a partir de los arreglos de
 * datos (PRODUCTOS, REGIONES). Cada página llama solo a lo que necesita.
 */

/** Dibuja tarjetas de producto dentro de un contenedor, con enlace al detalle. */
function renderizarGrillaProductos(idContenedor, listaProductos){
  const contenedor = document.getElementById(idContenedor);
  if (!contenedor) return;
  contenedor.innerHTML = listaProductos.map(function(p){
    return (
      '<article class="tarjeta-producto">' +
        '<a href="producto-detalle.html?codigo=' + p.codigo + '">' +
          // imagenProducto() (definida en datos-productos.js) resuelve la ilustración:
          // la propia del producto si tiene "imagen", si no la de su categoría.
          '<div class="producto-img"><img src="' + imagenProducto(p) + '" alt="' + p.nombre + '" loading="lazy"></div>' +
        '</a>' +
        '<div class="cuerpo">' +
          '<span class="categoria">' + p.categoria + '</span>' +
          '<h3><a href="producto-detalle.html?codigo=' + p.codigo + '">' + p.nombre + '</a></h3>' +
          (p.stockCritico && p.stock <= p.stockCritico
            ? '<span class="stock-critico">¡Stock bajo! quedan ' + p.stock + '</span>' : '') +
          '<span class="precio">' + formatoCLP(p.precio) + '</span>' +
          '<button class="btn btn-primario btn-sm" data-agregar-carrito="' + p.codigo + '">Añadir al carrito</button>' +
        '</div>' +
      '</article>'
    );
  }).join("");

  contenedor.querySelectorAll("[data-agregar-carrito]").forEach(function(boton){
    boton.addEventListener("click", function(){
      agregarAlCarrito(boton.getAttribute("data-agregar-carrito"), 1);
      boton.textContent = "Añadido ✓";
      setTimeout(function(){ boton.textContent = "Añadir al carrito"; }, 1200);
    });
  });
}

/** Filtro simple por categoría, usado en productos.html. */
function inicializarFiltroCategorias(idSelect, idContenedorGrilla){
  const select = document.getElementById(idSelect);
  if (!select) return;
  select.innerHTML = '<option value="">Todas las categorías</option>' +
    CATEGORIAS.map(function(c){ return '<option value="' + c + '">' + c + '</option>'; }).join("");
  select.addEventListener("change", function(){
    const filtrados = select.value
      ? PRODUCTOS.filter(function(p){ return p.categoria === select.value; })
      : PRODUCTOS;
    renderizarGrillaProductos(idContenedorGrilla, filtrados);
  });
}

/** Pinta el detalle de un producto según el parámetro ?codigo= de la URL. */
function renderizarDetalleProducto(){
  const parametros = new URLSearchParams(window.location.search);
  const codigo = parametros.get("codigo");
  const producto = obtenerProductoPorCodigo(codigo) || PRODUCTOS[0];

  document.title = producto.nombre + " · Level-Up Gamer";
  document.getElementById("detalle-icono").innerHTML =
    '<img src="' + imagenProducto(producto) + '" alt="' + producto.nombre + '">';
  document.getElementById("detalle-categoria").textContent = producto.categoria;
  document.getElementById("detalle-nombre").textContent = producto.nombre;
  document.getElementById("detalle-precio").textContent = formatoCLP(producto.precio);
  document.getElementById("detalle-descripcion").textContent = producto.descripcion;
  document.getElementById("detalle-miga-nombre").textContent = producto.nombre;

  const avisoStock = document.getElementById("detalle-stock");
  if (producto.stockCritico && producto.stock <= producto.stockCritico){
    avisoStock.textContent = "¡Stock crítico! Quedan solo " + producto.stock + " unidades.";
    avisoStock.style.display = "block";
  } else {
    avisoStock.style.display = "none";
  }

  const botonAgregar = document.getElementById("detalle-agregar");
  botonAgregar.addEventListener("click", function(){
    const cantidad = Math.max(1, parseInt(document.getElementById("detalle-cantidad").value, 10) || 1);
    agregarAlCarrito(producto.codigo, cantidad);
    botonAgregar.textContent = "Añadido al carrito ✓";
    setTimeout(function(){ botonAgregar.textContent = "Añadir al carrito"; }, 1400);
  });

  // Productos relacionados: misma categoría, excluyendo el actual.
  const relacionados = PRODUCTOS.filter(function(p){
    return p.categoria === producto.categoria && p.codigo !== producto.codigo;
  }).slice(0, 4);
  renderizarGrillaProductos("detalle-relacionados", relacionados.length ? relacionados : PRODUCTOS.slice(0, 4));
}

/**
 * Dibuja el carrito completo con controles de cantidad y total.
 * "sufijo" permite reutilizar esta misma función en dos lugares con ids
 * distintos: la página carrito.html (sufijo "") y el panel lateral de acceso
 * rápido que se abre desde el ícono 🛒 del header (sufijo "-panel", ver
 * montarPanelCarrito() más abajo). Así no hay dos copias del mismo código.
 */
function renderizarCarrito(sufijo){
  sufijo = sufijo || "";
  const carrito = obtenerCarrito();
  const contenedorItems = document.getElementById("carrito-items" + sufijo);
  const contenedorVacio = document.getElementById("carrito-vacio" + sufijo);
  const resumen = document.getElementById("carrito-resumen" + sufijo);
  if (!contenedorItems || !contenedorVacio || !resumen) return;

  // Un pago simulado anterior puede haber dejado un mensaje de confirmación:
  // se limpia cada vez que se vuelve a dibujar el carrito con productos.
  const mensajePrevio = document.getElementById("mensaje-pago" + sufijo);
  if (mensajePrevio) mensajePrevio.innerHTML = "";

  if (!carrito.length){
    contenedorItems.innerHTML = "";
    contenedorVacio.style.display = "block";
    resumen.style.display = "none";
    return;
  }
  contenedorVacio.style.display = "none";
  resumen.style.display = "block";

  contenedorItems.innerHTML = carrito.map(function(item){
    const producto = obtenerProductoPorCodigo(item.codigo);
    if (!producto) return "";
    return (
      '<div class="carrito-item">' +
        '<div class="mini-img"><img src="' + imagenProducto(producto) + '" alt="' + producto.nombre + '"></div>' +
        '<div><strong>' + producto.nombre + '</strong><br><span>' + formatoCLP(producto.precio) + ' c/u</span></div>' +
        '<div class="carrito-cantidad">' +
          '<button data-restar="' + producto.codigo + '">−</button>' +
          '<span>' + item.cantidad + '</span>' +
          '<button data-sumar="' + producto.codigo + '">+</button>' +
        '</div>' +
        '<strong>' + formatoCLP(producto.precio * item.cantidad) + '</strong>' +
      '</div>'
    );
  }).join("");

  contenedorItems.querySelectorAll("[data-sumar]").forEach(function(b){
    b.addEventListener("click", function(){
      const item = carrito.find(function(i){ return i.codigo === b.dataset.sumar; });
      actualizarCantidadCarrito(b.dataset.sumar, item.cantidad + 1);
      renderizarCarrito(sufijo);
    });
  });
  contenedorItems.querySelectorAll("[data-restar]").forEach(function(b){
    b.addEventListener("click", function(){
      const item = carrito.find(function(i){ return i.codigo === b.dataset.restar; });
      actualizarCantidadCarrito(b.dataset.restar, item.cantidad - 1);
      renderizarCarrito(sufijo);
    });
  });

  document.getElementById("carrito-total" + sufijo).textContent = formatoCLP(totalPrecioCarrito());
}

/**
 * Reglas del pago simulado, separadas de cualquier detalle visual para que las
 * pueda usar tanto carrito.html como el panel lateral: el carrito no puede
 * estar vacío, y -como en una tienda real- hay que tener sesión iniciada para
 * pagar. No hay pasarela de pago real (no correspondía en esta entrega): si
 * todo está OK, se vacía el carrito y se devuelve el total que se "pagó".
 */
function procesarPago(){
  const carrito = obtenerCarrito();
  if (!carrito.length) return { ok: false, motivo: "vacio" };
  if (!obtenerSesion()) return { ok: false, motivo: "sesion" };

  const total = totalPrecioCarrito();
  vaciarCarrito();
  return { ok: true, total: total };
}

/**
 * Ejecuta procesarPago() y refleja el resultado en la interfaz (mensaje de
 * éxito o de "inicia sesión para pagar", carrito vaciado si correspondía).
 * "sufijo" es el mismo que usa renderizarCarrito(): "" para carrito.html,
 * "-panel" para el panel lateral.
 */
function finalizarCompra(sufijo){
  sufijo = sufijo || "";
  const resultado = procesarPago();
  const resumen = document.getElementById("carrito-resumen" + sufijo);
  const vacio = document.getElementById("carrito-vacio" + sufijo);
  const contenedorMensaje = document.getElementById("mensaje-pago" + sufijo);

  if (resultado.motivo === "vacio") return; // nada que pagar, no se muestra nada

  if (!resultado.ok){
    // motivo === "sesion": no dejamos pagar sin cuenta, pero sí explicamos por qué.
    mostrarMensajePago(contenedorMensaje, resumen, "error",
      'Debes <a href="login.html">iniciar sesión</a> para finalizar la compra.');
    return;
  }

  renderizarCarrito(sufijo);
  resumen.style.display = "none";
  mostrarMensajePago(contenedorMensaje, vacio, "exito",
    "¡Compra simulada con éxito! Total pagado: " + formatoCLP(resultado.total) +
    ". Gracias por tu compra en Level-Up Gamer.");
}

/** Inserta (o reemplaza) el mensaje de resultado del pago justo antes de "antesDe". */
function mostrarMensajePago(contenedorMensaje, antesDe, tipo, html){
  const mensaje = document.createElement("div");
  mensaje.className = "alerta-formulario " + tipo + " visible";
  mensaje.style.marginBottom = "16px";
  mensaje.innerHTML = html;
  if (contenedorMensaje){
    contenedorMensaje.innerHTML = "";
    contenedorMensaje.appendChild(mensaje);
  } else if (antesDe && antesDe.parentElement){
    antesDe.parentElement.insertBefore(mensaje, antesDe);
  }
}

/**
 * Arma e inyecta el panel lateral de carrito (acceso rápido desde cualquier
 * página, sin tener que ir a carrito.html) y hace que el ícono 🛒 del header
 * lo abra en vez de navegar. No se monta en carrito.html (ya tiene el carrito
 * completo en la página) ni en el panel admin (no tiene ese ícono).
 */
function montarPanelCarrito(){
  const enlaceCarrito = document.querySelector(".carrito-link");
  if (!enlaceCarrito || document.getElementById("panel-carrito")) return;
  if (/carrito\.html$/.test(window.location.pathname)) return;

  document.body.insertAdjacentHTML("beforeend",
    '<div class="panel-overlay" id="panel-carrito-overlay"></div>' +
    '<aside class="panel-carrito" id="panel-carrito" aria-hidden="true">' +
      '<div class="panel-carrito-header">' +
        '<h3>Tu carrito</h3>' +
        '<button class="panel-carrito-cerrar" id="panel-carrito-cerrar" aria-label="Cerrar carrito">✕</button>' +
      '</div>' +
      '<div class="panel-carrito-cuerpo">' +
        '<div class="carrito-tabla" id="carrito-items-panel"></div>' +
        '<div class="carrito-vacio" id="carrito-vacio-panel" style="display:none;">' +
          '<p>Tu carrito está vacío.</p>' +
          '<a href="productos.html" class="btn btn-primario">Ver productos</a>' +
        '</div>' +
      '</div>' +
      '<div class="carrito-resumen panel-carrito-resumen" id="carrito-resumen-panel">' +
        '<div class="total"><span>Total</span><span id="carrito-total-panel">$0</span></div>' +
        '<div id="mensaje-pago-panel"></div>' +
        '<button class="btn btn-exito btn-bloque" id="btn-pagar-panel">Pagar</button>' +
        '<a href="carrito.html" class="btn btn-secundario btn-bloque" style="margin-top:8px;">Ver carrito completo</a>' +
      '</div>' +
    '</aside>'
  );

  const overlay = document.getElementById("panel-carrito-overlay");
  const panel = document.getElementById("panel-carrito");

  function abrirPanel(){
    renderizarCarrito("-panel");
    overlay.classList.add("visible");
    panel.classList.add("abierto");
    panel.setAttribute("aria-hidden", "false");
  }
  function cerrarPanel(){
    overlay.classList.remove("visible");
    panel.classList.remove("abierto");
    panel.setAttribute("aria-hidden", "true");
  }

  enlaceCarrito.addEventListener("click", function(e){ e.preventDefault(); abrirPanel(); });
  document.getElementById("panel-carrito-cerrar").addEventListener("click", cerrarPanel);
  overlay.addEventListener("click", cerrarPanel);
  document.getElementById("btn-pagar-panel").addEventListener("click", function(){ finalizarCompra("-panel"); });
}
document.addEventListener("DOMContentLoaded", montarPanelCarrito);

/** Llena selects encadenados de Región / Comuna. */
function inicializarRegionComuna(idSelectRegion, idSelectComuna){
  const selectRegion = document.getElementById(idSelectRegion);
  const selectComuna = document.getElementById(idSelectComuna);
  if (!selectRegion || !selectComuna) return;

  selectRegion.innerHTML = '<option value="">-- Seleccione la región --</option>' +
    REGIONES.map(function(r){ return '<option value="' + r.region + '">' + r.region + '</option>'; }).join("");

  function actualizarComunas(){
    const comunas = obtenerComunas(selectRegion.value);
    selectComuna.innerHTML = '<option value="">-- Seleccione la comuna --</option>' +
      comunas.map(function(c){ return '<option value="' + c + '">' + c + '</option>'; }).join("");
  }
  selectRegion.addEventListener("change", actualizarComunas);
  actualizarComunas();
}
