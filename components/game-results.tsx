"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Clock, Target, RotateCcw } from "lucide-react"

interface GameResultsProps {
  score: {
    correct: number
    incorrect: number
    skipped: number
    remaining: number
  }
  timeElapsed: number
  totalTime: number
  accuracy: number
  onPlayAgain: () => void
  onNewGame: () => void
}

export function GameResults({ score, timeElapsed, totalTime, accuracy, onPlayAgain, onNewGame }: GameResultsProps) {
  const minutes = Math.floor(timeElapsed / 60)
  const seconds = timeElapsed % 60

  const getPerformanceMessage = () => {
    if (accuracy >= 90) return "¡Excelente! Eres un maestro de Pasapalabra"
    if (accuracy >= 75) return "¡Muy bien! Gran conocimiento"
    if (accuracy >= 60) return "¡Bien hecho! Buen rendimiento"
    if (accuracy >= 40) return "No está mal, sigue practicando"
    return "¡Sigue intentando! La práctica hace al maestro"
  }

  const getScoreColor = () => {
    if (accuracy >= 90) return "text-green-600"
    if (accuracy >= 75) return "text-blue-600"
    if (accuracy >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="mb-6">
          <Trophy className={`w-16 h-16 mx-auto mb-4 ${getScoreColor()}`} />
          <h2 className="text-2xl font-bold mb-2">¡Juego Terminado!</h2>
          <p className="text-gray-600">{getPerformanceMessage()}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{score.correct}</div>
            <div className="text-sm text-gray-600">Correctas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{score.incorrect}</div>
            <div className="text-sm text-gray-600">Incorrectas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">{score.skipped}</div>
            <div className="text-sm text-gray-600">Pasapalabra</div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${getScoreColor()}`}>{accuracy}%</div>
            <div className="text-sm text-gray-600">Precisión</div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mb-6 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>
              {minutes}:{seconds.toString().padStart(2, "0")}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-4 h-4" />
            <span>{score.correct + score.incorrect + score.skipped}/26</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button onClick={onPlayAgain} className="w-full">
            <RotateCcw className="w-4 h-4 mr-2" />
            Jugar de Nuevo
          </Button>
          <Button onClick={onNewGame} variant="outline" className="w-full bg-transparent">
            Nueva Configuración
          </Button>
        </div>
      </Card>
    </div>
  )
}
