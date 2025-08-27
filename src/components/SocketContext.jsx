import React from "react"
import { io } from "socket.io-client"
import { createContext, useContext, useEffect, useState } from "react"

const SocketContext = createContext(null)

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null)

    useEffect(() => {
        const newSocket = io("https://generaladeutsche.onrender.com", {
            transports: ["websocket"],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            timeout: 20000,
        })

        newSocket.on("connect", () => {
            console.log("🎉 Conectado al socket con ID:", newSocket.id)
        })

        newSocket.on("connect_error", (err) => {
            console.error("❌ Error de conexión:", err)
        })

        setSocket(newSocket)

        return () => {
            newSocket.disconnect()
        }
    }, [])

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => useContext(SocketContext)
