@echo off
REM Levanta un servidor local en esta misma carpeta y lo deja disponible en
REM http://localhost:8000 -- asi el carrito y la sesion (que usan localStorage)
REM funcionan bien. Abrir los .html con doble clic (protocolo file://) hace que
REM varios navegadores bloqueen el almacenamiento local: por eso este script.
cd /d "%~dp0"
echo Abriendo http://localhost:8000 ...
echo (deja esta ventana abierta mientras uses el sitio; Ctrl+C para cerrar el servidor)
python -m http.server 8000
pause
