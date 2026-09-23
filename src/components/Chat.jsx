import React, { useEffect, useState, useRef } from "react"
import { useSocket } from "./SocketContext"
import "./Chat.css"

const Chat = () => {
    const socket = useSocket()
    const [input, setInput] = useState("")
    const [messages, setMessages] = useState([])
    const messagesRef = useRef(null)

    useEffect(() => {
        if (!socket) return

        const handleGameState = (state) => setMessages(state.chat || [])
        const handleMessage = (msg) => setMessages((prev) => [...prev, msg])

        socket.on("game-state", handleGameState)
        socket.on("chat-message", handleMessage)

        return () => {
            socket.off("game-state", handleGameState)
            socket.off("chat-message", handleMessage)
        }
    }, [socket])

    useEffect(() => {
        if (messagesRef.current)
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }, [messages])

    const send = () => {
        if (!input.trim() || !socket) return
        socket.emit("chat-message", input.trim())
        setInput("")
    }

    return (
        <div className="chat-wrapper">
            <div className="chat-title">💬 Chat</div>
            <div className="chat-messages" ref={messagesRef}>
                {messages.map((m, i) => {
                    const idx = m.indexOf(":")
                    const nick = idx !== -1 ? m.slice(0, idx + 1) : ""
                    const text = idx !== -1 ? m.slice(idx + 1) : m
                    return (
                        <div key={i} className="chat-message">
                            <span className="nick">{nick}</span>
                            {text}
                        </div>
                    )
                })}
            </div>
            <div className="chat-input-row">
                <input
                    className="chat-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && send()}
                    placeholder="Escribí algo..."
                />
                <button className="chat-send-btn" onClick={send}>Enviar</button>
            </div>
        </div>
    )
}

export default Chat
