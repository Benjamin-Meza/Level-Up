# Level-Up Gamer — Explicación del proyecto (para entenderlo y presentarlo)

Este documento no es el ERS ni un entregable formal: es una guía para **ti**, pensada para
que entiendas a fondo cada parte del código antes de la presentación individual (Situación
evaluativa 2, 60% de la nota de EP1). Está escrita en base a la rúbrica real de la EP1
(`Anexo 1` y la pauta de evaluación), así que al final vas a encontrar, indicador por
indicador, qué se espera que expliques y dónde mirar el código para poder hacerlo con
confianza.

> **Importante sobre honestidad académica:** este código fue construido como material de
> estudio para que analices un ejemplo completo y funcional, no para presentarlo como si lo
> hubieras escrito tú sin entenderlo. La evaluación de la presentación es **individual**: te
> van a preguntar por qué se hizo algo de una forma y no de otra, así que la idea es que uses
> este documento para poder responder eso con tus propias palabras. Si tu equipo ya tiene su
> propio avance, usa esto como referencia/comparación, no como reemplazo directo.

---

## 1. Qué es este proyecto

Es el frontend de una tienda online ficticia, **Level-Up Gamer**, basada en el caso "Forma
B" de la EP1: venta de consolas, computadores, sillas, accesorios y ahora también juegos de
mesa, con un panel de administración simple. No hay backend ni base de datos real: todo el
"guardado" de datos (carrito, usuarios registrados, sesión activa) vive en el
`localStorage` del navegador. Esto es intencional y coherente con lo que pide la EP1 para
esta primera entrega (HTML + CSS + JS puro, sin frameworks ni servidor).

### 1.1 Estructura de carpetas

```
levelup-gamer/
├── index.html              → Home (portada + destacados)
├── productos.html          → Catálogo completo con filtro por categoría
├── producto-detalle.html   → Ficha de un producto (?codigo=XXX en la URL)
├── carrito.html            → Carrito de compras
├── registro.html           → Crear cuenta
├── login.html               → Iniciar sesión
├── nosotros.html, blogs.html, blog-detalle-*.html, contacto.html
├── css/
│   └── style.css           → TODOS los estilos del sitio (una sola hoja externa)
├── js/
│   ├── datos-productos.js  → Catálogo de productos + imágenes por categoría
│   ├── datos-regiones.js   → Regiones/comunas de Chile para los formularios
│   ├── datos-usuarios.js   → Usuarios "sembrados" + funciones de registro/login
│   ├── validaciones.js     → Funciones de validación reutilizables (RUN, correo, etc.)
│   ├── carrito.js          → Lógica del carrito sobre localStorage
│   ├── sesion.js           → Guardar/leer sesión activa, proteger páginas por rol
│   └── main.js             → Funciones que "pintan" HTML a partir de los datos
├── img/                    → Ilustraciones SVG propias, una por categoría de producto
└── admin/
    ├── index.html, ordenes.html, productos.html, producto-form.html,
    │   usuarios.html, usuario-form.html   → Panel de administración
```

Cada página HTML es independiente (no hay router ni SPA): todas cargan los mismos archivos
`.js` con `<script>` normales, en un orden fijo que se explica en el punto 2.2.

---

## 2. Arquitectura general: cómo se conectan HTML, CSS y JS

### 2.1 Sin backend, con localStorage

No existe una base de datos real. En su lugar:

- **`PRODUCTOS`** (en `datos-productos.js`) es un arreglo de JavaScript cargado directo en
  memoria: es el catálogo "de fábrica". Si el admin agrega un producto nuevo desde el panel,
  se agrega a ese mismo arreglo *en memoria* — por eso, si recargas la página, el producto
  nuevo desaparece (no hay persistencia entre sesiones para el catálogo). Esto es una
  limitación conocida y aceptable para esta entrega: no hay backend todavía.
- **El carrito, los usuarios registrados y la sesión activa sí persisten**, porque se
  guardan explícitamente en `localStorage` (que sobrevive a recargar o cerrar la pestaña).
  Esa es la diferencia clave que te pueden preguntar: "¿por qué el carrito sí se mantiene y
  el catálogo no?"

### 2.2 Orden de carga de los `<script>`

Todas las páginas cargan los `.js` en este orden, y el orden importa:

```html
<script src="js/datos-productos.js"></script>
<script src="js/datos-regiones.js"></script>
<script src="js/datos-usuarios.js"></script>  <!-- solo donde se necesita -->
<script src="js/validaciones.js"></script>
<script src="js/carrito.js"></script>
<script src="js/sesion.js"></script>
<script src="js/main.js"></script>
```

Primero van los **datos** (catálogo, regiones, usuarios), después las **funciones de
utilidad** (validaciones, carrito, sesión), y **al final `main.js`**, porque `main.js` usa
funciones definidas en todos los anteriores (por ejemplo, `renderizarCarrito()` llama a
`obtenerCarrito()` de `carrito.js` y a `obtenerProductoPorCodigo()` de
`datos-productos.js`). Como son scripts sin módulos (no `import`/`export`), JavaScript los
ejecuta en el orden en que aparecen en el HTML, y todo lo que declaran queda disponible como
variables/funciones globales para los scripts que vienen después.

### 2.3 El patrón "datos → render"

Casi toda página sigue el mismo patrón:

1. El HTML tiene un contenedor vacío (`<div id="grilla-productos"></div>`).
2. Un script al final de la página llama a una función de `main.js` (por ejemplo,
   `renderizarGrillaProductos("grilla-productos", PRODUCTOS)`).
3. Esa función arma un string de HTML a partir de los datos (con `.map().join("")`) y lo
   inserta con `innerHTML`.
4. Después de insertar el HTML, se enganchan los `addEventListener` a los botones recién
   creados (por ejemplo, "Añadir al carrito").

Esto es deliberadamente simple (sin frameworks como React/Vue), tal como pide esta primera
entrega, pero mantiene una separación clara: **los datos no saben nada de HTML, y el HTML
no tiene datos hardcodeados** — todo se genera desde JS.

---

## 3. Archivo por archivo

### 3.1 `js/datos-productos.js`

Contiene:

- `CATEGORIAS`: las 10 categorías disponibles (usadas tanto en el filtro de la tienda como
  en el `<select>` del formulario de producto del admin).
- `IMAGEN_POR_CATEGORIA`: un objeto que mapea cada categoría a un archivo SVG en `img/`.
  Esto es lo que permite que **todo producto tenga una imagen sin tener que asignarla a
  mano uno por uno**.
- `PRODUCTOS`: el catálogo (15 productos, 5 de ellos juegos de mesa). Cada producto respeta
  los campos que pide el Anexo 1: `codigo`, `nombre`, `descripcion`, `precio`, `stock`,
  `stockCritico`, `categoria`, y un campo opcional `imagen` (solo si quieres una imagen
  distinta a la de su categoría).
- `obtenerProductoPorCodigo(codigo)`: busca un producto por su código. La usan
  `producto-detalle.html` (para saber qué producto mostrar según la URL) y el carrito (para
  completar nombre/precio/imagen a partir del código guardado).
- `imagenProducto(producto)`: función chica pero importante — devuelve
  `producto.imagen` si existe, si no la imagen de su categoría, y si tampoco hay categoría
  reconocida, una imagen por defecto. Así nunca queda un producto sin imagen.
- `formatoCLP(valor)`: da formato de peso chileno (29990 → "$29.990") usando
  `Number.toLocaleString("es-CL")`.

**Por qué las imágenes son SVG dibujados y no fotos reales:** para que el sitio funcione
100% offline y sin depender de bancos de imágenes con derechos de autor o de internet para
cargar. Son ilustraciones simples (controlador, consola, silla, polera, etc.) con la misma
paleta de colores del sitio (fondo oscuro, azul y verde neón).

### 3.2 `js/datos-regiones.js` y `js/datos-usuarios.js`

- `datos-regiones.js` trae el arreglo `REGIONES` (región + lista de comunas) y
  `obtenerComunas(region)`, que se usa para encadenar los `<select>` de Región/Comuna en el
  registro (`inicializarRegionComuna()` en `main.js`).
- `datos-usuarios.js` "siembra" un par de usuarios de ejemplo (uno Administrador, uno
  Cliente) en `localStorage` la primera vez que se carga el sitio, y expone
  `registrarUsuario()`, `obtenerTodosLosUsuarios()` y funciones para validar login. Esto
  simula una base de datos de usuarios sin backend real.

### 3.3 `js/validaciones.js`

Funciones puras y reutilizables (reciben un valor, devuelven `true`/`false`), sin tocar el
DOM directamente salvo `mostrarError()` / `ocultarError()` / `mostrarAlertaFormulario()`,
que son las encargadas de mostrar/ocultar los mensajes de error junto a cada campo. Entre
las más importantes:

- `validarRun(run)`: implementa el algoritmo real de verificación del RUN chileno (módulo
  11), no solo un chequeo de formato. Esto es justamente lo que te van a pedir explicar en
  el indicador **IE1.2.1 / IE1.2.2** (validaciones con JavaScript): no basta con decir "se
  valida", hay que poder explicar *cómo* — el dígito verificador se calcula multiplicando
  cada dígito del RUN (de derecha a izquierda) por una secuencia cíclica 2,3,4,5,6,7, sumando
  todo, y comparando el resto de esa suma contra el dígito verificador ingresado.
- `validarCorreoPermitido(correo)`: solo permite `@duoc.cl`, `@profesor.duoc.cl` o
  `@gmail.com`, con una expresión regular. Esto viene directo del caso "Forma B" (regla de
  negocio: dominios de correo permitidos + descuento si usas correo Duoc).
- `validarContrasena(valor)`: largo entre 4 y 10 caracteres, tal como pide el Anexo 1.
- `validarRequerido`, `validarLargo`, `validarNumero`, `validarEntero`: validaciones
  genéricas de formulario (campo obligatorio, largo mínimo/máximo, rango numérico), usadas
  en varios formularios (registro, producto, usuario) para no repetir la misma lógica.

Cada formulario del sitio (registro, login, producto del admin, usuario del admin) llama a
estas funciones campo por campo en el evento `submit`, evita que el formulario se envíe si
algo falla (`e.preventDefault()` + una bandera `esValido`), y muestra el mensaje de error
específico junto al campo que falló — eso es lo que pide el indicador sobre "mensajes de
error y sugerencias claras, específicas, en el contexto adecuado".

### 3.4 `js/carrito.js`

Todo el carrito gira en torno a una sola clave de `localStorage`
(`levelup_carrito`), guardada como un arreglo `[{ codigo, cantidad }, ...]`. **Ojo**: el
carrito solo guarda el código y la cantidad, nunca el nombre/precio/imagen del producto —
esos datos se buscan en `PRODUCTOS` cada vez que hace falta mostrarlos (con
`obtenerProductoPorCodigo`). Esto evita que el carrito quede "desactualizado" si el precio
de un producto cambiara.

Funciones clave:

- `agregarAlCarrito(codigo, cantidad)`: si el producto ya estaba, suma la cantidad; si no,
  lo agrega.
- `actualizarCantidadCarrito(codigo, cantidad)`: cambia la cantidad; si llega a 0 o menos,
  elimina el ítem.
- `vaciarCarrito()`: deja el carrito en `[]` (se usa al simular el pago).
- `totalUnidadesCarrito()` / `totalPrecioCarrito()`: recorren el carrito y suman unidades o
  `precio × cantidad` de cada línea.
- `actualizarContadorCarrito()`: actualiza el número que aparece en el ícono 🛒 del header,
  en **todas** las páginas (por eso está enganchado a `DOMContentLoaded` dentro del mismo
  `carrito.js`, y no solo dentro de `renderizarCarrito()`).

### 3.5 `js/sesion.js`

Guarda quién inició sesión (también en `localStorage`, con el usuario completo) y expone
funciones como `guardarSesion()`, `obtenerSesion()`, `cerrarSesion()`, y `protegerAdmin()` —
esta última se llama al principio de cada página del panel `/admin/` y redirige a
`login.html` si no hay una sesión activa con rol Administrador o Vendedor, simulando control
de acceso por rol sin un backend real.

### 3.6 `js/main.js`

Es el archivo "puente" entre los datos y el HTML. No tiene datos propios ni lógica de
validación: solo arma HTML. Funciones principales:

- `renderizarGrillaProductos(idContenedor, listaProductos)`: dibuja tarjetas de producto
  (imagen vía `imagenProducto()`, categoría, nombre, precio, aviso de stock crítico si
  corresponde, botón "Añadir al carrito"). La usan `index.html` (destacados),
  `productos.html` (catálogo completo) y `producto-detalle.html` (productos relacionados).
- `inicializarFiltroCategorias(...)`: llena el `<select>` de categorías y, al cambiar,
  vuelve a llamar `renderizarGrillaProductos()` con el subconjunto filtrado.
- `renderizarDetalleProducto()`: lee `?codigo=` de la URL con `URLSearchParams`, busca el
  producto y llena cada elemento del detalle (nombre, precio, descripción, imagen, aviso de
  stock). También arma la sección de "productos relacionados" (misma categoría).
- `renderizarCarrito(sufijo)`: dibuja cada línea del carrito con imagen, controles de
  cantidad (+/−) y total; si el carrito está vacío, muestra el mensaje "Tu carrito está
  vacío" en vez de la tabla. El parámetro `sufijo` es lo que permite reutilizar esta misma
  función en dos lugares con ids distintos, en vez de duplicar el código:
    - `renderizarCarrito()` (sin argumento) pinta `carrito.html`, la página completa.
    - `renderizarCarrito("-panel")` pinta el **panel lateral** de acceso rápido que se abre
      desde el ícono 🛒 del header en cualquier otra página (`carrito-items-panel`,
      `carrito-total-panel`, etc.) — así no hace falta salir de donde estás para revisar el
      carrito. Lo arma e inyecta `montarPanelCarrito()` la primera vez que carga la página
      (mira el HTML que genera si quieres ver la estructura del panel).
- `procesarPago()`: la regla de negocio del pago, sin nada de HTML de por medio — revisa que
  el carrito no esté vacío y que **haya una sesión iniciada** (igual que en una tienda real,
  no se puede pagar sin cuenta), y si todo está bien vacía el carrito y devuelve el total.
- `finalizarCompra(sufijo)`: usa `procesarPago()` y muestra el resultado en la interfaz
  correspondiente (mensaje de éxito con el total pagado, o aviso de "inicia sesión" con un
  enlace a `login.html`). No hay pasarela de pago real (no correspondía en esta entrega),
  pero el flujo se puede probar completo de punta a punta, tanto desde `carrito.html` como
  desde el panel lateral.
- `inicializarRegionComuna(...)`: encadena los `<select>` de Región y Comuna del formulario
  de registro.

---

## 4. Cómo probar todo rápido

> **Antes de empezar:** abre el proyecto con `iniciar-servidor.bat` / `iniciar-servidor.sh`
> (o "Live Server" de VS Code) y entra por `http://localhost:8000`, **no** con doble clic
> directo a los `.html`. El carrito y la sesión usan `localStorage`, y varios navegadores lo
> bloquean bajo el protocolo `file://` (doble clic) — el sitio te avisa con un banner rojo si
> detecta esto. Más detalle en el README.

1. Abre `index.html` desde `http://localhost:8000` (ver aviso arriba).
2. Ve a **Productos** → filtra por "Juegos de Mesa" para ver los 5 juegos (Catan,
   Carcassonne, Dixit, Ticket to Ride, Bang! El Duelo).
3. Aprieta "Añadir al carrito" en un par de productos de distintas categorías.
4. Entra a un producto (clic en su nombre o imagen) para ver la ficha de detalle y los
   productos relacionados.
5. Haz clic en el ícono 🛒 **Carrito** del header: se abre el panel lateral con lo que
   agregaste — revisa que las imágenes, cantidades y el total se vean bien, y prueba los
   botones `+`/`−`. También puedes entrar directo a `carrito.html` para ver la misma
   información en una página completa.
6. Aprieta **Pagar** sin haber iniciado sesión: debería aparecer un aviso pidiendo iniciar
   sesión, sin vaciar el carrito.
7. Inicia sesión (por ejemplo `admin@duoc.cl` / `admin123` — ver más credenciales de prueba
   en `login.html`) y vuelve a abrir el carrito: ahora **Pagar** sí debería vaciarlo y
   mostrar el mensaje de compra simulada con el total pagado.
8. Prueba **Registrarse** con un RUN inválido (por ejemplo, `111111111`) para ver el mensaje
   de error, y luego con uno válido para completar el registro.
9. Para el panel admin, inicia sesión con un usuario Administrador y entra a `/admin/` para
   agregar o editar un producto.

---

## 5. Relación con la rúbrica de la EP1

La situación evaluativa 2 (presentación) es **individual** y vale 60% de la nota de EP1, así
que vale la pena que sepas exactamente qué te van a pedir explicar en cada indicador y dónde
mirar en este proyecto para responder con seguridad.

**IE1.1.1 — Crea contenido web con estructura y etiquetado HTML actual (navegación,
imágenes, botones, videos, formularios, footer) — 8%.**
Mira cualquier página (por ejemplo `index.html`): usa `<header>`, `<nav>`, `<main>`,
`<section>`, `<article>` (en las tarjetas de producto) y `<footer>`. Hay hipervínculos entre
todas las páginas (menú superior + footer), imágenes (las ilustraciones SVG de productos),
botones funcionales (añadir al carrito, pagar, filtros), y formularios (registro, login,
contacto, producto/usuario en el admin). Puedes explicar cómo `producto-detalle.html` recibe
el código del producto por parámetro de URL (`?codigo=JM001`) y arma la página dinámicamente
en vez de tener una página HTML distinta por cada producto.

**IE1.1.2 — Implementa hojas de estilo CSS externas y personalizadas — 10%.**
Todo el diseño vive en un solo archivo, `css/style.css`, enlazado con
`<link rel="stylesheet" href="css/style.css">` en cada página — nunca hay estilos en línea
mezclados con el contenido (salvo casos puntuales de layout rápido). Usa variables CSS
(`:root { --azul: #1e90ff; ... }`) para mantener consistencia de colores en todo el sitio,
lo que puedes mencionar como una decisión de mantenibilidad.

**IE1.2.1 / IE1.2.2 — Desarrolla y demuestra validaciones controladas por JavaScript, con
sugerencias y mensajes de error personalizados — 10% y 15%.**
Este es probablemente el punto donde más te van a exigir profundidad. Repasa
`validaciones.js` (sección 3.3 de este documento) y practica explicar el algoritmo del RUN
chileno paso a paso, no solo "hay una función que lo valida". Muestra en vivo qué pasa si
envías el formulario de registro vacío, o con un correo que no sea `@duoc.cl` /
`@gmail.com`, o con contraseñas que no coinciden — y explica cómo el mensaje de error
aparece junto al campo específico (`mostrarError("reg-run", "...")`) y no como una alerta
genérica.

**IE1.3.1 / IE1.3.2 — Cambios al repositorio remoto, comentados y coherentes, distribuidos
entre el equipo — 12% y 20% (el indicador de mayor ponderación de toda la EP1).**
Esto es trabajo de Git/GitHub, no de este código: asegúrate de que tu equipo esté haciendo
commits frecuentes con mensajes descriptivos (no "cambios", "fix", "asdf") y que el trabajo
esté repartido entre los integrantes (que se note en el historial de commits quién hizo
qué). En la presentación te van a pedir justificar *por qué* es importante hacer commits
coherentes y distribuidos, no solo mostrarlos — piensa en trazabilidad, poder revertir
cambios puntuales, y que cada integrante pueda dar cuenta de su propio aporte.

**IE1.1.3 / IE1.1.4 (situación 2) — Explicar cómo se creó el contenido HTML y describir el
uso de CSS personalizado.**
Son la versión "hablada" de IE1.1.1 e IE1.1.2: aquí es donde realmente te piden pararte y
explicar, con tus palabras, las decisiones de estructura semántica y de estilos que tomaste
(o que identificaste al estudiar este ejemplo).

---

## 6. Lo que NO cubre este proyecto (para que no te tome desprevenido)

- **No hay backend ni base de datos real.** Todo lo relacionado con "persistencia" está
  simulado con `localStorage`, y eso es válido para esta entrega, pero es bueno que puedas
  explicarlo si te preguntan por qué el catálogo "se resetea" al recargar.
- **No hay pasarela de pago real.** El botón "Pagar" simula la compra (vacía el carrito y
  confirma el total) para que el flujo se pueda probar de principio a fin, pero no procesa
  ningún pago real — no correspondía en el alcance de esta entrega.
- **El repositorio Git/GitHub y el documento ERS son responsabilidad del equipo**, no algo
  que este código resuelva por sí solo — son los indicadores de mayor peso de la evaluación
  grupal (IE1.3.1) y de la presentación (IE1.3.2), así que no los dejes para el final.
