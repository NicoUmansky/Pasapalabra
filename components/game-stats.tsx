"use client"

import { Card } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"
import { DifficultyIndicator } from "@/components/difficulty-indicator"
import { useSettings } from "@/hooks/use-settings"

interface GameStatsProps {
  score: {
    correct: number
    incorrect: number
    skipped: number
    remaining: number
  }
}

export function GameStats({ score }: GameStatsProps) {
  const { settings } = useSettings()

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Estadísticas</h3>
      </div>

      <div className="mb-4">
        <DifficultyIndicator difficulty={settings.difficulty} compact={true} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{score.correct}</div>
          <div className="text-sm text-gray-600">Correcto</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{score.skipped}</div>
          <div className="text-sm text-gray-600">Pasapalabra</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{score.incorrect}</div>
          <div className="text-sm text-gray-600">Incorrectas</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{score.remaining}</div>
          <div className="text-sm text-gray-600">Restantes</div>
        </div>
      </div>
    </Card>
  )
}
