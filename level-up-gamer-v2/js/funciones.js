document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. LÓGICA DE SESIÓN (LOGIN) ---
    const formLogin = document.getElementById("formLogin");
    const navMenu = document.getElementById("navMenu");
    const usuarioLogueado = localStorage.getItem("levelup_user");

    // Construir Navbar dinámico
    if (navMenu) {
        let currentPath = window.location.pathname;
        let isInicioActive = currentPath.includes("index.html") || currentPath.endsWith("/") ? "active text-success glow-text" : "";
        let isProdActive = currentPath.includes("productos.html") ? "active text-success glow-text" : "";

        if (usuarioLogueado) {
            navMenu.innerHTML = `
                <li class="nav-item"><a class="nav-link fw-bold ${isInicioActive}" href="index.html">Inicio</a></li>
                <li class="nav-item"><a class="nav-link fw-bold ${isProdActive}" href="productos.html">Catálogo</a></li>
                <li class="nav-item ms-3">
                    <span class="nav-link text-white border border-secondary rounded px-3 bg-dark">
                        👤 Hola, <span class="text-primary fw-bold">${usuarioLogueado.split('@')[0]}</span>
                    </span>
                </li>
                <li class="nav-item ms-2">
                    <button class="btn btn-outline-danger btn-sm mt-1" id="btnLogout">Cerrar Sesión</button>
                </li>
            `;
            
            document.getElementById("btnLogout").addEventListener("click", () => {
                localStorage.removeItem("levelup_user");
                window.location.href = "index.html";
            });
        } else {
            navMenu.innerHTML = `
                <li class="nav-item"><a class="nav-link fw-bold ${isInicioActive}" href="index.html">Inicio</a></li>
                <li class="nav-item"><a class="nav-link fw-bold ${isProdActive}" href="productos.html">Catálogo</a></li>
                <li class="nav-item ms-3"><a class="btn btn-primary btn-sm mt-1 glow-btn" href="login.html">Iniciar Sesión</a></li>
            `;
        }
    }

    // Validar Login
    if (formLogin) {
        formLogin.addEventListener("submit", function(event) {
            event.preventDefault();
            
            const correo = document.getElementById("correo").value.trim();
            const password = document.getElementById("password").value.trim();
            
            const errorCorreo = document.getElementById("errorCorreo");
            const errorPassword = document.getElementById("errorPassword");
            const mensajeGeneral = document.getElementById("mensajeGeneral");
            
            errorCorreo.textContent = "";
            errorPassword.textContent = "";
            mensajeGeneral.textContent = "";
            
            let esValido = true;
            
            if (correo === "") {
                errorCorreo.textContent = "El correo es obligatorio.";
                esValido = false;
            } else if (!correo.endsWith("@duoc.cl") && !correo.endsWith("@profesor.duoc.cl") && !correo.endsWith("@gmail.com")) {
                errorCorreo.textContent = "Dominio no válido. Use @duoc.cl o @gmail.com";
                esValido = false;
            }
            
            if (password === "") {
                errorPassword.textContent = "La contraseña es obligatoria.";
                esValido = false;
            } else if (password.length < 4 || password.length > 10) {
                errorPassword.textContent = "Debe tener entre 4 y 10 caracteres.";
                esValido = false;
            }
            
            if (esValido) {
                mensajeGeneral.textContent = "¡Acceso Autorizado! Cargando...";
                mensajeGeneral.className = "text-center fw-bold mt-3 text-success glow-text";
                
                // Guardar en LocalStorage y redirigir
                localStorage.setItem("levelup_user", correo);
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1500);
            }
        });
    }

    // --- 2. LÓGICA DEL CARRITO DE COMPRAS ---
    let carrito = JSON.parse(localStorage.getItem("levelup_cart")) || [];
    
    function guardarCarrito() {
        localStorage.setItem("levelup_cart", JSON.stringify(carrito));
        actualizarUI();
    }

    function actualizarUI() {
        // Actualizar contador
        const countBridges = document.querySelectorAll("#cart-count");
        const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        countBridges.forEach(badge => badge.textContent = totalItems);

        // Renderizar items en el offcanvas
        const carritoBody = document.getElementById("carrito-body");
        const carritoTotal = document.getElementById("carrito-total");
        
        if (!carritoBody) return; // Si no hay offcanvas en esta pagina, ignorar
        
        carritoBody.innerHTML = "";
        let totalPesos = 0;

        if (carrito.length === 0) {
            carritoBody.innerHTML = '<p class="text-center text-light-gray mt-5">Tu carrito está vacío 🎮</p>';
        } else {
            carrito.forEach(item => {
                totalPesos += (item.precio * item.cantidad);
                carritoBody.innerHTML += `
                    <div class="cart-item d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="mb-0 text-white">${item.nombre}</h6>
                            <small class="text-primary">$${item.precio.toLocaleString('es-CL')}</small>
                        </div>
                        <div class="d-flex align-items-center">
                            <button class="btn btn-sm btn-dark border-secondary btn-restar" data-id="${item.id}">-</button>
                            <span class="mx-2 fw-bold">${item.cantidad}</span>
                            <button class="btn btn-sm btn-dark border-secondary btn-sumar" data-id="${item.id}">+</button>
                        </div>
                    </div>
                `;
            });
        }
        carritoTotal.textContent = `$${totalPesos.toLocaleString('es-CL')}`;
        asignarEventosCarrito();
    }

    // Asignar eventos a los botones de + y - dentro del carrito
    function asignarEventosCarrito() {
        document.querySelectorAll(".btn-sumar").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = e.target.getAttribute("data-id");
                const producto = carrito.find(p => p.id === id);
                if (producto) producto.cantidad++;
                guardarCarrito();
            });
        });

        document.querySelectorAll(".btn-restar").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = e.target.getAttribute("data-id");
                const index = carrito.findIndex(p => p.id === id);
                if (index !== -1) {
                    carrito[index].cantidad--;
                    if (carrito[index].cantidad === 0) {
                        carrito.splice(index, 1);
                    }
                    guardarCarrito();
                }
            });
        });
    }

    // Asignar evento a los botones "Añadir al carrito" de los productos
    document.querySelectorAll(".btn-add-cart").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.target.getAttribute("data-id");
            const nombre = e.target.getAttribute("data-name");
            const precio = parseInt(e.target.getAttribute("data-price"));

            const productoExistente = carrito.find(item => item.id === id);
            
            if (productoExistente) {
                productoExistente.cantidad++;
            } else {
                carrito.push({ id, nombre, precio, cantidad: 1 });
            }
            
            // Efecto visual en el boton
            const originalText = btn.innerHTML;
            btn.innerHTML = "¡Añadido! ✔️";
            btn.classList.replace("btn-outline-primary", "btn-success");
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.replace("btn-success", "btn-outline-primary");
            }, 1000);

            guardarCarrito();
        });
    });

    // Pagar
    const btnPagar = document.getElementById("btn-pagar");
    if (btnPagar) {
        btnPagar.addEventListener("click", () => {
            if (carrito.length === 0) return alert("Agrega productos antes de pagar.");
            if (!usuarioLogueado) return window.location.href = "login.html"; // Obliga a loguear para pagar
            
            alert(`¡Gracias por tu compra, ${usuarioLogueado.split('@')[0]}! Procesando pago...`);
            carrito = [];
            guardarCarrito();
        });
    }

    // Inicializar UI al cargar la página
    actualizarUI();
});