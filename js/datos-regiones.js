/**
 * datos-regiones.js
 * Arreglo complementario de regiones y comunas usado por los selects
 * encadenados de los formularios de Usuario (registro / admin).
 * Al cambiar la región, se debe recalcular el select de comunas.
 */

const REGIONES = [
  {
    region: "Región Metropolitana de Santiago",
    comunas: ["Maipú", "Santiago", "Providencia", "Puente Alto", "La Florida"]
  },
  {
    region: "Región de Ñuble",
    comunas: ["Chillán", "Chillán Viejo", "San Carlos", "Bulnes"]
  },
  {
    region: "Región de la Araucanía",
    comunas: ["Temuco", "Villarrica", "Pucón", "Angol"]
  },
  {
    region: "Región de Valparaíso",
    comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "San Antonio"]
  }
];

function obtenerComunas(nombreRegion){
  const region = REGIONES.find(function(r){ return r.region === nombreRegion; });
  return region ? region.comunas : [];
}
