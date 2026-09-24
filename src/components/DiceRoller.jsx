import React, { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import "./DiceRoller.css"

const DieFace = ({ value }) => (
    <div className={`die-face die-${value}`}>
        {[...Array(9)].map((_, i) => (
            <span key={i} className={`dot dot-${i + 1}`} />
        ))}
    </div>
)

const DiceRoller = ({
    dice,
    heldDice,
    throwsLeft,
    tirarDados,
    toggleHold,
    resetDados,
    rollCount,
    isMyTurn,
    myRole,
    currentTurn,
    onEndTurn,
    playerName,
}) => {
    const [isShaking, setIsShaking] = useState(false)
    const [rollingDice, setRollingDice] = useState(dice.map(() => false))
    const shakeAudioRef = useRef(null)
    const rollAudioRef = useRef(null)
    const diceRotateRef = useRef(dice.map(() => 0))

    useEffect(() => {
        if (!isMyTurn && rollCount > 0) {
            setRollingDice(dice.map((_, i) => !heldDice[i]))
        }
    }, [rollCount])

    const startShakeSound = () => {
        if (!isMyTurn) return
        setIsShaking(true)
        if (shakeAudioRef.current) {
            shakeAudioRef.current.currentTime = 0
            shakeAudioRef.current.loop = true
            shakeAudioRef.current.play().catch(() => {})
        }
    }

    const stopShakeSound = () => {
        setIsShaking(false)
        if (shakeAudioRef.current) {
            shakeAudioRef.current.pause()
            shakeAudioRef.current.currentTime = 0
        }
    }

    const playRollSound = () => {
        if (rollAudioRef.current) {
            rollAudioRef.current.currentTime = 0
            rollAudioRef.current.play().catch(() => {})
        }
    }

    const handleMouseUp = () => {
        stopShakeSound()
        if (!isMyTurn) return
        playRollSound()
        setRollingDice(dice.map((_, i) => !heldDice[i]))
        tirarDados()
    }

    const turnLabel = isMyTurn
        ? `🎲 Tu turno, ${playerName || "jugador"}`
        : `⏳ Turno del oponente`

    const turnColor = isMyTurn ? "#ffce00" : "#aaaaaa"

    return (
        <div className="dice-roller">

            {/* Indicador de turno */}
            <div style={{
                margin: "0.5rem 0",
                padding: "6px 16px",
                borderRadius: 8,
                background: isMyTurn ? "rgba(255,206,0,0.15)" : "rgba(100,100,100,0.15)",
                border: `2px solid ${turnColor}`,
                color: turnColor,
                fontFamily: "Germania One, serif",
                fontSize: "1rem",
                textAlign: "center",
                letterSpacing: 1,
            }}>
                {myRole ? turnLabel : "Conectando..."}
            </div>

            <div className="dice-container">
                {dice.map((num, idx) => (
                    <motion.div
                        layout
                        key={`dice-${idx}`}
                        className={heldDice[idx] ? "die held" : "die"}
                        onClick={() => toggleHold(idx)}
                        title={
                            !isMyTurn
                                ? "No es tu turno"
                                : heldDice[idx]
                                ? "Dado retenido - Click para soltar"
                                : "Click para retener dado"
                        }
                        style={{ opacity: !isMyTurn && !heldDice[idx] ? 0.7 : 1 }}
                        initial={false}
                        animate={(() => {
                            if (!heldDice[idx]) {
                                diceRotateRef.current[idx] = rollCount * 360
                            }
                            const r = diceRotateRef.current[idx]
                            if (heldDice[idx]) return { scale: 1, rotate: r, opacity: 1 }
                            if (isShaking) return { scale: 1, rotate: r + 3600, opacity: 0.3, filter: "brightness(2)" }
                            return { scale: 1, rotate: r, opacity: 1 }
                        })()}
                        onAnimationComplete={() => {
                            setRollingDice(prev => {
                                const next = [...prev]
                                next[idx] = false
                                return next
                            })
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 500,
                            damping:50,
                            delay: idx * 0.1,
                            duration: 0.1,
                             
                           
                        }}
                    >
                        <DieFace value={rollingDice[idx] ? 0 : num} />
                    </motion.div>
                ))}
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                <audio ref={shakeAudioRef} preload="auto">
                    <source src="sounds/shake.mp3" type="audio/mpeg" />
                </audio>
                <audio ref={rollAudioRef} preload="auto">
                    <source src="sounds/roll.mp3" type="audio/mpeg" />
                </audio>

                <motion.button
                    whileTap={{ scale: 0.8 }}
                    onMouseDown={startShakeSound}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={stopShakeSound}
                    disabled={throwsLeft === 0 || !isMyTurn}
                >
                    Tirar Dados ({throwsLeft})
                </motion.button>

                <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={resetDados}
                    disabled={!isMyTurn}
                >
                    Reset Dados
                </motion.button>

                <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={onEndTurn}
                    disabled={!isMyTurn}
                    style={{ background: isMyTurn ? "#228b22" : undefined }}
                >
                    ✅ Terminar Turno
                </motion.button>
            </div>
        </div>
    )
}

export default DiceRoller
