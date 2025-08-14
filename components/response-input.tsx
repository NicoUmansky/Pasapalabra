"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Volume2 } from "lucide-react"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"
import { useSettings } from "@/hooks/use-settings"
import type { Question } from "@/lib/game-types"

interface ResponseInputProps {
  question: Question
  onAnswer: (isCorrect: boolean) => void
  onPassapalabra: () => void
  disabled?: boolean
  showAnswer?: boolean
  onPause?: () => void // Agregado callback para pausar el juego
}

export function ResponseInput({
  question,
  onAnswer,
  onPassapalabra,
  disabled,
  showAnswer,
  onPause,
}: ResponseInputProps) {
  const { settings } = useSettings()
  const [inputValue, setInputValue] = useState("")
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false)
  const [lastResult, setLastResult] = useState<"correct" | "incorrect" | null>(null)
  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false)
  const [isPaused, setIsPaused] = useState(false) // Estado para pausar cuando hay respuesta incorrecta
  const [incorrectWord, setIncorrectWord] = useState<string>("") // Para mostrar palabra incorrecta en rojo

  const {
    isListening,
    isSupported: speechSupported,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({
    language: settings.voiceLanguage || "es-ES",
    continuous: false,
    interimResults: true,
    onResult: (result) => {
      console.log("Speech result:", result)
      if (result.isFinal && result.transcript.trim()) {
        const normalizedTranscript = result.transcript.toLowerCase().trim()
        if (
          normalizedTranscript.includes("pasapalabra") ||
          normalizedTranscript.includes("pasa palabra") ||
          normalizedTranscript.includes("paso") ||
          normalizedTranscript.includes("siguiente")
        ) {
          onPassapalabra()
          return
        }

        setInputValue(result.transcript.trim())
        handleSubmit(result.transcript.trim())
      }
    },
    onError: (error) => {
      console.error("Speech recognition error:", error)
    },
  })

  useEffect(() => {
    if (transcript && isListening) {
      setInputValue(transcript)
    }
  }, [transcript, isListening])

  useEffect(() => {
    setInputValue("")
    setShowCorrectAnswer(false)
    setLastResult(null) // Limpiar el cartel de correcto/incorrecto
    setIsProcessingAnswer(false)
    setIsPaused(false)
    setIncorrectWord("") // Limpiar palabra incorrecta
    resetTranscript()
    if (isListening) {
      stopListening()
    }
  }, [question.id, resetTranscript, stopListening, isListening])

  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^\w\s]/g, "") // Remove punctuation
      .replace(/\s+/g, " ") // Normalize spaces
      .trim()
  }

  const checkAnswer = (userAnswer: string) => {
    const normalizedUser = normalizeText(userAnswer)
    const normalizedCorrect = normalizeText(question.answer)

    console.log("Checking answer:", { userAnswer, normalizedUser, normalizedCorrect })

    // Check exact match
    if (normalizedUser === normalizedCorrect) {
      return true
    }

    // Check if user answer contains the correct answer or vice versa (for partial matches)
    const userWords = normalizedUser.split(" ")
    const correctWords = normalizedCorrect.split(" ")

    // Check if all words from correct answer are in user answer
    const allWordsMatch = correctWords.every((word) =>
      userWords.some((userWord) => userWord.includes(word) || word.includes(userWord)),
    )

    return allWordsMatch
  }

  const handleSubmit = async (answer?: string) => {
    const finalAnswer = answer || inputValue
    if (!finalAnswer.trim() || isProcessingAnswer) return

    setIsProcessingAnswer(true)

    if (isListening) {
      stopListening()
    }

    const isCorrect = checkAnswer(finalAnswer)
    setLastResult(isCorrect ? "correct" : "incorrect")

    if (!isCorrect) {
      setIncorrectWord(finalAnswer.trim())
    }

    setTimeout(() => {
      setInputValue("")
    }, 300)

    if (!isCorrect) {
      setShowCorrectAnswer(true)
      setIsPaused(true)
      if (onPause) {
        onPause()
      }
    } else {
      setTimeout(() => {
        setLastResult(null) // Limpiar cartel de correcto
        onAnswer(true)
        setIsProcessingAnswer(false)
      }, 1200)
    }
  }

  const handleContinue = () => {
    setShowCorrectAnswer(false)
    setLastResult(null) // Limpiar cartel al continuar
    setIsPaused(false)
    setIsProcessingAnswer(false)
    setIncorrectWord("") // Limpiar palabra incorrecta
    onAnswer(false)
  }

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      resetTranscript()
      startListening()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isListening && !isProcessingAnswer) {
      setInputValue(e.target.value)
    }
  }

  if (settings.responseMode === "visible" || showAnswer) {
    return (
      <Card className="w-full max-w-sm sm:max-w-md mx-auto">
        <CardContent className="p-3 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            <div className="text-center">
              <p className="text-sm sm:text-base lg:text-lg font-medium mb-3 sm:mb-4 leading-tight">
                {question.question}
              </p>
              <div className="p-2 sm:p-3 lg:p-4 bg-muted rounded-lg">
                <p className="text-base sm:text-lg lg:text-xl font-bold text-primary">{question.answer}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 justify-center">
              <Button
                onClick={() => onAnswer(true)}
                className="bg-green-500 hover:bg-green-600 text-xs sm:text-sm lg:text-base py-2 sm:py-3"
              >
                Correcto
              </Button>
              <Button
                onClick={() => onAnswer(false)}
                variant="destructive"
                className="text-xs sm:text-sm lg:text-base py-2 sm:py-3"
              >
                Incorrecto
              </Button>
              <Button
                onClick={onPassapalabra}
                variant="outline"
                className="text-xs sm:text-sm lg:text-base py-2 sm:py-3 bg-transparent"
              >
                Pasapalabra
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-sm sm:max-w-md mx-auto">
      <CardContent className="p-3 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          <div className="text-center">
            <p className="text-sm sm:text-base lg:text-lg font-medium mb-3 sm:mb-4 leading-tight">
              {question.question}
            </p>
          </div>

          {showCorrectAnswer && (
            <div className="p-2 sm:p-3 lg:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 mb-2">Respuesta incorrecta.</p>
              {incorrectWord && (
                <p className="text-sm font-medium mb-2">
                  Tu respuesta: <span className="text-red-600 font-bold">{incorrectWord}</span>
                </p>
              )}
              <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 mb-2">La respuesta correcta es:</p>
              <p className="text-sm sm:text-base lg:text-lg font-bold text-red-700 dark:text-red-300 mb-3">
                {question.answer}
              </p>
              <Button onClick={handleContinue} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                CONTINUAR
              </Button>
            </div>
          )}

          {lastResult && !showCorrectAnswer && (
            <div
              className={`p-2 sm:p-3 rounded-lg text-center ${
                lastResult === "correct"
                  ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
              }`}
            >
              <Badge variant={lastResult === "correct" ? "default" : "destructive"} className="text-xs sm:text-sm">
                {lastResult === "correct" ? "¡Correcto!" : "Incorrecto"}
              </Badge>
            </div>
          )}

          {!isPaused && (
            <div className="space-y-2 sm:space-y-3">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Escribe tu respuesta..."
                  disabled={disabled || isProcessingAnswer}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isProcessingAnswer) {
                      handleSubmit()
                    }
                  }}
                  className="flex-1 text-xs sm:text-sm lg:text-base py-2 sm:py-3 min-w-0"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                />

                {speechSupported && (
                  <Button
                    onClick={handleVoiceToggle}
                    variant={isListening ? "destructive" : "outline"}
                    size="icon"
                    disabled={disabled || isProcessingAnswer}
                    className="shrink-0 h-9 w-9 sm:h-10 sm:w-10"
                  >
                    {isListening ? (
                      <MicOff className="h-3 w-3 sm:h-4 sm:w-4" />
                    ) : (
                      <Mic className="h-3 w-3 sm:h-4 sm:w-4" />
                    )}
                  </Button>
                )}
              </div>

              {isListening && (
                <div className="text-center">
                  <Badge variant="outline" className="animate-pulse text-xs sm:text-sm">
                    <Volume2 className="h-3 w-3 mr-1" />
                    Escuchando... (Di "Pasapalabra" para saltar)
                  </Badge>
                </div>
              )}

              <div className="flex flex-col gap-2 justify-center">
                <Button
                  onClick={() => handleSubmit()}
                  disabled={!inputValue.trim() || disabled || isProcessingAnswer}
                  className="bg-blue-500 hover:bg-blue-600 text-xs sm:text-sm lg:text-base py-2 sm:py-3"
                >
                  Responder
                </Button>
                <Button
                  onClick={onPassapalabra}
                  variant="outline"
                  disabled={disabled || isProcessingAnswer}
                  className="text-xs sm:text-sm lg:text-base py-2 sm:py-3 bg-transparent"
                >
                  Pasapalabra
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
