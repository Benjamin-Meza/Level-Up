document.addEventListener("DOMContentLoaded", function() {
    const formLogin = document.getElementById("formLogin");
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
                errorCorreo.textContent = "Debe usar un correo @duoc.cl, @profesor.duoc.cl o @gmail.com";
                esValido = false;
            }
            
            if (password === "") {
                errorPassword.textContent = "La contraseña es obligatoria.";
                esValido = false;
            } else if (password.length < 4 || password.length > 10) {
                errorPassword.textContent = "La contraseña debe tener entre 4 y 10 caracteres.";
                esValido = false;
            }
            
            if (esValido) {
                mensajeGeneral.textContent = "¡Ingreso exitoso! Redirigiendo...";
                mensajeGeneral.className = "text-center fw-bold mt-3 text-success";
            }
        });
    }
});