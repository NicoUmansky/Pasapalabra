"use client"

import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"

interface GameProgressProps {
  totalLetters: number
  completedLetters: number
  currentLetter: string
}

export function GameProgress({ totalLetters, completedLetters, currentLetter }: GameProgressProps) {
  const progress = (completedLetters / totalLetters) * 100

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Progreso del Rosco</span>
        <span className="text-sm text-gray-600">
          {completedLetters}/{totalLetters}
        </span>
      </div>
      <Progress value={progress} className="mb-2" />
      <div className="text-center">
        <span className="text-lg font-bold text-purple-600">Letra {currentLetter}</span>
      </div>
    </Card>
  )
}
