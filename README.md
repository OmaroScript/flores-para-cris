# Un jardín para Cris

Abre `index.html` en un navegador. No necesita instalación ni conexión a internet.

Para probar desde la red local, ejecuta en esta carpeta:

```sh
python3 -m http.server 4173 --bind 0.0.0.0
```

Abre `http://localhost:4173` en la computadora o la dirección IP local de esa computadora con el puerto `4173` desde un celular en la misma red.

Para compartir un enlace por internet, publica el contenido de esta carpeta en un alojamiento estático. La foto será accesible para quienes tengan acceso al sitio.

Los seis mensajes están en `app.js`; la carta final está en `index.html`. La foto es `cris.jpeg`. El sonido se sintetiza en el navegador y se activa al comenzar el juego, sin botón para silenciarlo. Se respeta la preferencia del dispositivo de reducir movimiento.
