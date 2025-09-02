import React from "react"
import { useEffect, useState, useRef } from "react"
import { useSocket } from "./SocketContext"
import "./Chat.css"

const Chat = () => {
    const socket = useSocket()
    const [input, setInput] = useState("")
    const [messages, setMessages] = useState([])
    const messagesEndRef = useRef(null)

    useEffect(() => {
        if (!socket) return
        
        const handleGameState = (gameState) => {
            setMessages(gameState.chat || [])
        }

        const handleChatMessage = (msg) => {
            setMessages((prev) => [...prev, msg])
        }

        socket.on("game-state", handleGameState)
        socket.on("chat-message", handleChatMessage)

        return () => {
            socket.off("game-state", handleGameState)
            socket.off("chat-message", handleChatMessage)
        }
    }, [socket])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])  

    const sendMessage = () => {
        if (input.trim() && socket) {
            socket.emit("chat-message", input)
            setInput("")
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            sendMessage()
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
                {(messages || []).map((m, i) => (
                    <div key={`${i}-${m}`} className="chat-message">
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
                    onKeyDown={handleKeyDown}
                    placeholder="Escribí algo..."
                />
                <button className="chat-button" onClick={sendMessage}>
                    Enviar
                </button>
            </div>
        </div>
    )
}

export default Chat
