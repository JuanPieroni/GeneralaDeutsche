import React, { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import "./DiceRoller.css"
import { useSocket } from "./SocketContext"

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
    rollCount,
}) => {
    const socket = useSocket()
    const [playerRole, setPlayerRole] = useState(null)
    const [isShaking, setIsShaking] = useState(false)
    const shakeAudioRef = useRef(null)
    const rollAudioRef = useRef(null)

    useEffect(() => {
        if (!socket) return

        const handlePlayerAssigned = ({ role }) => {
            setPlayerRole(role)
        }

        const handleGameState = (gameState) => {
            // Buscar nuestro rol en los jugadores conectados
            const ourPlayer = Object.entries(gameState.players || {}).find(
                ([id]) => id === socket.id
            )
            if (ourPlayer) {
                setPlayerRole(ourPlayer[1].role)
            }
        }

        socket.on("player-assigned", handlePlayerAssigned)
        socket.on("game-state", handleGameState)

        return () => {
            socket.off("player-assigned", handlePlayerAssigned)
            socket.off("game-state", handleGameState)
        }
    }, [socket])

    const isMyTurn = playerRole === turnoActual

    console.log(
        "DiceRoller - playerRole:",
        playerRole,
        "turnoActual:",
        turnoActual,
        "isMyTurn:",
        isMyTurn
    )

    const startShakeSound = () => {
        setIsShaking(true)
        if (shakeAudioRef.current) {
            shakeAudioRef.current.currentTime = 0
            shakeAudioRef.current.loop = true
            shakeAudioRef.current.play()
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
            rollAudioRef.current.play()
        }
    }

    const handleMouseUp = () => {
        stopShakeSound()
        playRollSound()
        tirarDados()
    }
    return (
        <div className="dice-roller">
            <h3>
                Turno de:{" "}
                {turnoActual === "jugador1" ? "Jugador TOP" : "Jugador ¨BOTTOM"}
            </h3>
            <div className="dice-container">
                {dice.map((num, idx) => {
                    // Para dados retenidos, key fija para que no se reanime
                    return (
                        <motion.div
                            layout
                            key={heldDice[idx] ? `held-${idx}` : `dice-${idx}-${rollCount}`}
                            className={heldDice[idx] ? "die held" : "die"}
                            onClick={() => isMyTurn && toggleHold(idx)}
                            style={{
                                pointerEvents: isMyTurn ? "auto" : "none",
                                opacity: isMyTurn ? 1 : 0.5
                            }}
                            title={heldDice[idx] ? "Dado retenido - Click para soltar" : "Click para retener dado"}
                            initial={heldDice[idx] ? false : {
                                scale: 1.2,
                                rotate: -2800,
                                opacity: 0,
                            }}
                            animate={heldDice[idx] ? false : (isShaking ? {
                                scale: 1,
                                rotate: 3600,
                                opacity: 0.3,
                                filter: "brightness(2)"
                            } : { scale: 1, rotate: 0, opacity: 1 })}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: heldDice[idx] ? 15 : 10,
                                delay: heldDice[idx] ? idx * 0.5 : idx * 0.3,
                                duration: 0.4,
                            }}
                        >
                            <DieFace value={num} />
                        </motion.div>
                    )
                })}
            </div>
            <div>
                <audio ref={shakeAudioRef} preload="auto">
                    <source
                        src="/sounds/shake.mp3"
                        type="audio/mpeg"
                    />
                </audio>
                <audio ref={rollAudioRef} preload="auto">
                    <source
                        src="sounds/roll.mp3"
                        type="audio/mpeg"
                    />
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
                    onClick={terminarTurno}
                    style={{ marginLeft: 10 }}
                    disabled={!isMyTurn} 
                >
                    Terminar turno
                </motion.button>
 
            </div>
        </div>
    )
}

export default DiceRoller
