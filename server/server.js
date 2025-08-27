import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"

const app = express()
const httpServer = createServer(app)


// 🟡 Resolver __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// 🟢 Middleware para servir el build de React
app.use(express.static(path.join(__dirname, "dist")));

// 🟣 Allowed origins (dev + futuro deploy)
const allowedOrigins = [
  "http://localhost:5173",              // desarrollo local
  "https://generaladeutsche.netlify.app"           // poner la URL real
]
// ⚠️ CORS para permitir desde el frontend
app.use(
    cors({
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true,
    })
)

// inicializamos socket.io
const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true,
    },
})

// Estado global del juego
let gameState = {
    board: {},
    blackout: {},
    dice: {
        dice: [0, 0, 0, 0, 0],
        heldDice: [false, false, false, false, false],
        throwsLeft: 3,
        rollCount: 0,
        turnoActual: "jugador1"
    },
    chat: [],
    players: {}
}


// 🟣 Rutas API
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hola desde el backend 🚀" });
});

// 🟡 Cualquier otra ruta → React
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// escucha de sockets
io.on("connection", (socket) => {
    console.log("✅ Usuario conectado:", socket.id)
    
    // Enviar estado actual al nuevo cliente
    socket.emit("game-state", gameState)
    
    socket.on("set-player", (playerName) => {
        const playerCount = Object.keys(gameState.players).length
        const playerRole = playerCount === 0 ? "jugador1" : "jugador2"
        
        gameState.players[socket.id] = {
            name: playerName,
            role: playerRole
        }
        
        socket.emit("player-assigned", { role: playerRole, name: playerName })
        io.emit("players-update", gameState.players)
    })

    socket.on("chat-message", (msg) => {
        console.log("💬 Mensaje recibido:", msg)
        gameState.chat.push(msg)
        io.emit("chat-message", msg)
    })
    // board
    socket.on("update-board", (boardState) => {
        console.log("🛠️ Server recibió update-board:", boardState)
        gameState.board = { ...gameState.board, ...boardState }
        io.emit("update-board", boardState)
    })
    // blackout (pintar celdas)
    socket.on("update-board-blackout", (blackoutState) => {
        console.log("🟥 Server recibió update-board-blackout:", blackoutState)
        gameState.blackout = { ...gameState.blackout, ...blackoutState }
        io.emit("update-board-blackout", blackoutState)
    })

    // diceroller
    socket.on("update-diceroller", (diceState) => {
        console.log("🟢 Server recibió update-diceroller:", diceState)
        gameState.dice = { ...gameState.dice, ...diceState }
        io.emit("update-diceroller", diceState)
    })
    
    socket.on("update-turn", (turno) => {
        gameState.dice.turnoActual = turno
        io.emit("update-turn", turno)
    })
    
    socket.on("reset-board", () => {
        console.log("🗑️ Server recibió reset-board")
        gameState.board = {}
        gameState.blackout = {}
        io.emit("reset-board")
    })
    
    socket.on("disconnect", () => {
        delete gameState.players[socket.id]
        io.emit("players-update", gameState.players)
    })
})

// levantamos el servidor
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`🚀 Backend corriendo en http://localhost:${PORT}`)
})
