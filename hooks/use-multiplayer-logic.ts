"use client"

import { useState, useEffect, useCallback } from "react"
import type { MultiplayerGame, Player, LetterState, GameSettings } from "@/lib/game-types"
import { getAllLetters, getRandomQuestion } from "@/lib/questions-data"

export function useMultiplayerLogic() {
  const [gameState, setGameState] = useState<MultiplayerGame>({
    currentLetter: "A",
    timeRemaining: 150,
    isPlaying: false,
    isPaused: false,
    letters: getAllLetters().map((letter) => ({
      letter,
      status: "pending",
    })),
    score: {
      correct: 0,
      incorrect: 0,
      skipped: 0,
      remaining: 26,
    },
    settings: {
      duration: 150,
      difficulty: "medio",
      mode: "multijugador",
      playerCount: 2,
    },
    players: [],
    currentPlayerIndex: 0,
    roundsCompleted: 0,
  })

  const [currentQuestion, setCurrentQuestion] = useState<{
    question: string
    answer: string
    letter: string
    playerId: string
  } | null>(null)

  const [playerLetters, setPlayerLetters] = useState<Record<string, LetterState[]>>({})

  const initializePlayers = useCallback((playerCount: number, playerNames?: string[]) => {
    const players: Player[] = Array.from({ length: playerCount }, (_, index) => ({
      id: `player-${index + 1}`,
      name: playerNames?.[index] || `Jugador ${index + 1}`,
      score: {
        correct: 0,
        incorrect: 0,
        skipped: 0,
      },
      isActive: index === 0,
    }))

    // Crear letras individuales para cada jugador
    const letters: Record<string, LetterState[]> = {}
    players.forEach((player) => {
      letters[player.id] = getAllLetters().map((letter) => ({
        letter,
        status: "pending",
      }))
    })

    setGameState((prev) => ({
      ...prev,
      players,
      currentPlayerIndex: 0,
    }))

    setPlayerLetters(letters)
    return { players, letters }
  }, [])

  const getCurrentPlayer = useCallback(() => {
    return gameState.players[gameState.currentPlayerIndex]
  }, [gameState.players, gameState.currentPlayerIndex])

  const getTimePerPlayer = useCallback(() => {
    const totalTime = gameState.settings.duration
    const playerCount = gameState.settings.playerCount || 2
    return Math.floor(totalTime / playerCount)
  }, [gameState.settings.duration, gameState.settings.playerCount])

  const findNextPendingLetter = useCallback((letters: LetterState[], currentLetter: string): string | null => {
    const currentIndex = letters.findIndex((l) => l.letter === currentLetter)

    // Buscar desde la letra actual hacia adelante
    for (let i = currentIndex + 1; i < letters.length; i++) {
      if (letters[i].status === "pending") {
        return letters[i].letter
      }
    }

    // Si no encuentra, buscar desde el principio hasta la letra actual
    for (let i = 0; i < currentIndex; i++) {
      if (letters[i].status === "pending") {
        return letters[i].letter
      }
    }

    return null
  }, [])

  const loadQuestionForPlayer = useCallback((playerId: string, letter: string, difficulty: string) => {
    const questionData = getRandomQuestion(letter, difficulty)
    if (questionData) {
      setCurrentQuestion({
        question: questionData.question,
        answer: questionData.answer,
        letter: letter,
        playerId: playerId,
      })
      return questionData
    }
    return null
  }, [])

  const switchToNextPlayer = useCallback(() => {
    setGameState((prev) => {
      const nextPlayerIndex = (prev.currentPlayerIndex + 1) % prev.players.length
      const updatedPlayers = prev.players.map((player, index) => ({
        ...player,
        isActive: index === nextPlayerIndex,
      }))

      const isNewRound = nextPlayerIndex === 0
      const newRoundsCompleted = isNewRound ? prev.roundsCompleted + 1 : prev.roundsCompleted

      return {
        ...prev,
        currentPlayerIndex: nextPlayerIndex,
        players: updatedPlayers,
        roundsCompleted: newRoundsCompleted,
        timeRemaining: getTimePerPlayer(), // Reset time for new player
      }
    })

    // Load question for next player
    setTimeout(() => {
      const nextPlayer = gameState.players[(gameState.currentPlayerIndex + 1) % gameState.players.length]
      if (nextPlayer) {
        const playerLettersForNext = playerLetters[nextPlayer.id] || []
        const nextLetter = findNextPendingLetter(playerLettersForNext, "A")
        if (nextLetter) {
          setGameState((prev) => ({ ...prev, currentLetter: nextLetter }))
          loadQuestionForPlayer(nextPlayer.id, nextLetter, gameState.settings.difficulty)
        }
      }
    }, 1000)
  }, [
    gameState.players,
    gameState.currentPlayerIndex,
    playerLetters,
    findNextPendingLetter,
    loadQuestionForPlayer,
    gameState.settings.difficulty,
    getTimePerPlayer,
  ])

  const startGame = useCallback(
    (playerNames?: string[]) => {
      const playerCount = gameState.settings.playerCount || 2
      const { players, letters } = initializePlayers(playerCount, playerNames)

      setGameState((prev) => ({
        ...prev,
        isPlaying: true,
        isPaused: false,
        currentLetter: "A",
        timeRemaining: getTimePerPlayer(),
        players,
        currentPlayerIndex: 0,
        roundsCompleted: 0,
        score: {
          correct: 0,
          incorrect: 0,
          skipped: 0,
          remaining: 26 * playerCount,
        },
      }))

      setPlayerLetters(letters)

      // Load first question for first player
      if (players.length > 0) {
        loadQuestionForPlayer(players[0].id, "A", gameState.settings.difficulty)
      }
    },
    [
      gameState.settings.playerCount,
      gameState.settings.difficulty,
      initializePlayers,
      getTimePerPlayer,
      loadQuestionForPlayer,
    ],
  )

  const handleResponse = useCallback(
    (response: "correct" | "incorrect" | "skip") => {
      if (!currentQuestion || !gameState.isPlaying) return

      const currentPlayer = getCurrentPlayer()
      if (!currentPlayer) return

      const currentLetter = gameState.currentLetter

      // Update player letters
      setPlayerLetters((prev) => ({
        ...prev,
        [currentPlayer.id]: prev[currentPlayer.id].map((l) =>
          l.letter === currentLetter
            ? {
                ...l,
                status: response === "skip" ? "skipped" : response === "correct" ? "correct" : "incorrect",
                question: currentQuestion.question,
                answer: currentQuestion.answer,
              }
            : l,
        ),
      }))

      // Update player score
      setGameState((prev) => ({
        ...prev,
        players: prev.players.map((player) =>
          player.id === currentPlayer.id
            ? {
                ...player,
                score: {
                  correct: player.score.correct + (response === "correct" ? 1 : 0),
                  incorrect: player.score.incorrect + (response === "incorrect" ? 1 : 0),
                  skipped: player.score.skipped + (response === "skip" ? 1 : 0),
                },
              }
            : player,
        ),
        score: {
          correct: prev.score.correct + (response === "correct" ? 1 : 0),
          incorrect: prev.score.incorrect + (response === "incorrect" ? 1 : 0),
          skipped: prev.score.skipped + (response === "skip" ? 1 : 0),
          remaining: Math.max(0, prev.score.remaining - (response !== "skip" ? 1 : 0)),
        },
      }))

      if (response === "skip" || response === "incorrect") {
        setTimeout(() => {
          switchToNextPlayer()
        }, 1500) // Dar tiempo para mostrar la respuesta correcta
        return
      }

      // Si la respuesta es correcta, continuar con la siguiente letra del mismo jugador
      setTimeout(() => {
        const currentPlayerLetters = playerLetters[currentPlayer.id] || []
        const updatedPlayerLetters = currentPlayerLetters.map((l) =>
          l.letter === currentLetter
            ? {
                ...l,
                status: "correct",
              }
            : l,
        )

        const nextLetter = findNextPendingLetter(updatedPlayerLetters, currentLetter)

        if (nextLetter) {
          // Continue with same player
          setGameState((prev) => ({ ...prev, currentLetter: nextLetter }))
          loadQuestionForPlayer(currentPlayer.id, nextLetter, gameState.settings.difficulty)
        } else {
          // Player finished all letters, switch to next player or end game
          const allPlayersFinished = gameState.players.every((player) => {
            const playerLettersForCheck = playerLetters[player.id] || []
            return playerLettersForCheck.every((l) => l.status !== "pending")
          })

          if (allPlayersFinished) {
            endGame()
          } else {
            switchToNextPlayer()
          }
        }
      }, 1000)
    },
    [
      currentQuestion,
      gameState,
      getCurrentPlayer,
      playerLetters,
      findNextPendingLetter,
      loadQuestionForPlayer,
      switchToNextPlayer,
    ],
  )

  const togglePause = useCallback(() => {
    setGameState((prev) => ({ ...prev, isPaused: !prev.isPaused }))
  }, [])

  const endGame = useCallback(() => {
    setGameState((prev) => ({ ...prev, isPlaying: false, isPaused: false }))
    setCurrentQuestion(null)
  }, [])

  const resetGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      currentLetter: "A",
      timeRemaining: getTimePerPlayer(),
      isPlaying: false,
      isPaused: false,
      players: [],
      currentPlayerIndex: 0,
      roundsCompleted: 0,
      score: {
        correct: 0,
        incorrect: 0,
        skipped: 0,
        remaining: 26 * (prev.settings.playerCount || 2),
      },
    }))
    setCurrentQuestion(null)
    setPlayerLetters({})
  }, [getTimePerPlayer])

  const updateSettings = useCallback((newSettings: GameSettings) => {
    setGameState((prev) => ({
      ...prev,
      settings: newSettings,
      timeRemaining: Math.floor(newSettings.duration / (newSettings.playerCount || 2)),
    }))
  }, [])

  // Timer effect
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused && gameState.timeRemaining > 0) {
      const timer = setInterval(() => {
        setGameState((prev) => {
          if (prev.timeRemaining <= 1) {
            // Time up for current player, switch to next
            setTimeout(() => switchToNextPlayer(), 100)
            return { ...prev, timeRemaining: 0 }
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 }
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [gameState.isPlaying, gameState.isPaused, gameState.timeRemaining, switchToNextPlayer])

  const getGameStats = useCallback(() => {
    const playerStats = gameState.players.map((player) => {
      const totalAnswered = player.score.correct + player.score.incorrect
      const accuracy = totalAnswered > 0 ? (player.score.correct / totalAnswered) * 100 : 0
      return {
        ...player,
        accuracy: Math.round(accuracy),
        totalAnswered,
      }
    })

    return {
      players: playerStats,
      roundsCompleted: gameState.roundsCompleted,
      currentPlayer: getCurrentPlayer(),
    }
  }, [gameState.players, gameState.roundsCompleted, getCurrentPlayer])

  return {
    gameState,
    currentQuestion,
    playerLetters,
    startGame,
    handleResponse,
    togglePause,
    endGame,
    resetGame,
    updateSettings,
    switchToNextPlayer,
    getCurrentPlayer,
    getGameStats,
  }
}
