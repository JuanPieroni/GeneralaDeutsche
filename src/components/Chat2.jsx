import React, { useState, useEffect } from "react"
import { Send, Dice1, Crown } from "lucide-react"
import { useSocket } from "./SocketContext"


const  GermanGeneralaChat = () => {
    const socket = useSocket()
    const [mensajes, setMensajes] = useState([
        "🎲 ¡Herzlich Willkommen zur Generala! 🎲",
        "📋 Sistema: Chat iniciado - ¡Viel Glück!",
    ])
    const [input, setInput] = useState("")
  

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-yellow-800 p-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-yellow-400 to-red-600 rounded-t-lg p-4 shadow-2xl">
                    <div className="flex items-center justify-center space-x-3">
                        <Crown className="text-red-900 w-8 h-8" />
                        <h1
                            className="text-3xl font-bold text-red-900"
                            style={{ fontFamily: "serif" }}
                        >
                            Deutsche Generala Chat
                        </h1>
                        <Dice1 className="text-red-900 w-8 h-8" />
                    </div>
                    <div className="text-center mt-2">
                        <span className="text-red-800 font-semibold text-sm">
                            🍺 Prost! Spiel mit Stil! 🍺
                        </span>
                    </div>
                </div>

                {/* Chat Container */}
                <div className="bg-gradient-to-b from-amber-50 to-yellow-100 border-4 border-red-800 shadow-2xl">
                    {/* Chat Messages */}
                    <div
                        className="h-80 overflow-y-auto p-4 space-y-3"
                        style={{
                            backgroundImage: `linear-gradient(45deg, rgba(255,215,0,0.1) 25%, transparent 25%), 
                                            linear-gradient(-45deg, rgba(255,215,0,0.1) 25%, transparent 25%), 
                                            linear-gradient(45deg, transparent 75%, rgba(255,215,0,0.1) 75%), 
                                            linear-gradient(-45deg, transparent 75%, rgba(255,215,0,0.1) 75%)`,
                            backgroundSize: "20px 20px",
                            backgroundPosition:
                                "0 0, 0 10px, 10px -10px, -10px 0px",
                        }}
                    >
                        {mensajes.map((mensaje, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105 ${
                                    mensaje.includes("Sistema:")
                                        ? "bg-gradient-to-r from-red-700 to-red-800 text-yellow-100 border-l-4 border-yellow-400"
                                        : mensaje.includes("Spieler:")
                                        ? "bg-gradient-to-r from-yellow-600 to-amber-600 text-white border-l-4 border-red-600 ml-4"
                                        : "bg-gradient-to-r from-amber-600 to-yellow-700 text-white text-center border-2 border-red-700"
                                }`}
                                style={{
                                    fontFamily: mensaje.includes("Sistema:")
                                        ? "monospace"
                                        : "serif",
                                    fontSize: mensaje.includes(
                                        "¡Herzlich Willkommen"
                                    )
                                        ? "1.1rem"
                                        : "1rem",
                                    fontWeight: mensaje.includes("Sistema:")
                                        ? "normal"
                                        : "bold",
                                }}
                            >
                                {mensaje}
                            </div>
                        ))}
                    </div>

                    {/* Decorative Separator */}
                    <div className="bg-gradient-to-r from-red-800 via-yellow-600 to-red-800 h-1"></div>

                    {/* Input Section */}
                    <div className="bg-gradient-to-r from-yellow-200 to-amber-200 p-4">
                        <div className="flex space-x-3">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Schreib etwas... (¡Respeta mayúsculas y minúsculas!)"
                                    className="w-full px-4 py-3 bg-white border-3 border-red-700 rounded-lg 
                                             focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:border-red-800
                                             text-gray-800 placeholder-gray-500 font-serif text-lg
                                             shadow-inner transition-all duration-200"
                                    style={{
                                        textShadow: "0 1px 1px rgba(0,0,0,0.1)",
                                    }}
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-700">
                                    🎲
                                </div>
                            </div>
                            <button
                                onClick={enviar}
                                className="bg-gradient-to-b from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 
                                         text-yellow-100 px-6 py-3 rounded-lg font-bold text-lg
                                         border-3 border-red-900 shadow-lg transform transition-all duration-200 
                                         hover:scale-105 hover:shadow-xl active:scale-95
                                         flex items-center space-x-2"
                                style={{ fontFamily: "serif" }}
                            >
                                <Send className="w-5 h-5" />
                                <span>Senden</span>
                            </button>
                        </div>

                        {/* Footer info */}
                        <div className="mt-3 text-center">
                            <p
                                className="text-red-800 text-sm font-semibold"
                                style={{ fontFamily: "serif" }}
                            >
                                🎯 Generala Alemana • Mantén el formato original
                                del texto • Gute Partie! 🎯
                            </p>
                        </div>
                    </div>
                </div>

                {/* Decorative bottom */}
                <div className="bg-gradient-to-r from-red-800 to-yellow-600 rounded-b-lg p-2 shadow-2xl">
                    <div className="text-center text-yellow-100 font-bold text-sm">
                        🍻 Ein Prosit der Gemütlichkeit! 🍻
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GermanGeneralaChat
