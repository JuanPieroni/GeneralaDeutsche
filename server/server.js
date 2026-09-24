import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"

const app = express()
const httpServer = createServer(app)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const allowedOrigins = [
    "http://localhost:5173",
    "https://generaladeutsche.netlify.app",
    "https://generaladeutsche.onrender.com",
]

app.use(cors({ origin: allowedOrigins, methods: ["GET", "POST"], credentials: true }))
app.use(express.static(path.join(__dirname, "../dist")))
app.get("*", (req, res, next) => {
    if (req.path.startsWith("/socket.io")) return next()
    res.sendFile(path.join(__dirname, "../dist/index.html"))
})

const io = new Server(httpServer, {
    cors: { origin: allowedOrigins, methods: ["GET", "POST"], credentials: true },
})

const INITIAL_DICE = {
    dice: [0, 0, 0, 0, 0],
    heldDice: [false, false, false, false, false],
    throwsLeft: 3,
    rollCount: 0,
}

const gameState = {
    board: {},
    blackout: {},
    dice: { ...INITIAL_DICE },
    chat: [],
    players: {},
    currentTurn: "jugador1", // quién puede tirar dados
}

io.on("connection", (socket) => {
    console.log("✅ Usuario conectado:", socket.id)

    socket.emit("game-state", {
        board: gameState.board,
        blackout: gameState.blackout,
        dice: gameState.dice,
        chat: gameState.chat,
        players: gameState.players,
        currentTurn: gameState.currentTurn,
    })

    socket.on("set-player", (playerName, preferredRole) => {
        const roles = Object.values(gameState.players).map(p => p.role)

        // Cancelar timer de gracia si el jugador se reconecta con el mismo nombre y rol
        const existing = Object.entries(gameState.players).find(
            ([, p]) => p.name === playerName && p.role === preferredRole && p._disconnectTimer
        )
        if (existing) {
            const [oldId, oldPlayer] = existing
            clearTimeout(oldPlayer._disconnectTimer)
            delete gameState.players[oldId]
        }

        const activePlayers = roles.filter(r => r === "jugador1" || r === "jugador2")

        if (activePlayers.length >= 2 && (!preferredRole || roles.includes(preferredRole))) {
            gameState.players[socket.id] = { name: playerName, role: "spectator" }
            socket.emit("player-assigned", { role: "spectator", name: playerName, currentTurn: gameState.currentTurn })
            io.emit("players-update", gameState.players)
            return
        }

        let playerRole
        if (preferredRole && !roles.includes(preferredRole)) {
            playerRole = preferredRole
        } else {
            playerRole = roles.includes("jugador1") ? "jugador2" : "jugador1"
        }
        const displayName = playerRole === "jugador1" ? "TOP" : "BOTTOM"

        gameState.players[socket.id] = { name: playerName, role: playerRole, displayName }

        socket.emit("player-assigned", { role: playerRole, name: playerName, currentTurn: gameState.currentTurn })
        io.emit("players-update", gameState.players)
    })

    socket.on("clear-chat", () => {
        gameState.chat = []
        io.emit("chat-cleared")
    })

    socket.on("chat-message", (msg) => {
        const player = gameState.players[socket.id]
        if (!player) return

        const fullMsg = `${player.name}: ${msg}`
        gameState.chat.push(fullMsg)
        if (gameState.chat.length > 50) gameState.chat = gameState.chat.slice(-50)

        io.emit("chat-message", fullMsg)
    })

    socket.on("update-board", (boardState) => {
        gameState.board = { ...gameState.board, ...boardState }
        socket.broadcast.emit("update-board", boardState)
    })

    socket.on("update-board-blackout", (blackoutState) => {
        gameState.blackout = { ...gameState.blackout, ...blackoutState }
        socket.broadcast.emit("update-board-blackout", blackoutState)
    })

    // Solo el jugador con el turno activo puede actualizar dados
    socket.on("update-diceroller", (diceState) => {
        const player = gameState.players[socket.id]
        if (!player || player.role !== gameState.currentTurn) return

        gameState.dice = { ...gameState.dice, ...diceState }
        // broadcast: el oponente ve los dados en tiempo real, el emisor ya los tiene localmente
        socket.broadcast.emit("update-diceroller", diceState)
    })

    // El jugador con turno activo pasa el turno al terminar su jugada
    socket.on("end-turn", () => {
        const player = gameState.players[socket.id]
        if (!player || player.role !== gameState.currentTurn) return

        gameState.currentTurn = gameState.currentTurn === "jugador1" ? "jugador2" : "jugador1"
        gameState.dice = { ...INITIAL_DICE }

        io.emit("turn-update", gameState.currentTurn)
        io.emit("update-diceroller", gameState.dice)
    })

    socket.on("reset-board", () => {
        gameState.board = {}
        gameState.blackout = {}
        gameState.dice = { ...INITIAL_DICE }
        gameState.currentTurn = "jugador1"
        io.emit("reset-board")
        io.emit("turn-update", gameState.currentTurn)
        io.emit("update-diceroller", gameState.dice)
    })

    socket.on("disconnect", () => {
        const player = gameState.players[socket.id]
        if (!player) return

        player._disconnectTimer = setTimeout(() => {
            delete gameState.players[socket.id]
            io.emit("players-update", gameState.players)
        }, 30000)
    })
})

const PORT = process.env.PORT || 3000
httpServer.listen(PORT, () => {
    console.log(`🚀 Backend corriendo en http://localhost:${PORT}`)
})
