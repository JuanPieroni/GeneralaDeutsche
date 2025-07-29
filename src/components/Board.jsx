import React, { useState } from "react"
import "./Board.css"

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

const columns = ["A", "B", "C"]

const Board = ({ turnoActual }) => {
    const [scores, setScores] = useState({})
    const [blackedOut, setBlackedOut] = useState({})

    const handleInputChange = (col, row, player, value) => {
        setScores((prev) => ({
            ...prev,
            [`${col}-${row}-${player}`]: value,
        }))
    }

    const toggleBlack = (col, row, player) => {
        const key = `${col}-${row}-${player}`
        setBlackedOut((prev) => ({
            ...prev,
            [key]: !prev[key],
        }))
    }

    const handleDoubleClick = (e, col, row) => {
        const cell = e.currentTarget.getBoundingClientRect()
        const clickY = e.clientY - cell.top
        const isTopHalf = clickY < cell.height / 2
        const targetPlayer = isTopHalf ? "top" : "bottom"
        toggleBlack(col, row, targetPlayer)
    }

    return (
        <div className="board">
            <div className="board-header">
                <h3>
                    Turno de:{" "}
                    {turnoActual === "jugador1"
                        ? "Jugador 1 (Admin)"
                        : "Jugador 2"}
                </h3>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Categoría</th>
                        {columns.map((col) => (
                            <th key={col}>Generala {col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {categories.map((row) => (
                        <tr key={row}>
                            <td>{row}</td>
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
