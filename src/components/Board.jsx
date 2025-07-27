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

const Board = () => {
    const [scores, setScores] = useState({})
    const [blackedOut, setBlackedOut] = useState({})

    const handleInputChange = (col, row, player, value) => {
        setScores((prev) => ({
            ...prev,
            [`${col}-${row}-${player}`]: value,
        }))
    }

    const toggleBlack = (col, row) => {
        const key = `${col}-${row}`
        setBlackedOut((prev) => ({
            ...prev,
            [key]: !prev[key],
        }))
    }

    return (
        <div className="board">
            <table>
                <thead>
                    <tr>
                        <th>
                            {" "}
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
                        
                        </th>
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
                                const black = blackedOut[`${col}-${row}`]
                                return (
                                    <td
                                        key={`${col}-${row}`}
                                        className={`cell ${
                                            black ? "black" : ""
                                        }`}
                                        onDoubleClick={() =>
                                            toggleBlack(col, row)
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
                                                disabled={black}
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
                                                
                                                disabled={black}
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
