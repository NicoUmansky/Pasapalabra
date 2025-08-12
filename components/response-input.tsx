"use client"

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
}

export function ResponseInput({ question, onAnswer, onPassapalabra, disabled }: ResponseInputProps) {
  const { settings } = useSettings()
  const [inputValue, setInputValue] = useState("")
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false)
  const [lastResult, setLastResult] = useState<"correct" | "incorrect" | null>(null)

  const {
    isListening,
    isSupported: speechSupported,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({
    language: settings.voiceLanguage,
    continuous: false,
    interimResults: true,
    onResult: (result) => {
      if (result.isFinal && result.confidence > settings.voiceSensitivity) {
        handleSubmit(result.transcript.trim())
      }
    },
    onError: (error) => {
      console.error("Speech recognition error:", error)
    },
  })

  useEffect(() => {
    if (transcript && (settings.responseMode === "voice" || settings.responseMode === "text")) {
      setInputValue(transcript)
    }
  }, [transcript, settings.responseMode])

  useEffect(() => {
    // Reset state when question changes
    setInputValue("")
    setShowCorrectAnswer(false)
    setLastResult(null)
    resetTranscript()
  }, [question, resetTranscript])

  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^\w\s]/g, "") // Remove punctuation
      .trim()
  }

  const checkAnswer = (userAnswer: string) => {
    const normalizedUser = normalizeText(userAnswer)
    const normalizedCorrect = normalizeText(question.answer)

    // Check exact match
    if (normalizedUser === normalizedCorrect) {
      return true
    }

    // Check if user answer contains the correct answer or vice versa
    const similarity = normalizedUser.includes(normalizedCorrect) || normalizedCorrect.includes(normalizedUser)

    return similarity
  }

  const handleSubmit = (answer?: string) => {
    const finalAnswer = answer || inputValue
    if (!finalAnswer.trim()) return

    const isCorrect = checkAnswer(finalAnswer)
    setLastResult(isCorrect ? "correct" : "incorrect")

    if (!isCorrect && settings.showCorrectAnswer) {
      setShowCorrectAnswer(true)
      // Auto-advance after showing correct answer
      setTimeout(() => {
        onAnswer(false)
      }, 3000)
    } else {
      onAnswer(isCorrect)
    }
  }

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  if (settings.responseMode === "visible") {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-base sm:text-lg font-medium mb-4">{question.question}</p>
              <div className="p-3 sm:p-4 bg-muted rounded-lg">
                <p className="text-lg sm:text-xl font-bold text-primary">{question.answer}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button onClick={() => onAnswer(true)} className="bg-green-500 hover:bg-green-600 text-sm sm:text-base">
                Correcto
              </Button>
              <Button onClick={() => onAnswer(false)} variant="destructive" className="text-sm sm:text-base">
                Incorrecto
              </Button>
              <Button onClick={onPassapalabra} variant="outline" className="text-sm sm:text-base bg-transparent">
                Pasapalabra
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-base sm:text-lg font-medium mb-4">{question.question}</p>
          </div>

          {showCorrectAnswer && (
            <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 mb-2">
                Respuesta incorrecta. La respuesta correcta es:
              </p>
              <p className="text-base sm:text-lg font-bold text-red-700 dark:text-red-300">{question.answer}</p>
            </div>
          )}

          {lastResult && !showCorrectAnswer && (
            <div
              className={`p-3 rounded-lg text-center ${
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

          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Escribe tu respuesta..."
                disabled={disabled || showCorrectAnswer}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !disabled && !showCorrectAnswer) {
                    handleSubmit()
                  }
                }}
                className="flex-1 text-sm sm:text-base"
              />

              {speechSupported && (
                <Button
                  onClick={handleVoiceToggle}
                  variant={isListening ? "destructive" : "outline"}
                  size="icon"
                  disabled={disabled || showCorrectAnswer}
                  className="shrink-0"
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              )}
            </div>

            {isListening && (
              <div className="text-center">
                <Badge variant="outline" className="animate-pulse text-xs sm:text-sm">
                  <Volume2 className="h-3 w-3 mr-1" />
                  Escuchando...
                </Badge>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                onClick={() => handleSubmit()}
                disabled={!inputValue.trim() || disabled || showCorrectAnswer}
                className="bg-blue-500 hover:bg-blue-600 text-sm sm:text-base"
              >
                Responder
              </Button>
              <Button
                onClick={onPassapalabra}
                variant="outline"
                disabled={disabled || showCorrectAnswer}
                className="text-sm sm:text-base bg-transparent"
              >
                Pasapalabra
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
