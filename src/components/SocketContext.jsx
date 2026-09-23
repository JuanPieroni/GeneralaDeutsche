import React from "react"
import { io } from "socket.io-client"
import { createContext, useContext, useEffect, useState } from "react"

const SocketContext = createContext(null)

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null)

    useEffect(() => {
        const url = import.meta.env.VITE_SOCKET_URL || window.location.origin
        const newSocket = io(url, {
            transports: ["websocket"],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            timeout: 20000,
        })

        const handleConnect = () => {
            console.log("🎉 Conectado al socket con ID:", newSocket.id)
        }

        const handleConnectError = (err) => {
            console.error("❌ Error de conexión:", err)
        }

        newSocket.on("connect", handleConnect)
        newSocket.on("connect_error", handleConnectError)

        setSocket(newSocket)

        return () => {
            newSocket.off("connect", handleConnect)
            newSocket.off("connect_error", handleConnectError)
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
