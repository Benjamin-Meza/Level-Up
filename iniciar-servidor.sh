#!/bin/bash
# Levanta un servidor local en esta misma carpeta y lo deja disponible en
# http://localhost:8000 -- así el carrito y la sesión (que usan localStorage)
# funcionan bien. Abrir los .html con doble clic (protocolo file://) hace que
# varios navegadores bloqueen el almacenamiento local: por eso este script.
cd "$(dirname "$0")"
echo "Abriendo http://localhost:8000 ..."
echo "(deja esta ventana abierta mientras uses el sitio; ctrl+C para cerrar el servidor)"
python3 -m http.server 8000
