"use client"

import { useState, useEffect } from "react"
import type { GameSettings } from "@/lib/game-types"

export interface ExtendedSettings extends GameSettings {
  soundEnabled: boolean
  theme: "light" | "dark" | "auto"
  language: "es" | "en" | "fr"
  animations: boolean
  autoAdvance: boolean
  showHints: boolean
  customTimeEnabled: boolean
  customTime?: number
  categories: string[]
  fontSize: "small" | "medium" | "large"
  highContrast: boolean
  responseMode: "buttons" | "visible" | "input" | "voice"
  showCorrectAnswer: boolean
  voiceLanguage: "es-ES" | "en-US" | "fr-FR"
  voiceSensitivity: number
}

const defaultSettings: ExtendedSettings = {
  duration: 150,
  difficulty: "medio",
  mode: "individual",
  soundEnabled: true,
  theme: "light",
  language: "es",
  animations: true,
  autoAdvance: false,
  showHints: true,
  customTimeEnabled: false,
  categories: ["general"],
  fontSize: "medium",
  highContrast: false,
  responseMode: "buttons",
  showCorrectAnswer: true,
  voiceLanguage: "es-ES",
  voiceSensitivity: 0.8,
}

export function useSettings() {
  const [settings, setSettings] = useState<ExtendedSettings>(defaultSettings)
  const [isLoaded, setIsLoaded] = useState(false)

  // Cargar configuraciones desde localStorage
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("pasapalabra-settings")
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...defaultSettings, ...parsed })
      }
    } catch (error) {
      console.error("Error loading settings:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Guardar configuraciones en localStorage
  const saveSettings = (newSettings: Partial<ExtendedSettings>) => {
    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)

    try {
      localStorage.setItem("pasapalabra-settings", JSON.stringify(updatedSettings))
    } catch (error) {
      console.error("Error saving settings:", error)
    }
  }

  // Resetear configuraciones
  const resetSettings = () => {
    setSettings(defaultSettings)
    try {
      localStorage.removeItem("pasapalabra-settings")
    } catch (error) {
      console.error("Error resetting settings:", error)
    }
  }

  // Exportar configuraciones
  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "pasapalabra-settings.json"
    link.click()
    URL.revokeObjectURL(url)
  }

  // Importar configuraciones
  const importSettings = (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string)
          const validatedSettings = { ...defaultSettings, ...imported }
          saveSettings(validatedSettings)
          resolve()
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = () => reject(new Error("Error reading file"))
      reader.readAsText(file)
    })
  }

  return {
    settings,
    isLoaded,
    saveSettings,
    resetSettings,
    exportSettings,
    importSettings,
  }
}
