import React, { useState, useEffect } from "react"
import { useSocket } from "./SocketContext"
import Swal from "sweetalert2"

const ROWS = 4

const Scorer = ({ players = {} }) => {
    const socket = useSocket()
    const [scores, setScores] = useState({})

    const p1Name = Object.values(players).find(p => p.role === "jugador1")?.name || "J1"
    const p2Name = Object.values(players).find(p => p.role === "jugador2")?.name || "J2"
    const COLS = [p1Name, p2Name]

    useEffect(() => {
        if (!socket) return

        const handleGameState = (state) => setScores(state.scorer || {})
        const handleUpdate = (data) => setScores((prev) => ({ ...prev, ...data }))
        const handleReset = () => setScores({})
        const handleResetCol = (col) => setScores((prev) => {
            const next = { ...prev }
            Object.keys(next).forEach(k => { if (k.startsWith(`${col}-`)) delete next[k] })
            return next
        })

        socket.on("game-state", handleGameState)
        socket.on("update-scorer", handleUpdate)
        socket.on("reset-scorer", handleReset)
        socket.on("reset-scorer-col", handleResetCol)

        return () => {
            socket.off("game-state", handleGameState)
            socket.off("update-scorer", handleUpdate)
            socket.off("reset-scorer", handleReset)
            socket.off("reset-scorer-col", handleResetCol)
        }
    }, [socket])

    const handleChange = (col, row, value) => {
        const key = `${col}-${row}`
        setScores((prev) => {
            const next = { ...prev, [key]: value }
            socket?.emit("update-scorer", { [key]: value })
            return next
        })
    }

    const getSubtotal = (col) =>
        Array.from({ length: ROWS }, (_, row) => parseFloat(scores[`${col}-${row}`]) || 0)
            .reduce((a, b) => a + b, 0)

    const handleReset = () => {
        Swal.fire({
            title: "¿Limpiar Tanteador?",
            text: "Se borrarán todos los puntajes del tanteador",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dd0000",
            cancelButtonColor: "#666666",
            confirmButtonText: "Sí, borrar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) socket?.emit("reset-scorer")
        })
    }

    return (
        <div style={{
            width: 320,
            background: "rgba(20,20,20,0.85)",
            border: "2px solid var(--german-gold)",
            borderRadius: 12,
            overflow: "hidden",
        }}>
            <div style={{
                fontFamily: "Germania One, serif",
                fontSize: "1rem",
                color: "var(--german-gold)",
                textAlign: "center",
                padding: "8px",
                borderBottom: "1px solid var(--german-gold)",
                letterSpacing: 2,
            }}>
                🏆 Tanteador Global
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        {COLS.map((col) => (
                            <th key={col} style={{
                                fontFamily: "Germania One, serif",
                                color: "#fff",
                                background: "linear-gradient(135deg, var(--german-red), #ff4444)",
                                padding: "6px",
                                border: "1px solid var(--german-gold)",
                                textAlign: "center",
                                fontSize: "0.9rem",
                            }}>{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: ROWS }, (_, row) => (
                        <tr key={row}>
                            {COLS.map((col) => {
                                const key = `${col}-${row}`
                                return (
                                    <td key={key} style={{
                                        border: "1px solid #444",
                                        padding: 0,
                                        height: 44,
                                    }}>
                                        <input
                                            type="text"
                                            value={scores[key] || ""}
                                            onChange={(e) => handleChange(col, row, e.target.value)}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                background: "transparent",
                                                border: "none",
                                                outline: "none",
                                                color: "#fff",
                                                fontFamily: "Kalam, cursive",
                                                fontSize: "1.2rem",
                                                fontWeight: 700,
                                                textAlign: "center",
                                                cursor: "text",
                                            }}
                                        />
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                    <tr>
                        {COLS.map((col) => (
                            <td key={`sub-${col}`} style={{
                                border: "1px solid var(--german-gold)",
                                borderTop: "2px solid var(--german-gold)",
                                height: 40,
                                background: "rgba(255,206,0,0.1)",
                                fontFamily: "Germania One, serif",
                                fontSize: "1.1rem",
                                color: "var(--german-gold)",
                                textAlign: "center",
                                fontWeight: 700,
                                verticalAlign: "middle",
                            }}>
                                {getSubtotal(col) || "-"}
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>

            <div style={{ padding: "8px" }}>
                <button
                    onClick={handleReset}
                    className="reset-button"
                    style={{ width: "100%", fontSize: "0.85rem" }}
                >
                    🗑️ Limpiar Tanteador
                </button>
            </div>
        </div>
    )
}

export default Scorer
