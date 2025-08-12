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
  showAnswer?: boolean // agregando prop para mostrar respuesta
}

export function ResponseInput({ question, onAnswer, onPassapalabra, disabled, showAnswer }: ResponseInputProps) {
  const { settings } = useSettings()
  const [inputValue, setInputValue] = useState("")
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false)
  const [lastResult, setLastResult] = useState<"correct" | "incorrect" | null>(null)
  const [voicePasapalabra, setVoicePasapalabra] = useState(false)

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
      
      // Si se detectó "pasapalabra", ejecutar esa acción
      if (result.isPasapalabra) {
        console.log("Pasapalabra detectado por voz")
        setVoicePasapalabra(true)
        setTimeout(() => {
          setVoicePasapalabra(false)
          onPassapalabra()
        }, 1000)
        return
      }
      
      if (result.isFinal && result.transcript.trim()) {
        setInputValue(result.transcript.trim())
        handleSubmit(result.transcript.trim())
      }
    },
    onError: (error) => {
      console.error("Speech recognition error:", error)
      
      // Mostrar error al usuario de manera amigable
      if (error.includes('Permiso de micrófono')) {
        alert("🔇 Error de micrófono: " + error + "\n\nPara solucionarlo:\n1. Toca el ícono del micrófono\n2. Permite el acceso al micrófono\n3. Recarga la página si es necesario")
      } else if (error.includes('No se detectó voz')) {
        // No mostrar alerta para este error, es muy común
        console.log("No se detectó voz, continuando...")
      } else {
        alert("⚠️ Error de reconocimiento de voz: " + error)
      }
    },
  })

  useEffect(() => {
    if (transcript) {
      setInputValue(transcript)
    }
  }, [transcript])

  // Efecto para limpiar cuando cambie la pregunta
  useEffect(() => {
    setInputValue("")
    setShowCorrectAnswer(false)
    setLastResult(null)
    resetTranscript()
    if (isListening) {
      stopListening()
    }
  }, [question.id, resetTranscript, isListening, stopListening])

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
    if (!finalAnswer.trim()) return

    if (isListening) {
      stopListening()
    }

    const isCorrect = checkAnswer(finalAnswer)
    setLastResult(isCorrect ? "correct" : "incorrect")

    if (!isCorrect && settings.showCorrectAnswer) {
      setShowCorrectAnswer(true)
      setTimeout(() => {
        onAnswer(false)
      }, 3000)
    } else {
      setTimeout(() => {
        onAnswer(isCorrect)
      }, 1000)
    }
  }

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      resetTranscript()
      setInputValue("")
      startListening()
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
              <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 mb-2">
                Respuesta incorrecta. La respuesta correcta es:
              </p>
              <p className="text-sm sm:text-base lg:text-lg font-bold text-red-700 dark:text-red-300">
                {question.answer}
              </p>
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

          <div className="space-y-2 sm:space-y-3">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Escribe tu respuesta..."
                disabled={disabled || showCorrectAnswer}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !showCorrectAnswer) {
                    handleSubmit()
                  }
                }}
                className="flex-1 text-xs sm:text-sm lg:text-base py-2 sm:py-3 min-w-0"
                style={{
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "normal",
                  minHeight: "auto",
                  resize: "none"
                }}
              />

              {speechSupported && (
                <Button
                  onClick={handleVoiceToggle}
                  variant={isListening ? "destructive" : "outline"}
                  size="icon"
                  disabled={disabled || showCorrectAnswer}
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
              <div className="text-center space-y-2">
                <Badge variant="outline" className="animate-pulse text-xs sm:text-sm">
                  <Volume2 className="h-3 w-3 mr-1" />
                  Escuchando...
                </Badge>
                <div className="text-xs text-gray-500">
                  💡 Di "pasapalabra" para saltar la pregunta
                </div>
              </div>
            )}

            {voicePasapalabra && (
              <div className="text-center">
                <Badge variant="default" className="bg-blue-500 animate-pulse text-xs sm:text-sm">
                  🎤 ¡Pasapalabra detectado por voz!
                </Badge>
              </div>
            )}

            <div className="flex flex-col gap-2 justify-center">
              <Button
                onClick={() => handleSubmit()}
                disabled={!inputValue.trim() || showCorrectAnswer || disabled}
                className="bg-blue-500 hover:bg-blue-600 text-xs sm:text-sm lg:text-base py-2 sm:py-3"
              >
                Responder
              </Button>
              <Button
                onClick={onPassapalabra}
                variant="outline"
                disabled={showCorrectAnswer || disabled}
                className="text-xs sm:text-sm lg:text-base py-2 sm:py-3 bg-transparent"
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
