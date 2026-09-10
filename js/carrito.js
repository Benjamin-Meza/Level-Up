/**
 * carrito.js
 * Lógica del carrito de compras usando localStorage, tal como pide el Anexo 1.
 * Estructura guardada: [{ codigo, cantidad }, ...] -- solo se guarda el código y
 * la cantidad; el resto de los datos del producto (nombre, precio, imagen, etc.)
 * se busca en PRODUCTOS cada vez que hace falta, así el carrito nunca queda
 * "desincronizado" del catálogo.
 */

const CLAVE_CARRITO = "levelup_carrito"; // nombre de la clave dentro de localStorage

/**
 * Comprueba que localStorage realmente funcione en este contexto y, si no,
 * lo avisa con un banner bien visible en vez de fallar en silencio.
 *
 * Por qué existe esto: el carrito (este archivo) y la sesión (sesion.js)
 * dependen 100% de localStorage, y sus funciones atrapan cualquier error con
 * try/catch para no romper la página -- pero eso significa que si
 * localStorage no está disponible, todo se ve normal a simple vista mientras
 * el carrito nunca suma nada y el login nunca "recuerda" la sesión. Esto pasa
 * sobre todo cuando se abren los .html con doble clic (protocolo file://):
 * varios navegadores restringen o bloquean el almacenamiento local ahí. La
 * solución no es un parche en JS (ningún navegador lo permite de forma
 * confiable bajo file://): es abrir el proyecto a través de un servidor
 * local (ver iniciar-servidor.sh / iniciar-servidor.bat y el README). Se
 * pone acá -y no en main.js- porque carrito.js se carga en TODAS las
 * páginas, incluido el panel admin.
 */
function verificarAlmacenamientoLocal(){
  let funciona = true;
  try {
    localStorage.setItem("levelup_test", "1");
    funciona = localStorage.getItem("levelup_test") === "1";
    localStorage.removeItem("levelup_test");
  } catch (e){
    funciona = false;
  }
  if (funciona) return;

  const banner = document.createElement("div");
  banner.setAttribute("role", "alert");
  banner.style.cssText =
    "background:#3a1414; color:#ff9c9c; border-bottom:2px solid #ff5c5c;" +
    "padding:12px 20px; text-align:center; font-size:13.5px; line-height:1.5;" +
    "position:relative; z-index:60;";
  banner.innerHTML =
    "⚠️ <strong>El carrito y la sesión no van a funcionar así.</strong> " +
    "Tu navegador está bloqueando el almacenamiento local en este contexto " +
    "(pasa al abrir los archivos con doble clic, protocolo <code>file://</code>). " +
    "Corre un servidor local en la carpeta del proyecto -doble clic en " +
    "<code>iniciar-servidor.bat</code> (Windows) o <code>iniciar-servidor.sh</code> " +
    "(Mac/Linux), o <code>python3 -m http.server 8000</code>- y abre " +
    "<code>http://localhost:8000</code> en el navegador.";
  document.body.insertBefore(banner, document.body.firstChild);
}
document.addEventListener("DOMContentLoaded", verificarAlmacenamientoLocal);

/** Lee el carrito guardado en localStorage. Si no hay nada o está corrupto, devuelve []. */
function obtenerCarrito(){
  try {
    const datos = localStorage.getItem(CLAVE_CARRITO);
    return datos ? JSON.parse(datos) : [];
  } catch (e){
    return [];
  }
}

/** Guarda el arreglo del carrito en localStorage y refresca el contador del header. */
function guardarCarrito(carrito){
  try {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
  } catch (e){ /* localStorage no disponible: se ignora silenciosamente */ }
  actualizarContadorCarrito();
}

/** Agrega "cantidad" unidades de un producto; si ya estaba en el carrito, suma. */
function agregarAlCarrito(codigo, cantidad){
  cantidad = cantidad || 1;
  const carrito = obtenerCarrito();
  const item = carrito.find(function(i){ return i.codigo === codigo; });
  if (item){
    item.cantidad += cantidad;
  } else {
    carrito.push({ codigo: codigo, cantidad: cantidad });
  }
  guardarCarrito(carrito);
}

/** Cambia la cantidad de un producto ya agregado; 0 o menos lo elimina del carrito. */
function actualizarCantidadCarrito(codigo, cantidad){
  let carrito = obtenerCarrito();
  if (cantidad <= 0){
    carrito = carrito.filter(function(i){ return i.codigo !== codigo; });
  } else {
    const item = carrito.find(function(i){ return i.codigo === codigo; });
    if (item) item.cantidad = cantidad;
  }
  guardarCarrito(carrito);
}

/** Saca un producto del carrito por completo, sin importar la cantidad. */
function eliminarDelCarrito(codigo){
  const carrito = obtenerCarrito().filter(function(i){ return i.codigo !== codigo; });
  guardarCarrito(carrito);
}

/** Deja el carrito completamente vacío (se usa al simular el pago en carrito.html). */
function vaciarCarrito(){
  guardarCarrito([]);
}

/** Suma la cantidad de TODOS los productos del carrito (para el contador del header). */
function totalUnidadesCarrito(){
  return obtenerCarrito().reduce(function(acc, i){ return acc + i.cantidad; }, 0);
}

/** Calcula el total a pagar: precio × cantidad de cada línea, sumado. */
function totalPrecioCarrito(){
  return obtenerCarrito().reduce(function(acc, i){
    const producto = obtenerProductoPorCodigo(i.codigo);
    return producto ? acc + producto.precio * i.cantidad : acc;
  }, 0);
}

/** Actualiza el contador del ícono de carrito en el header (todas las páginas). */
function actualizarContadorCarrito(){
  const contador = document.querySelector("[data-contador-carrito]");
  if (contador) contador.textContent = totalUnidadesCarrito();
}

// El contador del header debe verse actualizado apenas carga cualquier página,
// no solo carrito.html -- por eso se engancha aquí y no en main.js.
document.addEventListener("DOMContentLoaded", actualizarContadorCarrito);
