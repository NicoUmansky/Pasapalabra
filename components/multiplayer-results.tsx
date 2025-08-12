"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Player } from "@/lib/game-types"
import { Trophy, Medal, Award, RotateCcw, Settings } from "lucide-react"

interface MultiplayerResultsProps {
  players: Array<Player & { accuracy: number; totalAnswered: number }>
  onPlayAgain: () => void
  onNewGame: () => void
}

export function MultiplayerResults({ players, onPlayAgain, onNewGame }: MultiplayerResultsProps) {
  const sortedPlayers = [...players].sort((a, b) => {
    if (b.score.correct !== a.score.correct) {
      return b.score.correct - a.score.correct
    }
    return b.accuracy - a.accuracy
  })

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-8 h-8 text-yellow-500" />
      case 2:
        return <Medal className="w-8 h-8 text-gray-400" />
      case 3:
        return <Award className="w-8 h-8 text-amber-600" />
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
            {position}
          </div>
        )
    }
  }

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1:
        return "border-yellow-300 bg-yellow-50"
      case 2:
        return "border-gray-300 bg-gray-50"
      case 3:
        return "border-amber-300 bg-amber-50"
      default:
        return "border-gray-200 bg-white"
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <h2 className="text-3xl font-bold mb-2">¡Partida Terminada!</h2>
          <p className="text-gray-600">Resultados finales del multijugador</p>
        </div>

        <div className="space-y-4 mb-8">
          {sortedPlayers.map((player, index) => {
            const position = index + 1
            const isWinner = position === 1

            return (
              <div key={player.id} className={`p-4 rounded-lg border-2 ${getPositionColor(position)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getPositionIcon(position)}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`text-xl font-bold ${isWinner ? "text-yellow-700" : "text-gray-800"}`}>
                          {player.name}
                        </h3>
                        {isWinner && <Badge className="bg-yellow-500 text-white">¡Ganador!</Badge>}
                      </div>
                      <p className="text-sm text-gray-600">
                        {player.accuracy}% de precisión • {player.totalAnswered}/26 respondidas
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-600">{player.score.correct}</div>
                        <div className="text-xs text-gray-600">Correctas</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-600">{player.score.incorrect}</div>
                        <div className="text-xs text-gray-600">Incorrectas</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-600">{player.score.skipped}</div>
                        <div className="text-xs text-gray-600">Pasapalabra</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex gap-4">
          <Button onClick={onPlayAgain} className="flex-1 flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Jugar de Nuevo
          </Button>
          <Button onClick={onNewGame} variant="outline" className="flex-1 flex items-center gap-2 bg-transparent">
            <Settings className="w-4 h-4" />
            Nueva Configuración
          </Button>
        </div>
      </Card>
    </div>
  )
}
