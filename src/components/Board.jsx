import React, { useState } from "react"
import "./Board.css"
import { useSocket } from "./SocketContext"
import { useEffect } from "react"
import Swal from "sweetalert2"

const categories = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "Escalera",
    "Full",
    "Poker",
    "Generala",
]

const columns = ["1", "2", "3"]

const Board = ({ turnoActual, onResetBoard }) => {
    const socket = useSocket()
    const [scores, setScores] = useState({})
    const [blackedOut, setBlackedOut] = useState({})

    useEffect(() => {
        if (!socket) return

        const handleGameState = (gameState) => {
            setScores(gameState.board)
            setBlackedOut(gameState.blackout)
        }

        const handleBoardUpdate = (updatedCell) => {
            console.log("Recibido update-board:", updatedCell)
            setScores((prev) => ({
                ...prev,
                ...updatedCell,
            }))
        }

        const handleBlackoutUpdate = (updatedBlackout) => {
            console.log("Recibido update-board-blackout:", updatedBlackout)
            setBlackedOut((prev) => ({
                ...prev,
                ...updatedBlackout,
            }))
        }

        const handleResetBoard = () => {
            console.log("Recibido reset-board del servidor")
            setScores({})
            setBlackedOut({})
        }

        socket.on("game-state", handleGameState)
        socket.on("update-board", handleBoardUpdate)
        socket.on("update-board-blackout", handleBlackoutUpdate)
        socket.on("reset-board", handleResetBoard)

        return () => {
            socket.off("game-state", handleGameState)
            socket.off("update-board", handleBoardUpdate)
            socket.off("update-board-blackout", handleBlackoutUpdate)
            socket.off("reset-board", handleResetBoard)
        }
    }, [socket])

    const handleInputChange = (col, row, player, value) => {
        console.log(socket.connected, "escribiendo...")
        const key = `${col}-${row}-${player}`
        setScores((prev) => ({
            ...prev,
            [key]: value,
        }))
        if (socket) {
            socket.emit("update-board", { [key]: value })
        }
    }
    const toggleBlack = (col, row, player) => {
        const key = `${col}-${row}-${player}`
        setBlackedOut((prev) => {
            const newState = {
                ...prev,
                [key]: !prev[key],
            }
            console.log("Emitiendo blackoutt:", { [key]: newState[key] }) // <- Asegurate de tener este log para debug
            // Emitir al servidor
            if (socket) {
                socket.emit("update-board-blackout", { [key]: newState[key] })
            }

            return newState
        })
    }

    const handleDoubleClick = (e, col, row) => {
        const cell = e.currentTarget.getBoundingClientRect()
        const clickY = e.clientY - cell.top
        const isTopHalf = clickY < cell.height / 2
        const targetPlayer = isTopHalf ? "top" : "bottom"
        toggleBlack(col, row, targetPlayer)
    }

    const resetBoard = () => {
        Swal.fire({
            title: "¿Borrar Puntajes?",
            text: "Se borrarán todos los puntajes del tablero",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dd0000",
            cancelButtonColor: "#666666",
            confirmButtonText: "Sí, borrar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                setScores({})
                setBlackedOut({})
                if (socket) {
                    socket.emit("reset-board")
                }
                if (onResetBoard) onResetBoard()
                Swal.fire(
                    "Listo!!",
                    "El tablero ha sido borrado para una nueva partida",
                    "success"
                )
            }
        })
    }

    return (
        <div className="board">
            <div className="board-controls">
                <button onClick={resetBoard} className="reset-button">
                    🗑️ Limpiar Tablero
                </button>
            </div>
            <table>
                <thead>
                    <tr className="tr-head">
                        <th>🌭🍺🌭🍺</th>
                        {columns.map((col) => (
                            <th key={col}>{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {categories.map((row) => (
                        <tr key={row}>
                            <td className="td-body">{row}</td>
                            {columns.map((col) => {
                                const blackTop = blackedOut[`${col}-${row}-top`]
                                const blackBottom =
                                    blackedOut[`${col}-${row}-bottom`]
                                return (
                                    <td
                                        key={`${col}-${row}`}
                                        className="cell"
                                        onDoubleClick={(e) =>
                                            handleDoubleClick(e, col, row)
                                        }
                                    >
                                        <div className="diagonal-cell">
                                            <svg
                                                className="diagonal-line"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <line
                                                    x1="100%"
                                                    y1="0"
                                                    x2="0"
                                                    y2="100%"
                                                    stroke="black"
                                                    strokeWidth="1"
                                                />
                                            </svg>
                                            {blackTop && (
                                                <div className="black-overlay top-overlay"></div>
                                            )}
                                            {blackBottom && (
                                                <div className="black-overlay bottom-overlay"></div>
                                            )}
                                            <input
                                                type="text"
                                                className="top"
                                                value={
                                                    scores[
                                                        `${col}-${row}-top`
                                                    ] || ""
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        col,
                                                        row,
                                                        "top",
                                                        e.target.value
                                                    )
                                                }
                                                disabled={blackTop}
                                            />
                                            <input
                                                type="text"
                                                className="bottom"
                                                value={
                                                    scores[
                                                        `${col}-${row}-bottom`
                                                    ] || ""
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        col,
                                                        row,
                                                        "bottom",
                                                        e.target.value
                                                    )
                                                }
                                                disabled={blackBottom}
                                            />
                                        </div>
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Board
