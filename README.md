# Level-Up Gamer — Frontend EP1 (DSY1104)

Proyecto base en **HTML + CSS + JavaScript puro** (sin frameworks ni backend todavía) para la Evaluación Parcial 1, caso Level-Up Gamer.

> Este código es un punto de partida para que tu equipo lo estudie, lo discuta y lo haga propio antes de entregarlo. La presentación es individual y te van a preguntar por tus propias decisiones y tus propios commits — asegúrate de entender cada parte antes de subirla al repositorio del equipo.

## Cómo verlo

**Importante:** el carrito y la sesión de usuario usan `localStorage`, y varios navegadores
bloquean o restringen ese almacenamiento cuando abres un `.html` con doble clic
(protocolo `file://`). Si haces eso, el sitio se ve bien pero el carrito nunca suma nada y
el login nunca "recuerda" la sesión — el propio sitio te avisa con un banner rojo si detecta
este problema.

La forma segura de verlo es con un servidor local (no necesitas instalar nada, ya viene con
Python):

1. Haz doble clic en **`iniciar-servidor.bat`** (Windows) o **`iniciar-servidor.sh`**
   (Mac/Linux) — si tu sistema no te deja ejecutar el `.sh` con doble clic, ábrelo desde una
   terminal con `./iniciar-servidor.sh` (o `bash iniciar-servidor.sh`).
2. Abre `http://localhost:8000` en el navegador.
3. Deja esa ventana/terminal abierta mientras usas el sitio.

(Alternativa equivalente: la extensión "Live Server" de VS Code, o correr
`python3 -m http.server 8000` tú mismo desde esta carpeta.)

## Estructura

```
levelup-gamer/
├── index.html              Home tienda
├── productos.html          Listado de productos + filtro por categoría
├── producto-detalle.html   Detalle de producto + añadir al carrito
├── registro.html           Registro de usuario (rol Cliente)
├── login.html               Inicio de sesión
├── nosotros.html
├── blogs.html
├── blog-detalle-1.html / blog-detalle-2.html
├── contacto.html
├── carrito.html             Carrito (localStorage)
├── admin/
│   ├── index.html            Home admin (mini dashboard)
│   ├── productos.html        Listado de productos (admin/vendedor)
│   ├── producto-form.html    Nuevo/editar producto
│   ├── ordenes.html          Listado de órdenes (demo estático, admin/vendedor)
│   ├── usuarios.html         Listado de usuarios (solo admin)
│   └── usuario-form.html     Nuevo/editar usuario (solo admin)
├── css/style.css             Única hoja de estilos externa del sitio
└── js/
    ├── datos-productos.js    "Base de datos" de productos (arreglo JS)
    ├── datos-regiones.js     Regiones y comunas (para los selects encadenados)
    ├── datos-usuarios.js     Usuarios de ejemplo + registro en localStorage
    ├── validaciones.js       Funciones de validación reutilizables (incluye RUN)
    ├── carrito.js            Lógica del carrito (localStorage)
    ├── sesion.js             Sesión simulada + protección de roles
    └── main.js               Funciones que arman el DOM (render de listas, detalle, carrito)
```

## Cuentas de prueba

| Correo | Contraseña | Rol |
|---|---|---|
| admin@duoc.cl | admin123 | Administrador (acceso total) |
| vendedor@gmail.com | vend123 | Vendedor (solo productos y órdenes) |
| cualquier otro correo válido | lo que ingreses | Se crea como Cliente |

## Qué es real y qué es un "placeholder" a propósito

- **No hay backend ni base de datos.** Los productos y usuarios viven en arreglos de JavaScript (`datos-productos.js`, `datos-usuarios.js`). Lo que agregues o edites en el panel admin se ve en la sesión del navegador pero se pierde al recargar — eso es normal en esta entrega (el enunciado pide solo el proyecto **frontend**).
- El carrito sí persiste de verdad, porque usa `localStorage` tal como pide el Anexo 1.
- Las imágenes de producto son ilustraciones SVG propias (carpeta `img/`, una por categoría), no fotos reales — así el catálogo se ve completo sin depender de internet ni de bancos de imágenes con derechos. Reemplázalas por fotos si quieres subir el nivel de detalle visual (basta con cambiar `IMAGEN_POR_CATEGORIA` en `datos-productos.js`, o poner un campo `imagen` en el producto puntual).
- `admin/ordenes.html` es una tabla estática de ejemplo: el caso menciona que el rol Vendedor puede ver "lista de órdenes y el detalle", pero el Anexo 1 no pide construir ese módulo completo en esta entrega, así que se dejó como demo mínima para que el rol tenga sentido.
- La validación de RUN implementa el algoritmo real de dígito verificador chileno (módulo 11) — puedes probarla con RUNs inválidos para ver el mensaje de error.
- El botón **Pagar** simula el checkout (no hay pasarela de pago real): calcula el total, vacía el carrito y muestra un mensaje de confirmación. Como en una tienda real, **exige sesión iniciada** — si no hay sesión, muestra un aviso con enlace a `login.html` en vez de dejar pagar.
- Además de `carrito.html` (la página completa), el ícono 🛒 del header abre un **panel lateral** con el mismo carrito, para revisar o pagar sin salir de la página en la que estás. Ambas vistas comparten la misma lógica (`renderizarCarrito()` / `finalizarCompra()` en `main.js`, ver `EXPLICACION-PROYECTO.md`).

**Para entender a fondo cada archivo y cómo se conecta con la rúbrica de la EP1**, revisa `EXPLICACION-PROYECTO.md` en esta misma carpeta — está pensado especialmente para preparar tu presentación individual.

## Sobre el diseño visual

Se usó la paleta y tipografías que propone el propio caso (fondo negro, azul eléctrico `#1E90FF`, verde neón `#39FF14`, Roboto + Orbitron desde Google Fonts) porque el Anexo 1 lo entrega como propuesta de diseño. Es una sugerencia, no una obligación de la rúbrica — si tu equipo prefiere otra línea visual, se puede cambiar todo desde `css/style.css` sin tocar el HTML.

Esta versión suma, sobre la misma base (HTML/CSS/JS propio, sin Bootstrap), algunas ideas tomadas de una versión de un compañero de curso: los efectos de resplandor/neón en botones y tarjetas, el panel de carrito lateral de acceso rápido, y la regla de exigir sesión iniciada para poder pagar. Vale la pena que sepas identificar cuáles son esas partes si te preguntan en la presentación.

## Antes de entregar

- [ ] Revisa cada archivo y asegúrate de poder explicar, en tus palabras, qué hace.
- [ ] Reparte los archivos/páginas entre el equipo y sube los cambios con **tus propios commits**, con mensajes descriptivos.
- [ ] Ajusta o recorta el alcance según lo que el docente valide (el caso dice explícitamente que no todos los requerimientos son obligatorios).
- [ ] Completa la Planilla de requerimientos y la versión 1 del ERS en paralelo (no están incluidas en esta carpeta).
