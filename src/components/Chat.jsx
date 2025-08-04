import React from "react"
import { useEffect, useState } from "react"
import { useSocket } from "./SocketContext"

const Chat = () => {
    const socket = useSocket()
    const [input, setInput] = useState("")
    const [mensajes, setMensajes] = useState([])

    useEffect(() => {
        if (!socket) return
        console.log("📡 Socket conectado:", socket)

        socket.on("connect", () => {
            console.log("📡 Socket conectado con ID:", socket.id)
        })
        socket.on("chat-message", (msg) => {
            console.log("📨 Mensaje recibido:", msg)
            setMensajes((prev) => [...prev, msg])
        })

        return () => {
            socket.off("chat-message")
            socket.off("connect")
        }
    }, [socket])

    const enviar = () => {
        if (input.trim() && socket) {
          console.log("📤 Enviando mensaje:", input)
            socket.emit("chat-message", input)
            setInput("")
        }
    }

    return (
        <div>
            <h3>Chat</h3>
            <div
                style={{
                    maxHeight: "150px",
                    overflowY: "auto",
                    border: "1px solid #ccc",
                }}
            >
                {mensajes.map((m, i) => (
                    <div key={i}>{m}</div>
                ))}
            </div>
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribí algo"
            />
            <button onClick={enviar}>Enviar</button>
        </div>
    )
}

export default Chat
