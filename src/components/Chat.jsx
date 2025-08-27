import React from "react"
import { useEffect, useState, useRef } from "react"
import { useSocket } from "./SocketContext"
import "./Chat.css"

const Chat = () => {
    const socket = useSocket()
    const [input, setInput] = useState("")
    const [mensajes, setMensajes] = useState([])
    const messagesEndRef = useRef(null)

    useEffect(() => {
        if (!socket) return
        
        const handleGameState = (gameState) => {
            setMensajes(gameState.chat || [])
        }

        socket.on("game-state", handleGameState)
        socket.on("chat-message", (msg) => {
            console.log("📨 Mensaje recibido:", msg)
            setMensajes((prev) => [...prev, msg])
        })

        return () => {
            socket.off("game-state", handleGameState)
            socket.off("chat-message")
        }
    }, [socket])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [mensajes])  

    const enviar = () => {
        if (input.trim() && socket) {
            console.log("📤 Enviando mensaje:", input)
            socket.emit("chat-message", input)
            setInput("")
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            enviar()
        }
    }

    return (
        <div className="chat-container">
            <h3 className="chat-title">Chat</h3>
            <div
                className="chat-messages"
                style={{
                    maxHeight: "200px",
                    overflowY: "auto",
                }}
            >
                {(mensajes || []).map((m, i) => (
                    <div key={i} className="chat-message">
                        {m}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-input-container">
                <input
                    className="chat-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribí algo..."
                />
                <button className="chat-button" onClick={enviar}>
                    Enviar
                </button>
            </div>
        </div>
    )
}

export default Chat
