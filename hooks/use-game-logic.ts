"use client"

import { useState, useEffect, useCallback } from "react"
import type { GameState, LetterState, GameSettings } from "@/lib/game-types"
import { getAllLetters, getRandomQuestion } from "@/lib/questions-data"

export function useGameLogic() {
  const [gameState, setGameState] = useState<GameState>({
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
      mode: "individual",
    },
  })

  const [currentQuestion, setCurrentQuestion] = useState<{
    question: string
    answer: string
    letter: string
  } | null>(null)

  const [gameHistory, setGameHistory] = useState<
    Array<{
      letter: string
      question: string
      answer: string
      userResponse: "correct" | "incorrect" | "skip"
      timestamp: number
    }>
  >([])

  const [isProcessingResponse, setIsProcessingResponse] = useState(false)
  const [isPausedForIncorrect, setIsPausedForIncorrect] = useState(false) // Estado específico para pausa por respuesta incorrecta

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

  const loadQuestion = useCallback((letter: string, difficulty: string) => {
    const questionData = getRandomQuestion(letter, difficulty)
    if (questionData) {
      setCurrentQuestion({
        question: questionData.question,
        answer: questionData.answer,
        letter: letter,
      })
      return questionData
    }
    return null
  }, [])

  const startGame = useCallback(() => {
    const newLetters = getAllLetters().map((letter) => ({
      letter,
      status: "pending" as const,
    }))

    setGameState((prev) => ({
      ...prev,
      isPlaying: true,
      isPaused: false,
      currentLetter: "A",
      timeRemaining: prev.settings.duration,
      letters: newLetters,
      score: {
        correct: 0,
        incorrect: 0,
        skipped: 0,
        remaining: 26,
      },
    }))

    setGameHistory([])
    loadQuestion("A", gameState.settings.difficulty)
  }, [gameState.settings.difficulty, loadQuestion])

  const handleResponse = useCallback(
    (response: "correct" | "incorrect" | "skip") => {
      if (!currentQuestion || !gameState.isPlaying || isProcessingResponse) return

      setIsProcessingResponse(true)

      const currentLetter = gameState.currentLetter

      // Agregar al historial
      setGameHistory((prev) => [
        ...prev,
        {
          letter: currentLetter,
          question: currentQuestion.question,
          answer: currentQuestion.answer,
          userResponse: response,
          timestamp: Date.now(),
        },
      ])

      setGameState((prev) => {
        const updatedLetters = prev.letters.map((l) =>
          l.letter === currentLetter
            ? {
                ...l,
                status: response === "skip" ? "skipped" : response === "correct" ? "correct" : "incorrect",
                question: currentQuestion.question,
                answer: currentQuestion.answer,
                userAnswer: response === "skip" ? "PASAPALABRA" : currentQuestion.answer,
              }
            : l,
        )

        const newScore = {
          correct: prev.score.correct + (response === "correct" ? 1 : 0),
          incorrect: prev.score.incorrect + (response === "incorrect" ? 1 : 0),
          skipped: prev.score.skipped + (response === "skip" ? 1 : 0),
          remaining: Math.max(0, prev.score.remaining - (response !== "skip" ? 1 : 0)),
        }

        // Encontrar siguiente letra pendiente
        const nextLetter = findNextPendingLetter(updatedLetters, currentLetter)

        return {
          ...prev,
          letters: updatedLetters,
          score: newScore,
          currentLetter: nextLetter || currentLetter,
        }
      })

      // Cargar siguiente pregunta o terminar juego
      setTimeout(() => {
        const nextLetter = findNextPendingLetter(
          gameState.letters.map((l) =>
            l.letter === currentLetter
              ? {
                  ...l,
                  status: response === "skip" ? "skipped" : response === "correct" ? "correct" : "incorrect",
                }
              : l,
          ),
          currentLetter,
        )

        if (nextLetter) {
          loadQuestion(nextLetter, gameState.settings.difficulty)
        } else {
          // Verificar si quedan letras con "pasapalabra" para segunda vuelta
          const skippedLetters = gameState.letters.filter((l) => l.status === "skipped")
          if (skippedLetters.length > 0) {
            // Continuar con las letras saltadas
            const firstSkipped = skippedLetters[0]
            setGameState((prev) => ({
              ...prev,
              currentLetter: firstSkipped.letter,
              letters: prev.letters.map((l) => (l.letter === firstSkipped.letter ? { ...l, status: "pending" } : l)),
            }))
            loadQuestion(firstSkipped.letter, gameState.settings.difficulty)
          } else {
            // Fin del juego
            endGame()
          }
        }

        setIsProcessingResponse(false)
      }, 1000)
    },
    [currentQuestion, gameState, findNextPendingLetter, loadQuestion, isProcessingResponse],
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
      timeRemaining: prev.settings.duration,
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
    }))
    setCurrentQuestion(null)
    setGameHistory([])
  }, [])

  const updateSettings = useCallback((newSettings: GameSettings) => {
    setGameState((prev) => ({
      ...prev,
      settings: newSettings,
      timeRemaining: newSettings.duration,
    }))
  }, [])

  const jumpToLetter = useCallback(
    (letter: string) => {
      if (!gameState.isPlaying) return

      const letterState = gameState.letters.find((l) => l.letter === letter)
      if (letterState && letterState.status === "pending") {
        setGameState((prev) => ({ ...prev, currentLetter: letter }))
        loadQuestion(letter, gameState.settings.difficulty)
      }
    },
    [gameState.isPlaying, gameState.letters, gameState.settings.difficulty, loadQuestion],
  )

  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused && !isPausedForIncorrect && gameState.timeRemaining > 0) {
      const timer = setInterval(() => {
        setGameState((prev) => {
          if (prev.timeRemaining <= 1) {
            setTimeout(() => endGame(), 100)
            return { ...prev, timeRemaining: 0 }
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 }
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [gameState.isPlaying, gameState.isPaused, isPausedForIncorrect, gameState.timeRemaining, endGame])

  const pauseForIncorrect = useCallback(() => {
    setIsPausedForIncorrect(true)
  }, [])

  const resumeFromIncorrect = useCallback(() => {
    setIsPausedForIncorrect(false)
  }, [])

  const getGameStats = useCallback(() => {
    const totalAnswered = gameState.score.correct + gameState.score.incorrect
    const accuracy = totalAnswered > 0 ? (gameState.score.correct / totalAnswered) * 100 : 0
    const timeElapsed = gameState.settings.duration - gameState.timeRemaining

    return {
      accuracy: Math.round(accuracy),
      timeElapsed,
      totalAnswered,
      gameHistory,
    }
  }, [gameState.score, gameState.settings.duration, gameState.timeRemaining, gameHistory])

  return {
    gameState,
    currentQuestion,
    gameHistory,
    startGame,
    handleResponse,
    togglePause,
    endGame,
    resetGame,
    updateSettings,
    jumpToLetter,
    getGameStats,
    pauseForIncorrect, // Exportar nueva función
    resumeFromIncorrect, // Exportar nueva función
  }
}
