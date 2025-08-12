"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { GameSettings as GameSettingsType } from "@/lib/game-types"
import { X, Settings } from "lucide-react"

interface GameSettingsProps {
  settings: GameSettingsType
  onSave: (settings: GameSettingsType) => void
  onClose: () => void
  onAdvanced?: () => void
}

export function GameSettings({ settings, onSave, onClose, onAdvanced }: GameSettingsProps) {
  const [localSettings, setLocalSettings] = useState<GameSettingsType>(settings)

  const timeOptions = [
    { value: 90, label: "1:30" },
    { value: 120, label: "2:00" },
    { value: 150, label: "2:30" },
    { value: 180, label: "3:00" },
    { value: 240, label: "4:00" },
    { value: 300, label: "5:00" },
  ]

  const handleSave = () => {
    onSave(localSettings)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-semibold">Configuración del Juego</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="duration" className="text-sm font-medium">
              Duración del Juego
            </Label>
            <Select
              value={localSettings.duration.toString()}
              onValueChange={(value) => setLocalSettings((prev) => ({ ...prev, duration: Number.parseInt(value) }))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="difficulty" className="text-sm font-medium">
              Nivel de Dificultad
            </Label>
            <Select
              value={localSettings.difficulty}
              onValueChange={(value: "facil" | "medio" | "dificil") =>
                setLocalSettings((prev) => ({ ...prev, difficulty: value }))
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="facil">Fácil</SelectItem>
                <SelectItem value="medio">Medio</SelectItem>
                <SelectItem value="dificil">Difícil</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="responseMode" className="text-sm font-medium">
              Modo de Respuesta
            </Label>
            <Select
              value={localSettings.responseMode || "buttons"}
              onValueChange={(value: "buttons" | "visible" | "text" | "voice") =>
                setLocalSettings((prev) => ({ ...prev, responseMode: value }))
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buttons">Botones</SelectItem>
                <SelectItem value="visible">Visualizar Respuestas</SelectItem>
                <SelectItem value="text">Campo de Texto</SelectItem>
                <SelectItem value="voice">Reconocimiento de Voz</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="mode" className="text-sm font-medium">
              Modo de Juego
            </Label>
            <Select
              value={localSettings.mode}
              onValueChange={(value: "individual" | "multijugador") =>
                setLocalSettings((prev) => ({ ...prev, mode: value }))
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="multijugador">Multijugador</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {localSettings.mode === "multijugador" && (
            <div>
              <Label htmlFor="playerCount" className="text-sm font-medium">
                Número de Jugadores
              </Label>
              <Select
                value={localSettings.playerCount?.toString() || "2"}
                onValueChange={(value) =>
                  setLocalSettings((prev) => ({ ...prev, playerCount: Number.parseInt(value) }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 Jugadores</SelectItem>
                  <SelectItem value="3">3 Jugadores</SelectItem>
                  <SelectItem value="4">4 Jugadores</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent order-2 sm:order-1">
            Cancelar
          </Button>
          {onAdvanced && (
            <Button
              variant="outline"
              onClick={onAdvanced}
              className="flex items-center justify-center gap-2 bg-transparent order-3 sm:order-2"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Avanzado</span>
            </Button>
          )}
          <Button onClick={handleSave} className="flex-1 order-1 sm:order-3">
            Guardar
          </Button>
        </div>
      </Card>
    </div>
  )
}
