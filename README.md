```bash
generala-multiplayer/
├── public/
│   └── (vacío o favicon)
├── src/
│   ├── components/
│   │   ├── Board.jsx          ← tablero general (celdas, filas, columnas)
│   │   ├── CanvasPad.jsx      ← pizarra compartida
│   │   ├── Chat.jsx           ← chat básico en tiempo real
│   │   └── PlayerSelector.jsx ← seleccionar jugador / nombre
│   ├── socket.js              ← conexión a socket.io-client
│   ├── App.jsx
│   └── main.jsx
├── server.js                  ← backend Express + Socket.IO
├── package.json
└── vite.config.js
```
