"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HelpCircle, Eye, EyeOff } from "lucide-react"
import { ResponseInput } from "@/components/response-input"
import { useSettings } from "@/hooks/use-settings"
import type { Question } from "@/lib/game-types"

interface QuestionPanelProps {
  question: string
  letter: string
  isPlaying: boolean
  currentQuestion?: Question
  onAnswer?: (isCorrect: boolean) => void
  onPassapalabra?: () => void
}

export function QuestionPanel({
  question,
  letter,
  isPlaying,
  currentQuestion,
  onAnswer,
  onPassapalabra,
}: QuestionPanelProps) {
  const { settings } = useSettings()
  const [showAnswer, setShowAnswer] = useState(false)

  if (!isPlaying || !question) {
    return (
      <Card className="p-4 sm:p-6 text-center">
        <HelpCircle className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-500 text-sm sm:text-base">Esperando pregunta...</p>
      </Card>
    )
  }

  if (settings.responseMode !== "buttons" && currentQuestion && onAnswer && onPassapalabra) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAnswer(!showAnswer)}
            className="flex items-center gap-2"
          >
            {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showAnswer ? "Ocultar" : "Ver"} Respuesta
          </Button>
        </div>

        <ResponseInput
          question={currentQuestion}
          onAnswer={onAnswer}
          onPassapalabra={onPassapalabra}
          disabled={!isPlaying}
          showAnswer={showAnswer}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAnswer(!showAnswer)}
          className="flex items-center gap-2"
        >
          {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showAnswer ? "Ocultar" : "Ver"} Respuesta
        </Button>
      </div>

      <Card className="p-4 sm:p-6">
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 text-purple-600 rounded-full font-bold text-base sm:text-lg mb-2">
            {letter}
          </div>
          <h3 className="text-base sm:text-lg font-semibold">Pregunta</h3>
        </div>
        <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-4">{question}</p>

        {showAnswer && currentQuestion && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium text-sm sm:text-base">Respuesta: {currentQuestion.answer}</p>
          </div>
        )}
      </Card>
    </div>
  )
}
