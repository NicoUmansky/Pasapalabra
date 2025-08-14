"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { GameSettings as GameSettingsType } from "@/lib/game-types"
import { X, Sun, Moon } from "lucide-react"

interface GameSettingsProps {
  settings: GameSettingsType & {
    theme?: "light" | "dark" | "auto"
  }
  onSave: (settings: GameSettingsType & { theme?: "light" | "dark" | "auto" }) => void
  onClose: () => void
}

export function GameSettings({ settings, onSave, onClose }: GameSettingsProps) {
  const [localSettings, setLocalSettings] = useState<GameSettingsType & { theme?: "light" | "dark" | "auto" }>(settings)

  const timeOptions = [
    { value: 60, label: "1:00" },
    { value: 90, label: "1:30" },
    { value: 120, label: "2:00" },
    { value: 150, label: "2:30" },
    { value: 180, label: "3:00" },
    { value: 240, label: "4:00" },
    { value: 300, label: "5:00" },
    { value: 420, label: "7:00" },
    { value: 600, label: "10:00" },
  ]

  const handleSave = () => {
    onSave(localSettings)
    onClose()
  }

  const toggleTheme = () => {
    const newTheme = localSettings.theme === "light" ? "dark" : "light"
    const updatedSettings = { ...localSettings, theme: newTheme }
    setLocalSettings(updatedSettings)

    // Aplicar tema inmediatamente
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  useEffect(() => {
    // Aplicar tema inicial
    if (localSettings.theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [localSettings.theme])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-semibold">Configuración del Juego</h2>
            <div className="flex items-center gap-2">
              {/* Interruptor de tema */}
              <Button variant="ghost" size="sm" onClick={toggleTheme} className="p-2">
                {localSettings.theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  onValueChange={(value: "facil" | "medio" | "dificil" | "sorpresa") =>
                    setLocalSettings((prev) => ({ ...prev, difficulty: value }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facil">🟢 Fácil</SelectItem>
                    <SelectItem value="medio">🟡 Medio</SelectItem>
                    <SelectItem value="dificil">🔴 Difícil</SelectItem>
                    <SelectItem value="sorpresa">⭐ Sorpresa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="responseMode" className="text-sm font-medium">
                  Modo de Respuesta
                </Label>
                <Select
                  value={
                    localSettings.responseMode === "input" || localSettings.responseMode === "voice"
                      ? "input"
                      : "buttons"
                  }
                  onValueChange={(value: "buttons" | "input") =>
                    setLocalSettings((prev) => ({ ...prev, responseMode: value === "input" ? "input" : "buttons" }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buttons">🔘 Botones</SelectItem>
                    <SelectItem value="input">⌨️ Entrada (Texto/Voz)</SelectItem>
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
                    <SelectItem value="individual">👤 Individual</SelectItem>
                    <SelectItem value="multijugador">👥 Multijugador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {localSettings.mode === "multijugador" && (
                <div className="sm:col-span-2">
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
                      <SelectItem value="6">6 Jugadores</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Información de dificultad */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Información de Dificultad</h3>
              <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                {localSettings.difficulty === "facil" && (
                  <p>
                    🟢 <strong>Fácil:</strong> Preguntas básicas de cultura general, perfectas para principiantes.
                  </p>
                )}
                {localSettings.difficulty === "medio" && (
                  <p>
                    🟡 <strong>Medio:</strong> Preguntas de nivel intermedio que requieren conocimientos generales.
                  </p>
                )}
                {localSettings.difficulty === "dificil" && (
                  <p>
                    🔴 <strong>Difícil:</strong> Preguntas especializadas que desafían tu conocimiento.
                  </p>
                )}
                {localSettings.difficulty === "sorpresa" && (
                  <p>
                    ⭐ <strong>Sorpresa:</strong> Mezcla aleatoria de todas las dificultades para una experiencia
                    impredecible.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Guardar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
