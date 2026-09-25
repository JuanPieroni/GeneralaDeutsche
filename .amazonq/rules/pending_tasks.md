# Pending Tasks
## 1. Autoplay de música al entrar
- **Problema**: F5 no reproduce la música porque el browser bloquea autoplay hasta interacción del usuario.
- **Solución propuesta**: Iniciar `audioRef.current.play()` dentro del `handleSubmit` (onClick del botón "Entrar al juego"), que ya es una interacción del usuario.
- **Archivo**: `src/components/Welcome.jsx`

## 3. Aleatoriedad de los dados
- **Problema**: El jugador siente que el número 1 sale poco frecuentemente.
- **Solución propuesta**: Revisar la función de generación aleatoria de dados en el servidor/cliente y verificar distribución uniforme. Considerar loggear resultados para confirmar sesgo.
- **Archivos**: `src/components/DiceRoller.jsx`, `server/server.js`

## 4. Panel de música y sonidos
- **Problema**: No hay control de música ni sonidos del juego más allá del botón mute básico.
- **Solución propuesta**:
  - Panel de configuración de audio con: selector de temas musicales, barra de volumen de música, botón mute de música, botón mute de sonidos del juego (dados, etc.)
  - Mejorar el sonido de los dados (reemplazar o agregar un sonido más satisfactorio al tirar)
- **Archivos**: `src/components/Welcome.jsx`, `src/components/DiceRoller.jsx`, nuevo componente `src/components/AudioPanel.jsx`

## 2. Chat no se limpia entre partidas
- **Problema**: Al entrar con un nombre diferente para una nueva partida, el historial del chat de la partida anterior sigue visible.
- **Solución propuesta**: Limpiar el estado del chat en el servidor al iniciar nueva partida, o en el cliente al hacer `set-player`.
- **Archivos**: `src/App.jsx`, `server/server.js`

## 5. Footer con datos del autor
- **Problema**: No hay footer con información del autor ni copyright.
- **Solución propuesta**: Crear componente `Footer.jsx` con: nombre Juan Pieroni, copyright © 2025, versión del juego, y link al repositorio.
- **Datos a mostrar**:
  - Autor: Juan Pieroni
  - Copyright © 2025
  - GitHub / Repo: `[COMPLETAR LINK]`
  - Versión: (ej: v1.0.0)
- **Archivos**: nuevo `src/components/Footer.jsx`, importar en `src/App.jsx`

## 6. Fake Loading al ingresar al juego
- **Problema**: Al enviar el nombre en Welcome, el board aparece instantáneamente sin ninguna transición, lo que se siente abrupto.
- **Solución propuesta**: Agregar estado `isLoading` que se activa al hacer submit, muestra una pantalla/spinner por ~1000-1500ms con `setTimeout`, y luego muestra el board.
- **Archivos**: `src/App.jsx`, `src/components/Welcome.jsx`

## 8. Migración de Render a Railway
- **Problema**: Render.com en plan gratuito tiene cold starts agresivos y latencia en disconnects de WebSocket que causa bugs de roles (spectator al refrescar).
- **Solución propuesta**: Migrar el backend a Railway.app — sin cold starts, plan gratuito con $5/mes de crédito, sin cambios en el código.
- **Pasos**:
  - Crear cuenta en railway.app
  - Nuevo proyecto → Deploy from GitHub repo
  - Configurar variable `PORT` si es necesario
  - Actualizar `allowedOrigins` en `server/server.js` con la nueva URL de Railway
  - Actualizar `VITE_SOCKET_URL` en el cliente si aplica
- **Archivos**: `server/server.js`

## 7. Pérdida de estado al recargar la página
- **Problema**: Al hacer F5 o recargar, el jugador vuelve a la pantalla de nombre. Al reingresar, el tablero puede aparecer borrado o en estado inconsistente. Si un jugador sale o recarga accidentalmente, se pierde el progreso.
- **Notas**: Requiere testeo para confirmar si el tablero se borra realmente o solo se desincroniza visualmente.
- **Solución propuesta a evaluar**: Persistir `playerName` y `hasEntered` en `localStorage` para reentrar automáticamente sin pasar por Welcome. El estado del tablero ya vive en el servidor, por lo que reconectarse debería restaurarlo.
- **Archivos**: `src/App.jsx`

## 11. necesito reducir el javascript y el css que no se usa

**Notas**:Show agent walkthrough
Para reducir el JavaScript y CSS que no se utiliza en tu sitio, enfócate en los siguientes puntos clave detectados en el informe:

Limpieza de Extensiones
El reporte indica que la mayor parte del JavaScript sin minificar y pesado proviene de extensiones del navegador (como AdBlock o similares con prefijos chrome-extension://).

Acción: Realiza tus pruebas de Lighthouse en una ventana de incógnito. Esto desactivará las extensiones y te dará una visión real de lo que tus usuarios descargan.
Optimización de CSS
Tienes un archivo principal (index-BGOAhQH1.css) y varias fuentes de Google Fonts que bloquean el renderizado inicial.

Critical CSS: Extrae el CSS necesario para mostrar la parte superior de la página (above the fold) e inclúyelo directamente en el <head>.
Carga diferida: Aplica el atributo rel="preload" o carga el resto del CSS de forma asíncrona para que no detenga la visualización del contenido.
Reducción de JavaScript del lado del Servidor/App
Aunque el reporte está "contaminado" por extensiones, el tiempo de ejecución del hilo principal es elevado (7 segundos).

Code Splitting: Si usas un framework como React o Vue (común en despliegues en Render), utiliza carga dinámica (import()) para dividir tu código en paquetes más pequeños.
Tree Shaking: Asegúrate de que tu herramienta de construcción (Vite, Webpack) esté eliminando funciones de librerías de terceros que no estás llamando.
Servidor y Entrega
El tiempo de respuesta inicial del servidor es de 700ms, lo cual es lento.

Compresión: Verifica que el servidor (Render) esté entregando los archivos con Gzip o Brotli activado.
Minificación: Asegúrate de que el comando de construcción en Render sea npm run build para que los archivos de producción se generen minificados automáticamente.
 **Solución propuesta a evaluar**: eliminar codigo superfluo de JS y de css 



**HASTA AHORA LA VERSION 1.0.4 Funciona Bien.. solo falta corregir el delay al seleccionar dado y mejroar el rendimiento "**