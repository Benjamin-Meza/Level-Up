/**
 * datos-usuarios.js
 * Usuarios de ejemplo para poder iniciar sesión y ver los 3 roles del
 * sistema sin backend todavía. Los RUN usados son válidos según el
 * algoritmo de dígito verificador (verifícalo en validaciones.js).
 *
 * Cuentas de prueba:
 *   admin@duoc.cl     / admin123   -> Administrador (acceso total)
 *   vendedor@gmail.com/ vend123    -> Vendedor (solo productos y órdenes)
 *   cualquier otro correo válido   -> se registra como Cliente
 */

const USUARIOS = [
  {
    run: "123456785",
    nombre: "Administradora",
    apellidos: "Level-Up",
    correo: "admin@duoc.cl",
    contrasena: "admin123",
    tipoUsuario: "Administrador",
    region: "Región Metropolitana de Santiago",
    comuna: "Maipú",
    direccion: "Av. Principal 123"
  },
  {
    run: "987654325",
    nombre: "Vendedor",
    apellidos: "Demo",
    correo: "vendedor@gmail.com",
    contrasena: "vend123",
    tipoUsuario: "Vendedor",
    region: "Región de Ñuble",
    comuna: "Chillán",
    direccion: "Calle Comercio 456"
  }
];

function buscarUsuarioPorCorreo(correo){
  return USUARIOS.find(function(u){ return u.correo.toLowerCase() === (correo || "").toLowerCase(); });
}

/** Guarda (o reemplaza) un usuario en el arreglo en memoria + localStorage de usuarios registrados. */
function registrarUsuario(usuario){
  const registrados = obtenerUsuariosRegistrados();
  registrados.push(usuario);
  try { localStorage.setItem("levelup_usuarios", JSON.stringify(registrados)); } catch(e){}
}

function obtenerUsuariosRegistrados(){
  try {
    const datos = localStorage.getItem("levelup_usuarios");
    return datos ? JSON.parse(datos) : [];
  } catch (e){
    return [];
  }
}

/** Une usuarios "de fábrica" + los registrados en este navegador. */
function obtenerTodosLosUsuarios(){
  return USUARIOS.concat(obtenerUsuariosRegistrados());
}
