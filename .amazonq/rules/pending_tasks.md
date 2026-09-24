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

