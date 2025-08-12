"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Player } from "@/lib/game-types"
import { Crown, User, Target } from "lucide-react"

interface MultiplayerScoreboardProps {
  players: Array<Player & { accuracy: number; totalAnswered: number }>
  currentPlayer?: Player
  roundsCompleted: number
}

export function MultiplayerScoreboard({ players, currentPlayer, roundsCompleted }: MultiplayerScoreboardProps) {
  const sortedPlayers = [...players].sort((a, b) => {
    if (b.score.correct !== a.score.correct) {
      return b.score.correct - a.score.correct
    }
    return b.accuracy - a.accuracy
  })

  const getPlayerRank = (player: Player) => {
    return sortedPlayers.findIndex((p) => p.id === player.id) + 1
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Target className="w-5 h-5" />
          Marcador
        </h3>
        <Badge variant="outline">Ronda {roundsCompleted + 1}</Badge>
      </div>

      <div className="space-y-3">
        {sortedPlayers.map((player, index) => {
          const isCurrentPlayer = currentPlayer?.id === player.id
          const isLeader = index === 0
          const rank = index + 1

          return (
            <div
              key={player.id}
              className={`p-3 rounded-lg border transition-all ${
                isCurrentPlayer
                  ? "border-purple-300 bg-purple-50 shadow-md"
                  : isLeader
                    ? "border-yellow-300 bg-yellow-50"
                    : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {isLeader && <Crown className="w-4 h-4 text-yellow-600" />}
                    {isCurrentPlayer && <User className="w-4 h-4 text-purple-600" />}
                    <span className="font-medium text-sm">#{rank}</span>
                  </div>
                  <div>
                    <p className={`font-semibold ${isCurrentPlayer ? "text-purple-700" : "text-gray-800"}`}>
                      {player.name}
                    </p>
                    <p className="text-xs text-gray-600">{player.accuracy}% precisión</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-600 font-semibold">{player.score.correct}</span>
                    <span className="text-red-600">{player.score.incorrect}</span>
                    <span className="text-yellow-600">{player.score.skipped}</span>
                  </div>
                  <p className="text-xs text-gray-500">{player.totalAnswered}/26</p>
                </div>
              </div>

              {isCurrentPlayer && (
                <div className="mt-2 pt-2 border-t border-purple-200">
                  <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                    Turno Actual
                  </Badge>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
