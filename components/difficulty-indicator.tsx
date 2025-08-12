"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Zap, Target } from "lucide-react"
import type { Difficulty } from "@/lib/game-types"

interface DifficultyIndicatorProps {
  difficulty: Difficulty
  showDescription?: boolean
  compact?: boolean
}

const difficultyConfig = {
  facil: {
    label: "Fácil",
    icon: Target,
    color: "bg-green-500",
    description: "Preguntas básicas y conocimiento general",
    characteristics: ["Vocabulario común", "Conceptos básicos", "Respuestas directas"],
  },
  medio: {
    label: "Medio",
    icon: Brain,
    color: "bg-yellow-500",
    description: "Preguntas de cultura general y conocimiento intermedio",
    characteristics: ["Cultura general", "Historia básica", "Ciencias elementales"],
  },
  dificil: {
    label: "Difícil",
    icon: Zap,
    color: "bg-red-500",
    description: "Preguntas especializadas y conocimiento avanzado",
    characteristics: ["Conocimiento especializado", "Términos técnicos", "Cultura específica"],
  },
}

export function DifficultyIndicator({
  difficulty,
  showDescription = false,
  compact = false,
}: DifficultyIndicatorProps) {
  const config = difficultyConfig[difficulty]
  const Icon = config.icon

  if (compact) {
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <div className={`w-2 h-2 rounded-full ${config.color}`} />
        {config.label}
      </Badge>
    )
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 rounded-full ${config.color} text-white`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{config.label}</h3>
            {showDescription && <p className="text-sm text-muted-foreground">{config.description}</p>}
          </div>
        </div>

        {showDescription && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Características:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {config.characteristics.map((char, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-current" />
                  {char}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function DifficultySelector({
  value,
  onChange,
  showDescriptions = true,
}: {
  value: Difficulty
  onChange: (difficulty: Difficulty) => void
  showDescriptions?: boolean
}) {
  const difficulties: Difficulty[] = ["facil", "medio", "dificil"]

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Selecciona el Nivel de Dificultad</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {difficulties.map((difficulty) => {
          const config = difficultyConfig[difficulty]
          const Icon = config.icon
          const isSelected = value === difficulty

          return (
            <Card
              key={difficulty}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? "ring-2 ring-primary shadow-md" : ""
              }`}
              onClick={() => onChange(difficulty)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-full ${config.color} text-white`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold">{config.label}</h4>
                </div>

                {showDescriptions && (
                  <>
                    <p className="text-sm text-muted-foreground mb-3">{config.description}</p>
                    <div className="space-y-1">
                      {config.characteristics.map((char, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="w-1 h-1 rounded-full bg-current" />
                          {char}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
