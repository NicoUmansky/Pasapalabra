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

  const [skippedQuestions, setSkippedQuestions] = useState<Map<string, { question: string; answer: string }>>(new Map())

  const [isProcessingResponse, setIsProcessingResponse] = useState(false)
  const [isPausedForIncorrect, setIsPausedForIncorrect] = useState(false)

  const findNextPendingLetter = useCallback((letters: LetterState[], currentLetter: string): string | null => {
    const currentIndex = letters.findIndex((l) => l.letter === currentLetter)

    // First, look for pending letters from current position forward
    for (let i = currentIndex + 1; i < letters.length; i++) {
      if (letters[i].status === "pending") {
        return letters[i].letter
      }
    }

    // Then look from beginning to current position
    for (let i = 0; i < currentIndex; i++) {
      if (letters[i].status === "pending") {
        return letters[i].letter
      }
    }

    // If no pending letters, check for skipped letters (second round)
    for (let i = currentIndex + 1; i < letters.length; i++) {
      if (letters[i].status === "skipped") {
        return letters[i].letter
      }
    }

    for (let i = 0; i < currentIndex; i++) {
      if (letters[i].status === "skipped") {
        return letters[i].letter
      }
    }

    return null
  }, [])

  const loadQuestion = useCallback(
    (letter: string, difficulty: string) => {
      // Si hay una pregunta saltada para esta letra, usarla
      const skippedQuestion = skippedQuestions.get(letter)
      if (skippedQuestion) {
        setCurrentQuestion({
          question: skippedQuestion.question,
          answer: skippedQuestion.answer,
          letter: letter,
        })
        return skippedQuestion
      }

      // Si no hay pregunta saltada, cargar una nueva
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
    },
    [skippedQuestions],
  )

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
    setSkippedQuestions(new Map())
    loadQuestion("A", gameState.settings.difficulty)
  }, [gameState.settings.difficulty, loadQuestion])

  const handleResponse = useCallback(
    (response: "correct" | "incorrect" | "skip") => {
      if (!currentQuestion || !gameState.isPlaying || isProcessingResponse) return

      setIsProcessingResponse(true)
      const currentLetter = gameState.currentLetter

      if (response === "skip") {
        setSkippedQuestions(
          (prev) =>
            new Map(
              prev.set(currentLetter, {
                question: currentQuestion.question,
                answer: currentQuestion.answer,
              }),
            ),
        )
      } else {
        // Remove from skipped questions if answered
        setSkippedQuestions((prev) => {
          const newMap = new Map(prev)
          newMap.delete(currentLetter)
          return newMap
        })
      }

      // Add to history
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

        const nextLetter = findNextPendingLetter(updatedLetters, currentLetter)

        return {
          ...prev,
          letters: updatedLetters,
          score: newScore,
          currentLetter: nextLetter || currentLetter,
        }
      })

      if (response === "incorrect") {
        setIsPausedForIncorrect(true)
        setIsProcessingResponse(false)
        return
      }

      setTimeout(() => {
        setGameState((prevState) => {
          const updatedLetters = prevState.letters.map((l) =>
            l.letter === currentLetter
              ? {
                  ...l,
                  status: response === "skip" ? "skipped" : response === "correct" ? "correct" : "incorrect",
                }
              : l,
          )

          const nextLetter = findNextPendingLetter(updatedLetters, currentLetter)

          if (nextLetter) {
            // Continue with next pending letter
            loadQuestion(nextLetter, prevState.settings.difficulty)
            return {
              ...prevState,
              currentLetter: nextLetter,
              letters: updatedLetters,
            }
          } else {
            // Check if there are any skipped letters for second round
            const hasSkippedLetters = updatedLetters.some((l) => l.status === "skipped")

            if (hasSkippedLetters) {
              // Find first skipped letter and convert it to pending
              const firstSkippedLetter = updatedLetters.find((l) => l.status === "skipped")
              if (firstSkippedLetter) {
                const newLetters = updatedLetters.map((l) =>
                  l.letter === firstSkippedLetter.letter ? { ...l, status: "pending" as const } : l,
                )

                loadQuestion(firstSkippedLetter.letter, prevState.settings.difficulty)
                return {
                  ...prevState,
                  currentLetter: firstSkippedLetter.letter,
                  letters: newLetters,
                }
              }
            }

            // No more letters, end game
            setGameState((prev) => ({ ...prev, isPlaying: false, isPaused: false }))
            setCurrentQuestion(null)
            setIsPausedForIncorrect(false)
            return prevState
          }
        })

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
    setIsPausedForIncorrect(false)
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
    setSkippedQuestions(new Map())
    setIsPausedForIncorrect(false)
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
  }, [gameState.isPlaying, gameState.isPaused, isPausedForIncorrect, gameState.timeRemaining])

  const pauseForIncorrect = useCallback(() => {
    setIsPausedForIncorrect(true)
  }, [])

  const resumeFromIncorrect = useCallback(() => {
    setIsPausedForIncorrect(false)

    // Continuar con la siguiente pregunta
    const currentLetter = gameState.currentLetter
    const nextLetter = findNextPendingLetter(gameState.letters, currentLetter)

    if (nextLetter) {
      setGameState((prev) => ({ ...prev, currentLetter: nextLetter }))
      loadQuestion(nextLetter, gameState.settings.difficulty)
    } else {
      // Verificar si quedan letras saltadas
      const skippedLetters = gameState.letters.filter((l) => l.status === "skipped")
      if (skippedLetters.length > 0) {
        const firstSkipped = skippedLetters[0]
        setGameState((prev) => ({
          ...prev,
          currentLetter: firstSkipped.letter,
          letters: prev.letters.map((l) => (l.letter === firstSkipped.letter ? { ...l, status: "pending" } : l)),
        }))
        loadQuestion(firstSkipped.letter, gameState.settings.difficulty)
      } else {
        endGame()
      }
    }
  }, [gameState, findNextPendingLetter, loadQuestion])

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
    pauseForIncorrect,
    resumeFromIncorrect,
    isPausedForIncorrect, // Exportar estado de pausa por respuesta incorrecta
  }
}
