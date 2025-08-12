"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, Play, X } from "lucide-react"

interface MultiplayerSetupProps {
  playerCount: number
  onStart: (playerNames: string[]) => void
  onClose: () => void
}

export function MultiplayerSetup({ playerCount, onStart, onClose }: MultiplayerSetupProps) {
  const [playerNames, setPlayerNames] = useState<string[]>(
    Array.from({ length: playerCount }, (_, i) => `Jugador ${i + 1}`),
  )

  const handleNameChange = (index: number, name: string) => {
    setPlayerNames((prev) => prev.map((n, i) => (i === index ? name || `Jugador ${index + 1}` : n)))
  }

  const handleStart = () => {
    onStart(playerNames)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Configurar Jugadores</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4 mb-6">
          {Array.from({ length: playerCount }, (_, index) => (
            <div key={index}>
              <Label htmlFor={`player-${index}`}>Jugador {index + 1}</Label>
              <Input
                id={`player-${index}`}
                value={playerNames[index]}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder={`Jugador ${index + 1}`}
                className="mt-1"
              />
            </div>
          ))}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">Reglas del Multijugador:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Cada jugador tiene su propio rosco de preguntas</li>
            <li>• El tiempo se distribuye equitativamente entre jugadores</li>
            <li>• Los turnos se alternan automáticamente</li>
            <li>• Gana quien tenga más respuestas correctas</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            Cancelar
          </Button>
          <Button onClick={handleStart} className="flex-1 flex items-center gap-2">
            <Play className="w-4 h-4" />
            Comenzar Partida
          </Button>
        </div>
      </Card>
    </div>
  )
}
