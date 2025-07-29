import React from "react"
import { motion } from "framer-motion"
import "./DiceRoller.css"

const DiceRoller = ({
    dice,
    heldDice,
    throwsLeft,
    turnoActual,
    tirarDados,
    toggleHold,
    terminarTurno,
}) => {
    return (
        <div className="dice-roller">
            <h3>
                Tirar dados - Turno de:{" "}
                {turnoActual === "jugador1" ? "Jugador 1 (Admin)" : "Jugador 2"}
            </h3>
            <div className="dice-container">
                {dice.map((num, idx) => (
                    <motion.div
                        layout
                        key={`${idx}-${num}`} // esto obliga a una reanimación si cambia el número
                        className={`die ${heldDice[idx] ? "held" : ""}`}
                        onClick={() => toggleHold(idx)}
                        title={
                            heldDice[idx]
                                ? "Dado retenido - Click para soltar"
                                : "Click para retener dado"
                        }
                        initial={{ scale: 0.5, rotate: -180, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 15,
                            delay: idx * 0.5,
                            duration: 0.4,
                        }}
                    >
                        {num}
                    </motion.div>
                ))}
            </div>
            <div>
                <button onClick={tirarDados} disabled={throwsLeft === 0}>
                    Tirar Dados ({throwsLeft})
                </button>
                <button onClick={terminarTurno} style={{ marginLeft: 10 }}>
                    Terminar Turno
                </button>
            </div>
        </div>
    )
}

export default DiceRoller
