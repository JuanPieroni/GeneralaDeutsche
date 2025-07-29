import React, { useState } from "react"
import Board from "./components/Board"
import DiceRoller from "./components/DiceRoller"
import Chat from "./components/Chat"

const App = () => {
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

    const tirarDados = () => {
        if (throwsLeft === 0) return
        const newDice = dice.map((d, i) =>
            heldDice[i] ? d : Math.floor(Math.random() * 6) + 1
        )
        setDice(newDice)
        setThrowsLeft((prev) => prev - 1)
    }

    const toggleHold = (index) => {
        setHeldDice((prev) => {
            const copy = [...prev]
            copy[index] = !copy[index]
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
    }

    return (
        <>
            <h1>GENERALA ALEMANA</h1>
            <div style={{ maxWidth: 600, margin: "auto", padding: "1rem" }}>
                <Board turnoActual={turnoActual} />
                <DiceRoller
                    dice={dice}
                    heldDice={heldDice}
                    throwsLeft={throwsLeft}
                    turnoActual={turnoActual}
                    tirarDados={tirarDados}
                    toggleHold={toggleHold}
                    terminarTurno={terminarTurno}
                />
                <Chat /> 
            </div>
        </>
    )
}

export default App
