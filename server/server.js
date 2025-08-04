import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"

const app = express()
const httpServer = createServer(app)

// ⚠️ CORS para permitir desde el frontend
app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    })
)

// inicializamos socket.io
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
})

// escucha de sockets
io.on("connection", (socket) => {
    console.log("✅ Usuario conectado:", socket.id)

    socket.on("chat-message", (msg) => {
        console.log("💬 Mensaje recibido:", msg)
        io.emit("chat-message", msg)
    })
    // board
    socket.on("update-board", (boardState) => {
        console.log("🛠️ Server recibió update-board:", boardState)
        io.emit("update-board", boardState)
    })
    // blackout (pintar celdas)
    socket.on("update-board-blackout", (blackoutState) => {
        console.log("🟥 Server recibió update-board-blackout:", blackoutState)
        io.emit("update-board-blackout", blackoutState)
    })

    // diceroller
    socket.on("update-diceroller", (diceState) => {
        console.log("🟢 Server recibió update-diceroller:", diceState)
        io.emit("update-diceroller", diceState)
    })
})

// levantamos el servidor
const PORT = 3000
httpServer.listen(PORT, () => {
    console.log(`🚀 Backend corriendo en http://localhost:${PORT}`)
})
