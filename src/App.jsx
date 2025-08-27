import React from "react"
import { useState, useEffect } from "react"
import Board from "./components/Board"
import DiceRoller from "./components/DiceRoller"
import Chat from "./components/Chat"
import "./App.css"
import { useSocket } from "./components/SocketContext"

import BackgroundCollage from "./components/BackgroundCollage"

const App = () => {
    const socket = useSocket()
    useEffect(() => {
        if (!socket) {
            console.log("Socket no está listo aún")
            return
        }

        // Asignar jugador automáticamente al conectarse
        const handleConnect = () => {
            socket.emit("set-player", `Jugador-${socket.id.slice(-4)}`)
        }

        if (socket.connected) {
            handleConnect()
        } else {
            socket.on("connect", handleConnect)
        }

        const handleGameState = (gameState) => {
            console.log("📥 Estado completo del juego recibido:", gameState)
            if (gameState.dice) {
                setDice(gameState.dice.dice)
                setHeldDice(gameState.dice.heldDice)
                setThrowsLeft(gameState.dice.throwsLeft)
                setRollCount(gameState.dice.rollCount)
                setTurnoActual(gameState.dice.turnoActual)
            }
        }

        const handleDiceUpdate = (diceState) => {
            console.log("⬇️ Recibido update-diceroller:", diceState)
            setDice(diceState.dice)
            setHeldDice(diceState.heldDice)
            setThrowsLeft(diceState.throwsLeft)
            setRollCount(diceState.rollCount)
        }

        const handleTurnUpdate = (turno) => {
            setTurnoActual(turno)
        }

        socket.on("game-state", handleGameState)
        socket.on("update-diceroller", handleDiceUpdate)
        socket.on("update-turn", handleTurnUpdate)

        return () => {
            socket.off("game-state", handleGameState)
            socket.off("update-diceroller", handleDiceUpdate)
            socket.off("update-turn", handleTurnUpdate)
            socket.off("connect", handleConnect)
        }
    }, [socket])

    const INITIAL_DICE = [0, 0, 0, 0, 0]
    const INITIAL_HELD = [false, false, false, false, false]
    const MAX_THROWS = 3
    
    const [turnoActual, setTurnoActual] = useState("jugador1")
    const [dice, setDice] = useState(INITIAL_DICE)
    const [heldDice, setHeldDice] = useState(INITIAL_HELD)
    const [throwsLeft, setThrowsLeft] = useState(MAX_THROWS)
    const [rollCount, setRollCount] = useState(0)
    const tirarDados = () => {
        if (throwsLeft === 0) return
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
        console.log(
            "⬆️ Emitiendo dice:update desde tirarDados con datos:",
            JSON.stringify(payload)
        )
        socket.emit("update-diceroller", payload)
    }

    const toggleHold = (index) => {
        setHeldDice((prev) => {
            const copy = [...prev]
            copy[index] = !copy[index]

            const payload = {
                dice,
                heldDice: copy,
                throwsLeft,
                rollCount,
            }
            console.log(
                "⬆️ Emitiendo dice:update desde toggleHold con datos:",
                JSON.stringify(payload)
            )
            socket.emit("update-diceroller", payload)

            return copy
        })
    }

    const terminarTurno = () => {
        const nuevoTurno = turnoActual === "jugador1" ? "jugador2" : "jugador1"
        setTurnoActual(nuevoTurno)
        setThrowsLeft(MAX_THROWS)
        setHeldDice(INITIAL_HELD)
        setDice(INITIAL_DICE)
        setRollCount(0)

        socket.emit("update-turn", nuevoTurno)
        socket.emit("update-diceroller", {
            dice: INITIAL_DICE,
            heldDice: INITIAL_HELD,
            throwsLeft: MAX_THROWS,
            rollCount: 0,
        })
    }

    return (
        <>
            {/*  <BackgroundCollage/>   */}
            <h1>GENERALA ALEMANA</h1>
            <div className="app-container">
                <div
                    className="board-container"
                    style={{ maxWidth: 600, margin: "auto", padding: "1rem" }}
                >
                    <Board turnoActual={turnoActual} />
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
