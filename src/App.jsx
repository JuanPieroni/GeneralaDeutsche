import React, { useState, useEffect, useCallback } from "react"
import Board from "./components/Board"
import DiceRoller from "./components/DiceRoller"
import Chat from "./components/Chat"
import "./App.css"
import "./styles/globals.css"
import { useSocket } from "./components/SocketContext"

const INITIAL_DICE = [0, 0, 0, 0, 0]
const INITIAL_HELD = [false, false, false, false, false]
const MAX_THROWS = 3

const App = () => {
    const socket = useSocket()

    const [dice, setDice] = useState(INITIAL_DICE)
    const [heldDice, setHeldDice] = useState(INITIAL_HELD)
    const [throwsLeft, setThrowsLeft] = useState(MAX_THROWS)
    const [rollCount, setRollCount] = useState(0)
    const [myRole, setMyRole] = useState(null)
    const [currentTurn, setCurrentTurn] = useState("jugador1")

    const isMyTurn = myRole === currentTurn

    useEffect(() => {
        if (!socket) return

        const handleConnect = () => {
            socket.emit("set-player", `Jugador-${socket.id.slice(-4)}`)
        }

        const handleGameState = (state) => {
            if (state.dice) {
                setDice(state.dice.dice)
                setHeldDice(state.dice.heldDice)
                setThrowsLeft(state.dice.throwsLeft)
                setRollCount(state.dice.rollCount)
            }
            if (state.currentTurn) setCurrentTurn(state.currentTurn)
        }

        const handlePlayerAssigned = ({ role, currentTurn: turn }) => {
            setMyRole(role)
            if (turn) setCurrentTurn(turn)
        }

        const handleDiceUpdate = (diceState) => {
            setDice(diceState.dice)
            setHeldDice(diceState.heldDice)
            setThrowsLeft(diceState.throwsLeft)
            setRollCount(diceState.rollCount)
        }

        const handleTurnUpdate = (turn) => {
            setCurrentTurn(turn)
            setDice(INITIAL_DICE)
            setHeldDice(INITIAL_HELD)
            setThrowsLeft(MAX_THROWS)
            setRollCount(0)
        }

        if (socket.connected) handleConnect()
        else socket.on("connect", handleConnect)

        socket.on("game-state", handleGameState)
        socket.on("player-assigned", handlePlayerAssigned)
        socket.on("update-diceroller", handleDiceUpdate)
        socket.on("turn-update", handleTurnUpdate)

        return () => {
            socket.off("connect", handleConnect)
            socket.off("game-state", handleGameState)
            socket.off("player-assigned", handlePlayerAssigned)
            socket.off("update-diceroller", handleDiceUpdate)
            socket.off("turn-update", handleTurnUpdate)
        }
    }, [socket])

    const tirarDados = useCallback(() => {
        if (throwsLeft === 0 || !isMyTurn) return

        const newDice = dice.map((d, i) =>
            heldDice[i] ? d : Math.floor(Math.random() * 6) + 1
        )
        const newThrowsLeft = throwsLeft - 1
        const newRollCount = rollCount + 1

        setDice(newDice)
        setThrowsLeft(newThrowsLeft)
        setRollCount(newRollCount)

        if (socket) {
            socket.emit("update-diceroller", {
                dice: newDice,
                heldDice,
                throwsLeft: newThrowsLeft,
                rollCount: newRollCount,
            })
        }
    }, [throwsLeft, dice, heldDice, rollCount, socket, isMyTurn])

    // toggleHold: solo actualiza local, emite solo si es mi turno
    const toggleHold = useCallback((index) => {
        if (!isMyTurn) return
        setHeldDice((prev) => {
            const copy = [...prev]
            copy[index] = !copy[index]
            if (socket) {
                socket.emit("update-diceroller", {
                    dice,
                    heldDice: copy,
                    throwsLeft,
                    rollCount,
                })
            }
            return copy
        })
    }, [dice, throwsLeft, rollCount, socket, isMyTurn])

    const endTurn = useCallback(() => {
        if (!isMyTurn || !socket) return
        socket.emit("end-turn")
    }, [socket, isMyTurn])

    const resetDados = useCallback(() => {
        if (!socket) return
        const payload = { dice: INITIAL_DICE, heldDice: INITIAL_HELD, throwsLeft: MAX_THROWS, rollCount: 0 }
        setDice(INITIAL_DICE)
        setHeldDice(INITIAL_HELD)
        setThrowsLeft(MAX_THROWS)
        setRollCount(0)
        socket.emit("update-diceroller", payload)
    }, [socket])

    return (
        <>
            <h1 style={{ fontSize: "2rem", textAlign: "center", margin: "1rem 0", display: "block" }}>
                GENERALA ALEMANA
            </h1>
            <div className="app-container">
                <div
                    className="board-container"
                    style={{ maxWidth: 600, margin: "auto", padding: "1rem", minHeight: "400px", display: "block" }}
                >
                    <Board />
                    <DiceRoller
                        dice={dice}
                        heldDice={heldDice}
                        throwsLeft={throwsLeft}
                        tirarDados={tirarDados}
                        toggleHold={toggleHold}
                        resetDados={resetDados}
                        rollCount={rollCount}
                        isMyTurn={isMyTurn}
                        myRole={myRole}
                        currentTurn={currentTurn}
                        onEndTurn={endTurn}
                    />
                </div>
                <div>
                    <Chat />
                </div>
            </div>
        </>
    )
}

export default App
