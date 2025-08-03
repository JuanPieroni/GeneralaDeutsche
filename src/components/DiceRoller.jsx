import React from "react"
import { motion } from "framer-motion"
import "./DiceRoller.css"

const DieFace = ({ value }) => {
    return (
        <div className={`die-face die-${value}`}>
            {[...Array(9)].map((_, i) => (
                <span key={i} className={`dot dot-${i + 1}`} />
            ))}
        </div>
    )
}

const DiceRoller = ({
    dice,
    heldDice,
    throwsLeft,
    turnoActual,
    tirarDados,
    toggleHold,
    terminarTurno,
    rollCount, // <-- recibe el contador de tiradas
}) => {
    return (
        <div className="dice-roller">
            <h3>
                Tirar dados - Turno de:{" "}
                {turnoActual === "jugador1" ? "Jugador 1 (Admin)" : "Jugador 2"}
            </h3>
            <div className="dice-container">
                {dice.map((num, idx) => {
                    // Para dados retenidos, key fija para que no se reanime
                    if (heldDice[idx]) {
                        return (
                            <motion.div
                                layout
                                key={`held-${idx}`}
                                className={`die held`}
                                onClick={() => toggleHold(idx)}
                                title="Dado retenido - Click para soltar"
                                initial={false}
                                animate={false}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 15,
                                    delay: idx * 0.5,
                                    duration: 0.4,
                                }}
                            >
                                <DieFace value={num} />
                            </motion.div>
                        )
                    } else {
                        // Para dados libres, key cambia con rollCount para forzar animación
                        return (
                            <motion.div
                                layout
                                key={`dice-${idx}-${rollCount}`}
                                className="die"
                                onClick={() => toggleHold(idx)}
                                title="Click para retener dado"
                                initial={{
                                    scale: 0.5,
                                    rotate: -180,
                                    opacity: 0,
                                }}
                                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 15,
                                    delay: idx * 0.5,
                                    duration: 0.4,
                                }}
                            >
                                <DieFace value={num} />
                            </motion.div>
                        )
                    }
                })}
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
