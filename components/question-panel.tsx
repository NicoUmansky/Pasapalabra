"use client"

import { Card } from "@/components/ui/card"
import { HelpCircle } from "lucide-react"
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

  if (!isPlaying || !question) {
    return (
      <Card className="p-6 text-center">
        <HelpCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-500">Esperando pregunta...</p>
      </Card>
    )
  }

  if (settings.responseMode !== "buttons" && currentQuestion && onAnswer && onPassapalabra) {
    return (
      <ResponseInput
        question={currentQuestion}
        onAnswer={onAnswer}
        onPassapalabra={onPassapalabra}
        disabled={!isPlaying}
      />
    )
  }

  return (
    <Card className="p-6">
      <div className="mb-4">
        <div className="inline-flex items-center justify-center w-10 h-10 bg-purple-100 text-purple-600 rounded-full font-bold text-lg mb-2">
          {letter}
        </div>
        <h3 className="text-lg font-semibold">Pregunta</h3>
      </div>
      <p className="text-gray-700 leading-relaxed">{question}</p>
    </Card>
  )
}
