"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { DifficultySelector } from "@/components/difficulty-indicator"
import type { ExtendedSettings } from "@/hooks/use-settings"
import { X, Download, Upload, RotateCcw, Save } from "lucide-react"

interface AdvancedSettingsProps {
  settings: ExtendedSettings
  onSave: (settings: Partial<ExtendedSettings>) => void
  onClose: () => void
  onReset: () => void
  onExport: () => void
  onImport: (file: File) => Promise<void>
}

export function AdvancedSettings({ settings, onSave, onClose, onReset, onExport, onImport }: AdvancedSettingsProps) {
  const [localSettings, setLocalSettings] = useState<ExtendedSettings>(settings)
  const [importFile, setImportFile] = useState<File | null>(null)

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

  const handleImport = async () => {
    if (importFile) {
      try {
        await onImport(importFile)
        setImportFile(null)
        onClose()
      } catch (error) {
        alert("Error al importar configuraciones")
      }
    }
  }

  const updateSetting = <K extends keyof ExtendedSettings>(key: K, value: ExtendedSettings[K]) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Configuración Avanzada</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <Tabs defaultValue="game" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="game">Juego</TabsTrigger>
              <TabsTrigger value="data">Datos</TabsTrigger>
            </TabsList>

            <TabsContent value="game" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <Label htmlFor="duration">Duración del Juego</Label>
                  <Select
                    value={localSettings.duration.toString()}
                    onValueChange={(value) => updateSetting("duration", Number.parseInt(value))}
                  >
                    <SelectTrigger>
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
                  <DifficultySelector
                    value={localSettings.difficulty}
                    onChange={(difficulty) => updateSetting("difficulty", difficulty)}
                    showDescriptions={true}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="mode">Modo de Juego</Label>
                    <Select
                      value={localSettings.mode}
                      onValueChange={(value: "individual" | "multijugador") => updateSetting("mode", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="multijugador">Multijugador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="responseMode">Modo de Respuesta</Label>
                    <Select
                      value={
                        localSettings.responseMode === "visible" ||
                        localSettings.responseMode === "input" ||
                        localSettings.responseMode === "voice"
                          ? "input"
                          : "buttons"
                      }
                      onValueChange={(value: "buttons" | "input") =>
                        updateSetting("responseMode", value === "buttons" ? "buttons" : "input")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buttons">Botones</SelectItem>
                        <SelectItem value="input">Entrada (Texto/Voz)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {localSettings.mode === "multijugador" && (
                    <div>
                      <Label htmlFor="playerCount">Número de Jugadores</Label>
                      <Select
                        value={localSettings.playerCount?.toString() || "2"}
                        onValueChange={(value) => updateSetting("playerCount", Number.parseInt(value))}
                      >
                        <SelectTrigger>
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

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="theme">Tema Visual</Label>
                      <p className="text-sm text-gray-600">Seleccionar tema claro u oscuro</p>
                    </div>
                    <Select
                      value={localSettings.theme}
                      onValueChange={(value: "light" | "dark" | "auto") => updateSetting("theme", value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Claro</SelectItem>
                        <SelectItem value="dark">Oscuro</SelectItem>
                        <SelectItem value="auto">Automático</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="data" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={onExport} variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Download className="w-4 h-4" />
                  Exportar Configuración
                </Button>

                <div className="space-y-2">
                  <Input type="file" accept=".json" onChange={(e) => setImportFile(e.target.files?.[0] || null)} />
                  <Button
                    onClick={handleImport}
                    disabled={!importFile}
                    variant="outline"
                    className="w-full flex items-center gap-2 bg-transparent"
                  >
                    <Upload className="w-4 h-4" />
                    Importar Configuración
                  </Button>
                </div>

                <Button onClick={onReset} variant="destructive" className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Resetear Todo
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-3 mt-8 pt-6 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button onClick={handleSave} className="flex-1 flex items-center gap-2">
              <Save className="w-4 h-4" />
              Guardar Configuración
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
