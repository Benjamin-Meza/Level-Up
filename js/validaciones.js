/**
 * validaciones.js
 * Funciones reutilizables de validación en tiempo real (sin librerías externas).
 * Cada formulario del sitio (login, contacto, producto, usuario) llama a estas
 * funciones y usa mostrarError()/ocultarError() para dar retroalimentación
 * clara y en el contexto del campo, tal como pide el encargo.
 */

const DOMINIOS_CORREO_PERMITIDOS = ["duoc.cl", "profesor.duoc.cl", "gmail.com"];

/** Muestra un mensaje de error bajo el campo indicado. */
function mostrarError(idCampo, mensaje){
  const input = document.getElementById(idCampo);
  const error = document.getElementById("error-" + idCampo);
  if (input) input.classList.add("campo-invalido");
  if (error){
    error.textContent = mensaje;
    error.classList.add("visible");
  }
}

/** Limpia el mensaje de error de un campo (cuando vuelve a ser válido). */
function ocultarError(idCampo){
  const input = document.getElementById(idCampo);
  const error = document.getElementById("error-" + idCampo);
  if (input) input.classList.remove("campo-invalido");
  if (error) error.classList.remove("visible");
}

/** Requerido: no puede estar vacío. */
function validarRequerido(valor){
  return valor !== null && valor !== undefined && valor.toString().trim().length > 0;
}

/** Largo máximo/mínimo de un texto. */
function validarLargo(valor, min, max){
  const largo = (valor || "").toString().trim().length;
  if (min !== undefined && largo < min) return false;
  if (max !== undefined && largo > max) return false;
  return true;
}

/**
 * Correo institucional/permitido: formato válido + dominio dentro de la lista
 * @duoc.cl, @profesor.duoc.cl o @gmail.com (regla del Anexo 1).
 */
function validarCorreoPermitido(correo){
  const formatoOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo || "");
  if (!formatoOk) return false;
  const dominio = correo.split("@")[1].toLowerCase();
  return DOMINIOS_CORREO_PERMITIDOS.includes(dominio);
}

/** Contraseña entre 4 y 10 caracteres (regla de inicio de sesión). */
function validarContrasena(valor){
  return validarLargo(valor, 4, 10);
}

/**
 * Valida un RUN chileno sin puntos ni guion (ej: 19011022K).
 * Usa el algoritmo estándar de dígito verificador (módulo 11).
 */
function validarRun(run){
  if (!run) return false;
  const limpio = run.toString().replace(/[^0-9kK]/g, "").toUpperCase();
  if (limpio.length < 7 || limpio.length > 9) return false;

  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);
  if (!/^\d+$/.test(cuerpo)) return false;

  let suma = 0;
  let multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--){
    suma += multiplo * parseInt(cuerpo[i], 10);
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }
  const resto = 11 - (suma % 11);
  const dvEsperado = resto === 11 ? "0" : resto === 10 ? "K" : String(resto);
  return dv === dvEsperado;
}

/** Número entero dentro de un rango [min, max] (max opcional = sin límite). */
function validarEntero(valor, min, max){
  if (valor === "" || valor === null || valor === undefined) return false;
  const n = Number(valor);
  if (!Number.isInteger(n)) return false;
  if (min !== undefined && n < min) return false;
  if (max !== undefined && n > max) return false;
  return true;
}

/** Número (permite decimales) dentro de un rango [min, max]. */
function validarNumero(valor, min, max){
  if (valor === "" || valor === null || valor === undefined) return false;
  const n = Number(valor);
  if (Number.isNaN(n)) return false;
  if (min !== undefined && n < min) return false;
  if (max !== undefined && n > max) return false;
  return true;
}

/** Muestra una alerta general de éxito/error sobre un formulario completo. */
function mostrarAlertaFormulario(idAlerta, mensaje, tipo){
  const alerta = document.getElementById(idAlerta);
  if (!alerta) return;
  alerta.textContent = mensaje;
  alerta.classList.remove("exito", "error");
  alerta.classList.add("visible", tipo);
}
