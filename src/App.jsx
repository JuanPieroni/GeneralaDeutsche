import React from "react"
import { useState, useEffect, useMemo, useCallback } from "react"
import Board from "./components/Board"
import DiceRoller from "./components/DiceRoller"
import Chat from "./components/Chat"
import "./App.css"
import { useSocket } from "./components/SocketContext"

import BackgroundCollage from "./components/BackgroundCollage"

// Constantes fuera del componente para evitar recreación
const INITIAL_DICE = [0, 0, 0, 0, 0]
const INITIAL_HELD = [false, false, false, false, false]
const MAX_THROWS = 3

const App = () => {
    const socket = useSocket()
    
    const [turnoActual, setTurnoActual] = useState("jugador1")
    const [dice, setDice] = useState(INITIAL_DICE)
    const [heldDice, setHeldDice] = useState(INITIAL_HELD)
    const [throwsLeft, setThrowsLeft] = useState(MAX_THROWS)
    const [rollCount, setRollCount] = useState(0)
    const [playerRole, setPlayerRole] = useState(null)
    const [players, setPlayers] = useState({})

    useEffect(() => {
        if (!socket) return

        const handleConnect = () => {
            socket.emit("set-player", `Jugador-${socket.id.slice(-4)}`)
        }

        const handleGameState = (gameState) => {
            if (gameState.dice) {
                setDice(gameState.dice.dice)
                setHeldDice(gameState.dice.heldDice)
                setThrowsLeft(gameState.dice.throwsLeft)
                setRollCount(gameState.dice.rollCount)
                setTurnoActual(gameState.dice.turnoActual)
            }
            if (gameState.players) {
                setPlayers(gameState.players)
                const myPlayer = gameState.players[socket.id]
                if (myPlayer) {
                    setPlayerRole(myPlayer.role)
                }
            }
        }

        const handlePlayerAssigned = ({ role }) => {
            setPlayerRole(role)
        }

        const handlePlayersUpdate = (updatedPlayers) => {
            setPlayers(updatedPlayers)
        }

        const handleDiceUpdate = (diceState) => {
            setDice(diceState.dice)
            setHeldDice(diceState.heldDice)
            setThrowsLeft(diceState.throwsLeft)
            setRollCount(diceState.rollCount)
        }

        const handleTurnUpdate = (turno) => {
            setTurnoActual(turno)
        }

        if (socket.connected) {
            handleConnect()
        } else {
            socket.on("connect", handleConnect)
        }

        socket.on("game-state", handleGameState)
        socket.on("update-diceroller", handleDiceUpdate)
        socket.on("update-turn", handleTurnUpdate)
        socket.on("player-assigned", handlePlayerAssigned)
        socket.on("players-update", handlePlayersUpdate)

        return () => {
            socket.off("game-state", handleGameState)
            socket.off("update-diceroller", handleDiceUpdate)
            socket.off("update-turn", handleTurnUpdate)
            socket.off("player-assigned", handlePlayerAssigned)
            socket.off("players-update", handlePlayersUpdate)
            socket.off("connect", handleConnect)
        }
    }, [socket])

    const tirarDados = useCallback(() => {
        if (throwsLeft === 0 || playerRole !== turnoActual) return
        const newDice = dice.map((d, i) =>
            heldDice[i] ? d : Math.floor(Math.random() * 6) + 1
        )
        const newThrowsLeft = throwsLeft - 1
        const newRollCount = rollCount + 1
        
        setDice(newDice)
        setThrowsLeft(newThrowsLeft)
        setRollCount(newRollCount)

        const payload = {
            dice: newDice,
            heldDice,
            throwsLeft: newThrowsLeft,
            rollCount: newRollCount,
        }
        if (socket) {
            socket.emit("update-diceroller", payload)
        }
    }, [throwsLeft, dice, heldDice, rollCount, socket])

    const toggleHold = useCallback((index) => {
        if (playerRole !== turnoActual) return
        setHeldDice((prev) => {
            const copy = [...prev]
            copy[index] = !copy[index]

            const payload = {
                dice,
                heldDice: copy,
                throwsLeft,
                rollCount,
            }
            if (socket) {
                socket.emit("update-diceroller", payload)
            }
            return copy
        })
    }, [dice, throwsLeft, rollCount, socket])

    const terminarTurno = useCallback(() => {
        if (playerRole !== turnoActual) return
        const nuevoTurno = turnoActual === "jugador1" ? "jugador2" : "jugador1"
        setTurnoActual(nuevoTurno)
        setThrowsLeft(MAX_THROWS)
        setHeldDice(INITIAL_HELD)
        setDice(INITIAL_DICE)
        setRollCount(0)

        if (socket) {
            socket.emit("update-turn", nuevoTurno)
            socket.emit("update-diceroller", {
                dice: INITIAL_DICE,
                heldDice: INITIAL_HELD,
                throwsLeft: MAX_THROWS,
                rollCount: 0,
            })
        }
    }, [turnoActual, playerRole, socket])

    return (
        <>
            {/*  <BackgroundCollage/>   */}
            <h1>GENERALA ALEMANA</h1>
            <div className="app-container">
                <div
                    className="board-container"
                    style={{ maxWidth: 600, margin: "auto", padding: "1rem" }}
                >
                    <Board turnoActual={turnoActual} playerRole={playerRole} players={players} />
                    <DiceRoller
                        dice={dice}
                        heldDice={heldDice}
                        throwsLeft={throwsLeft}
                        turnoActual={turnoActual}
                        tirarDados={tirarDados}
                        toggleHold={toggleHold}
                        terminarTurno={terminarTurno}
                        rollCount={rollCount}
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
