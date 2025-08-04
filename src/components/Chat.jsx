import React from "react"
import { useEffect, useState } from "react"
import { useSocket } from "./SocketContext"
import "./Chat.css"

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
        <div className="chat-container">
            <h3 className="chat-title">Chat</h3>
            <div
                className="chat-messages"
                style={{
                    maxHeight: "150px",
                    overflowY: "auto",
                    border: "1px solid #ccc",
                }}
            >
                {mensajes.map((m, i) => (
                    <div key={i} className="chat-message">
                        {m}
                    </div>
                ))}
            </div>
            <input
                className="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribí algo"
            />
            <button className="chat-button" onClick={enviar}>
                Enviar
            </button>
        </div>
    )
}

export default Chat
