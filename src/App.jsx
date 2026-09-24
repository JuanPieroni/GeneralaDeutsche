import React, { useState, useEffect, useCallback } from "react"
import Board from "./components/Board"
import DiceRoller from "./components/DiceRoller"
import Chat from "./components/Chat"
import Welcome from "./components/Welcome"
import Swal from "sweetalert2"
import "./App.css"
import "./styles/globals.css"
import { useSocket } from "./components/SocketContext"
import Footer from "./components/Footer"

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
    const [playerName, setPlayerName] = useState("")
    const [hasEntered, setHasEntered] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const isMyTurn = myRole === currentTurn

    useEffect(() => {
        if (!socket) return

        const handleConnect = () => {}

        const handleGameState = (state) => {
            if (state.dice) {
                setDice(state.dice.dice)
                setHeldDice(state.dice.heldDice)
                setThrowsLeft(state.dice.throwsLeft)
                setRollCount(state.dice.rollCount)
            }
            if (state.currentTurn) setCurrentTurn(state.currentTurn)
        }

        const handlePlayerAssigned = ({ role, name, currentTurn: turn }) => {
            setMyRole(role)
            localStorage.setItem("generala-role", role)
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

    const resetBoard = useCallback(() => {
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
            if (result.isConfirmed && socket) {
                socket.emit("reset-board")
                Swal.fire("Listo!!", "El tablero ha sido borrado para una nueva partida", "success")
            }
        })
    }, [socket])

    const handleEnter = (name) => {
        setPlayerName(name)
        localStorage.setItem("generala-name", name)
        setIsLoading(true)
        if (socket?.connected) {
            const savedRole = localStorage.getItem("generala-role")
            socket.emit("set-player", name, savedRole)
        }
        setTimeout(() => {
            setIsLoading(false)
            setHasEntered(true)
        }, 2200)
    }

    const isSpectator = myRole === "spectator"

    if (isLoading) return (
        <div style={{
            position: "fixed", inset: 0, background: "#111",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: "1.2rem", zIndex: 9999
        }}>
            <div style={{ fontSize: "3rem", animation: "spin 1s linear infinite" }}>🎲</div>
            <p style={{ color: "var(--german-gold)", fontFamily: "Germania One, serif", fontSize: "1.4rem", margin: 0 }}>
                Aguarde por favor...
            </p>
            <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
        </div>
    )

    return (
        <>
            {!hasEntered && <Welcome onEnter={handleEnter} />}
            <h1>GENERALA ALEMANA</h1>
            <div className="app-container">
                <div
                        className="board-container"
                        style={{ maxWidth: 600, margin: "auto", padding: "1rem", minHeight: "400px", display: "block", position: "relative" }}
                    >
                        {isSpectator && (
                            <div style={{
                                position: "absolute",
                                inset: 0,
                                background: "rgba(0,0,0,0.55)",
                                borderRadius: 16,
                                zIndex: 10,
                                pointerEvents: "all",
                            }} />
                        )}
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
                            playerName={playerName}
                        />
                    </div>
                <div className="chat-side">
                    {isSpectator && (
                        <div style={{
                            textAlign: "center",
                            padding: "1rem",
                            color: "#ffce00",
                            fontFamily: "Germania One, serif",
                            fontSize: "1.1rem",
                            border: "2px solid #ffce00",
                            borderRadius: 8,
                            marginBottom: "0.75rem",
                            background: "rgba(255,206,0,0.08)"
                        }}>
                            👁️ Partida en curso — Solo podés chatear
                        </div>
                    )}
                    <Chat playerName={playerName} />
                    {!isSpectator && (
                        <div style={{ width: 320, textAlign: "center" }}>
                            <button onClick={resetBoard} className="reset-button" style={{ width: "100%" }}>
                                🗑️ Limpiar Tablero
                            </button>
                            <button onClick={() => socket?.emit("clear-chat")} className="reset-button" style={{ width: "100%", marginTop: "0.5rem" }}>
                                🗑️ Limpiar Chat
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    )
}

export default App
