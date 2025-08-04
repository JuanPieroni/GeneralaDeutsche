import React from "react"
import { useState, useEffect } from "react"
import Board from "./components/Board"
import DiceRoller from "./components/DiceRoller"
import Chat from "./components/Chat"
import "./App.css"
import { useSocket } from "./components/SocketContext"

const App = () => {
    const socket = useSocket()
    useEffect(() => {
        if (!socket) {
            console.log("Socket no está listo aún")
            return
        }
        const handleDiceUpdate = (diceState) => {
            console.log("⬇️ Recibido update-diceroller:", diceState)
            setDice(diceState.dice)
            setHeldDice(diceState.heldDice)
            setThrowsLeft(diceState.throwsLeft)
            setRollCount(diceState.rollCount)
        }

        socket.on("update-diceroller", handleDiceUpdate)

        console.log("🟢 Listener update-diceroller agregado")

        return () => {
            socket.off("update-diceroller", handleDiceUpdate)
            console.log("🔴 Listener update-diceroller removido")
        }
    }, [socket])

    const [turnoActual, setTurnoActual] = useState("jugador1")
    const [dice, setDice] = useState([0, 0, 0, 0, 0])
    const [heldDice, setHeldDice] = useState([
        false,
        false,
        false,
        false,
        false,
    ])
    const [throwsLeft, setThrowsLeft] = useState(3)
    const [rollCount, setRollCount] = useState(0) // <-- contador de tiradas
    const tirarDados = () => {
        if (throwsLeft === 0) return
        const newDice = dice.map((d, i) =>
            heldDice[i] ? d : Math.floor(Math.random() * 6) + 1
        )
        setDice(newDice)
        setThrowsLeft((prev) => prev - 1)
        setRollCount((prev) => prev + 1)

        const payload = {
            dice: newDice,
            heldDice,
            throwsLeft: throwsLeft - 1,
            rollCount: rollCount + 1,
        }
        console.log(
            "⬆️ Emitiendo dice:update desde tirarDados con datos:",
            payload
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
                payload
            )
            socket.emit("update-diceroller", payload)

            return copy
        })
    }

    const terminarTurno = () => {
        setTurnoActual((prev) =>
            prev === "jugador1" ? "jugador2" : "jugador1"
        )
        setThrowsLeft(3)
        setHeldDice([false, false, false, false, false])
        setDice([0, 0, 0, 0, 0])
        setRollCount(0) // <-- resetear contador al terminar turno
    }

    return (
        <>
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
                        rollCount={rollCount} // <-- PASAR contador
                    />
                </div>
                <div className="chat-container">
                    <Chat />
                </div>
            </div>
        </>
    )
}

export default App
