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
  const [playerTimers, setPlayerTimers] = useState<Record<string, number>>({})
  const [playerCurrentLetters, setPlayerCurrentLetters] = useState<Record<string, string>>({})

  const initializePlayers = useCallback(
    (playerCount: number, playerNames?: string[]) => {
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

      const letters: Record<string, LetterState[]> = {}
      const timers: Record<string, number> = {}
      const currentLetters: Record<string, string> = {}

      players.forEach((player) => {
        letters[player.id] = getAllLetters().map((letter) => ({
          letter,
          status: "pending",
        }))
        timers[player.id] = gameState.settings.duration
        currentLetters[player.id] = "A"
      })

      setGameState((prev) => ({
        ...prev,
        players,
        currentPlayerIndex: 0,
      }))

      setPlayerLetters(letters)
      setPlayerTimers(timers)
      setPlayerCurrentLetters(currentLetters)
      return { players, letters }
    },
    [gameState.settings.duration],
  )

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

    for (let i = currentIndex + 1; i < letters.length; i++) {
      if (letters[i].status === "pending") {
        return letters[i].letter
      }
    }

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

      return {
        ...prev,
        currentPlayerIndex: nextPlayerIndex,
        players: updatedPlayers,
      }
    })

    setTimeout(() => {
      const nextPlayer = gameState.players[(gameState.currentPlayerIndex + 1) % gameState.players.length]
      if (nextPlayer) {
        const nextPlayerCurrentLetter = playerCurrentLetters[nextPlayer.id] || "A"
        setGameState((prev) => ({ ...prev, currentLetter: nextPlayerCurrentLetter }))
        loadQuestionForPlayer(nextPlayer.id, nextPlayerCurrentLetter, gameState.settings.difficulty)
      }
    }, 1000)
  }, [
    gameState.players,
    gameState.currentPlayerIndex,
    playerCurrentLetters,
    loadQuestionForPlayer,
    gameState.settings.difficulty,
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
        timeRemaining: prev.settings.duration,
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

      if (players.length > 0) {
        loadQuestionForPlayer(players[0].id, "A", gameState.settings.difficulty)
      }
    },
    [gameState.settings.playerCount, gameState.settings.difficulty, initializePlayers, loadQuestionForPlayer],
  )

  const handleResponse = useCallback(
    (response: "correct" | "incorrect" | "skip") => {
      if (!currentQuestion || !gameState.isPlaying) return

      const currentPlayer = getCurrentPlayer()
      if (!currentPlayer) return

      const currentLetter = playerCurrentLetters[currentPlayer.id] || gameState.currentLetter

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
        }, 1500)
        return
      }

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
          setPlayerCurrentLetters((prev) => ({
            ...prev,
            [currentPlayer.id]: nextLetter,
          }))
          setGameState((prev) => ({ ...prev, currentLetter: nextLetter }))
          loadQuestionForPlayer(currentPlayer.id, nextLetter, gameState.settings.difficulty)
        } else {
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
      playerCurrentLetters,
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
    setPlayerTimers({})
    setPlayerCurrentLetters({})
  }, [getTimePerPlayer])

  const updateSettings = useCallback((newSettings: GameSettings) => {
    setGameState((prev) => ({
      ...prev,
      settings: newSettings,
      timeRemaining: Math.floor(newSettings.duration / (newSettings.playerCount || 2)),
    }))
  }, [])

  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused) {
      const currentPlayer = getCurrentPlayer()
      if (currentPlayer && playerTimers[currentPlayer.id] > 0) {
        const timer = setInterval(() => {
          setPlayerTimers((prev) => {
            const newTime = prev[currentPlayer.id] - 1
            if (newTime <= 0) {
              setTimeout(() => switchToNextPlayer(), 100)
              return { ...prev, [currentPlayer.id]: 0 }
            }
            return { ...prev, [currentPlayer.id]: newTime }
          })
        }, 1000)

        return () => clearInterval(timer)
      }
    }
  }, [
    gameState.isPlaying,
    gameState.isPaused,
    gameState.currentPlayerIndex,
    playerTimers,
    getCurrentPlayer,
    switchToNextPlayer,
  ])

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
    playerTimers,
    playerCurrentLetters,
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
