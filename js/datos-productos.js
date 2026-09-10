/**
 * datos-productos.js
 * "Base de datos" temporal del catálogo (sin backend en esta entrega).
 * Cada producto respeta las reglas de validación definidas en el Anexo 1:
 * codigo (texto, min 3), nombre (max 100), descripcion (opcional, max 500),
 * precio (min 0, decimales permitidos), stock (entero, min 0),
 * stockCritico (opcional, entero, min 0), categoria (select), imagen (opcional).
 *
 * Este archivo NO tiene lógica de interfaz: solo datos + un par de funciones
 * de ayuda (buscar producto, dar formato a precios). El resto de los .js
 * (main.js, carrito.js) importan estos datos con un <script> normal, por
 * eso todas las páginas cargan este archivo ANTES que los demás.
 */

// Categorías disponibles para el <select> de categoría (tienda y admin).
const CATEGORIAS = [
  "Juegos de Mesa",
  "Accesorios",
  "Consolas",
  "Computadores Gamers",
  "Sillas Gamers",
  "Mouse",
  "Mousepad",
  "Poleras Personalizadas",
  "Polerones Gamers Personalizados",
  "Servicio Técnico"
];

/**
 * Una ilustración SVG por categoría (carpeta img/), dibujada para este
 * proyecto -no son fotos reales de los productos-, así el catálogo se ve
 * completo sin depender de internet ni de bancos de imágenes con derechos.
 * Si más adelante consiguen fotos reales, basta con cambiar esta tabla.
 */
const IMAGEN_POR_CATEGORIA = {
  "Juegos de Mesa": "img/juegos-de-mesa.svg",
  "Accesorios": "img/accesorios.svg",
  "Consolas": "img/consolas.svg",
  "Computadores Gamers": "img/computadores-gamers.svg",
  "Sillas Gamers": "img/sillas-gamers.svg",
  "Mouse": "img/mouse.svg",
  "Mousepad": "img/mousepad.svg",
  "Poleras Personalizadas": "img/poleras-personalizadas.svg",
  "Polerones Gamers Personalizados": "img/polerones-gamers-personalizados.svg",
  "Servicio Técnico": "img/servicio-tecnico.svg"
};

// Catálogo de productos. "imagen" se resuelve automáticamente por categoría
// (ver imagenProducto() más abajo), así que no hace falta repetirla en cada
// objeto: si agregan un producto nuevo, solo con poner la categoría correcta
// ya le va a caer la ilustración adecuada.
const PRODUCTOS = [
  {
    codigo: "JM001",
    categoria: "Juegos de Mesa",
    nombre: "Catan",
    precio: 29990,
    stock: 18,
    stockCritico: 4,
    descripcion: "Clásico juego de estrategia donde los jugadores compiten por colonizar y expandirse en la isla de Catan. Ideal para 3-4 jugadores."
  },
  {
    codigo: "JM002",
    categoria: "Juegos de Mesa",
    nombre: "Carcassonne",
    precio: 24990,
    stock: 12,
    stockCritico: 3,
    descripcion: "Juego de colocación de fichas donde se construye el paisaje alrededor de la fortaleza medieval de Carcassonne. Ideal para 2-5 jugadores."
  },
  {
    codigo: "JM003",
    categoria: "Juegos de Mesa",
    nombre: "Dixit",
    precio: 27990,
    stock: 16,
    stockCritico: 4,
    descripcion: "Juego de cartas ilustradas y narración: adivina qué carta describió cada jugador con una pista. Ideal para 3-6 jugadores."
  },
  {
    codigo: "JM004",
    categoria: "Juegos de Mesa",
    nombre: "Ticket to Ride",
    precio: 32990,
    stock: 10,
    stockCritico: 3,
    descripcion: "Conecta ciudades construyendo rutas de tren por el mapa. Estrategia simple de aprender, difícil de dominar. Para 2-5 jugadores."
  },
  {
    codigo: "JM005",
    categoria: "Juegos de Mesa",
    nombre: "Bang! El Duelo",
    precio: 15990,
    stock: 25,
    stockCritico: 5,
    descripcion: "Versión para 2 jugadores del clásico juego de cartas del lejano oeste: roles secretos, faroles y balas. Partidas rápidas."
  },
  {
    codigo: "AC001",
    categoria: "Accesorios",
    nombre: "Controlador Inalámbrico Xbox Series X",
    precio: 59990,
    stock: 25,
    stockCritico: 5,
    descripcion: "Experiencia de juego cómoda con botones mapeables y respuesta táctil mejorada. Compatible con consolas Xbox y PC."
  },
  {
    codigo: "AC002",
    categoria: "Accesorios",
    nombre: "Auriculares Gamer HyperX Cloud II",
    precio: 79990,
    stock: 14,
    stockCritico: 3,
    descripcion: "Sonido envolvente de calidad, micrófono desmontable y almohadillas de espuma viscoelástica para sesiones largas."
  },
  {
    codigo: "CO001",
    categoria: "Consolas",
    nombre: "PlayStation 5",
    precio: 549990,
    stock: 6,
    stockCritico: 2,
    descripcion: "Consola de última generación de Sony: gráficos impresionantes y tiempos de carga ultrarrápidos."
  },
  {
    codigo: "CG001",
    categoria: "Computadores Gamers",
    nombre: "PC Gamer ASUS ROG Strix",
    precio: 1299990,
    stock: 4,
    stockCritico: 1,
    descripcion: "Equipo potente diseñado para los gamers más exigentes, con los últimos componentes para un rendimiento excepcional."
  },
  {
    codigo: "SG001",
    categoria: "Sillas Gamers",
    nombre: "Silla Gamer Secretlab Titan",
    precio: 349990,
    stock: 9,
    stockCritico: 2,
    descripcion: "Diseñada para el máximo confort: soporte ergonómico y personalización ajustable para sesiones prolongadas."
  },
  {
    codigo: "MS001",
    categoria: "Mouse",
    nombre: "Mouse Gamer Logitech G502 HERO",
    precio: 49990,
    stock: 30,
    stockCritico: 6,
    descripcion: "Sensor de alta precisión y botones personalizables, ideal para quienes buscan control preciso."
  },
  {
    codigo: "MP001",
    categoria: "Mousepad",
    nombre: "Mousepad Razer Goliathus Extended Chroma",
    precio: 29990,
    stock: 20,
    stockCritico: 4,
    descripcion: "Área de juego amplia con iluminación RGB personalizable y superficie suave y uniforme."
  },
  {
    codigo: "PP001",
    categoria: "Poleras Personalizadas",
    nombre: "Polera Gamer Personalizada 'Level-Up'",
    precio: 14990,
    stock: 40,
    stockCritico: 8,
    descripcion: "Camiseta cómoda y estilizada, personalizable con tu gamer tag o diseño favorito."
  },
  {
    codigo: "PG001",
    categoria: "Polerones Gamers Personalizados",
    nombre: "Polerón Gamer Personalizado 'Level-Up'",
    precio: 24990,
    stock: 22,
    stockCritico: 5,
    descripcion: "Polerón abrigado y personalizable, pensado para maratones de juego largas."
  },
  {
    codigo: "ST001",
    categoria: "Servicio Técnico",
    nombre: "Diagnóstico y Mantención de PC Gamer",
    precio: 19990,
    stock: 0,
    stockCritico: 0,
    descripcion: "Revisión, limpieza y optimización de tu equipo por técnicos Level-Up Gamer (producto FREE de diagnóstico presencial)."
  }
];

/** Busca un producto por su código (JM001, AC002, etc). Devuelve undefined si no existe. */
function obtenerProductoPorCodigo(codigo){
  return PRODUCTOS.find(function(p){ return p.codigo === codigo; });
}

/** Ruta de la imagen a usar para un producto: la propia si la tiene, si no la de su categoría. */
function imagenProducto(producto){
  return producto.imagen || IMAGEN_POR_CATEGORIA[producto.categoria] || "img/servicio-tecnico.svg";
}

/** Da formato de precio chileno: 29990 -> "$29.990". */
function formatoCLP(valor){
  return "$" + Number(valor).toLocaleString("es-CL");
}
