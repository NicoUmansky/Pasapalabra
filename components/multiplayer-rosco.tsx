"use client"

import type { LetterState, Player } from "@/lib/game-types"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

interface MultiplayerRoscoProps {
  playerLetters: Record<string, LetterState[]>
  players: Player[]
  currentLetter: string
  currentPlayer?: Player
}

export function MultiplayerRosco({ playerLetters, players, currentLetter, currentPlayer }: MultiplayerRoscoProps) {
  const radius = 120
  const centerX = 150
  const centerY = 150
  const letterRadius = 18

  const getLetterPosition = (index: number, total: number) => {
    const angle = (index * 2 * Math.PI) / total - Math.PI / 2
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)
    return { x, y }
  }

  const getLetterColor = (letter: LetterState, isCurrent: boolean) => {
    if (isCurrent) return "#8B5CF6" // Purple for current
    switch (letter.status) {
      case "correct":
        return "#10B981" // Green
      case "incorrect":
        return "#EF4444" // Red
      case "skipped":
        return "#F59E0B" // Yellow
      default:
        return "#3B82F6" // Blue for pending
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {players.map((player) => {
        const letters = playerLetters[player.id] || []
        const isCurrentPlayer = currentPlayer?.id === player.id

        return (
          <Card key={player.id} className={`p-4 ${isCurrentPlayer ? "ring-2 ring-purple-300" : ""}`}>
            <div className="text-center mb-2">
              <h3 className={`font-semibold ${isCurrentPlayer ? "text-purple-700" : "text-gray-700"}`}>
                {player.name}
              </h3>
              <div className="flex justify-center gap-2 text-xs mt-1">
                <span className="text-green-600">{player.score.correct}C</span>
                <span className="text-red-600">{player.score.incorrect}I</span>
                <span className="text-yellow-600">{player.score.skipped}P</span>
              </div>
            </div>

            <div className="flex justify-center">
              <svg width="300" height="300" className="drop-shadow-sm">
                {/* Centro del rosco */}
                <circle cx={centerX} cy={centerY} r="30" fill="#8B5CF6" className="drop-shadow-sm" />
                <text
                  x={centerX}
                  y={centerY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-white text-sm font-bold"
                >
                  {player.name.charAt(0)}
                </text>

                {/* Letras del rosco */}
                {letters.map((letter, index) => {
                  const { x, y } = getLetterPosition(index, letters.length)
                  const isCurrent = letter.letter === currentLetter && isCurrentPlayer
                  const color = getLetterColor(letter, isCurrent)

                  return (
                    <g key={letter.letter}>
                      <circle
                        cx={x}
                        cy={y}
                        r={letterRadius}
                        fill={color}
                        className={cn("drop-shadow-sm transition-all duration-300", {
                          "animate-pulse": isCurrent,
                        })}
                      />
                      <text
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-white text-sm font-bold pointer-events-none"
                      >
                        {letter.letter}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
