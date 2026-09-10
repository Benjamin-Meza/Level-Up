/**
 * sesion.js
 * Simulación de sesión y roles en el frontend (aún sin backend/base de datos).
 * Roles del sistema (ver Anexo 1):
 *  - Administrador: acceso total.
 *  - Vendedor: solo ve listado/detalle de productos y de órdenes.
 *  - Cliente: solo accede a la tienda pública.
 */

const CLAVE_SESION = "levelup_sesion";

function guardarSesion(usuario){
  try {
    localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario));
  } catch (e){ /* localStorage no disponible */ }
}

function obtenerSesion(){
  try {
    const datos = localStorage.getItem(CLAVE_SESION);
    return datos ? JSON.parse(datos) : null;
  } catch (e){
    return null;
  }
}

function cerrarSesion(){
  try { localStorage.removeItem(CLAVE_SESION); } catch (e){}
  window.location.href = "/login.html";
}

/**
 * Protege las páginas del panel administrador: si no hay sesión o el usuario
 * es "Cliente", se redirige al login. Además oculta del menú lateral las
 * opciones que el rol Vendedor no debe ver.
 */
function protegerAdmin(){
  const usuario = obtenerSesion();
  if (!usuario || usuario.tipoUsuario === "Cliente"){
    window.location.href = "../login.html";
    return null;
  }
  aplicarPermisosVendedor(usuario);
  return usuario;
}

function aplicarPermisosVendedor(usuario){
  if (usuario.tipoUsuario !== "Vendedor") return;
  // El Vendedor solo puede ver productos y órdenes: se ocultan el resto de accesos.
  document.querySelectorAll("[data-solo-admin]").forEach(function(el){
    el.style.display = "none";
  });
}

function pintarBarraSesion(){
  const usuario = obtenerSesion();
  const contenedor = document.querySelector("[data-sesion-usuario]");
  if (!contenedor) return;
  if (usuario){
    contenedor.innerHTML =
      '<span>Hola, ' + usuario.nombre + ' (' + usuario.tipoUsuario + ')</span>' +
      '<a href="#" data-cerrar-sesion>Cerrar sesión</a>';
    const link = contenedor.querySelector("[data-cerrar-sesion]");
    if (link) link.addEventListener("click", function(e){ e.preventDefault(); cerrarSesion(); });
  } else {
    contenedor.innerHTML = '<a href="login.html">Iniciar sesión</a> | <a href="registro.html">Registrarse</a>';
  }
}

document.addEventListener("DOMContentLoaded", pintarBarraSesion);
