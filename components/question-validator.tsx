"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle, Lightbulb, Sparkles } from "lucide-react"
import type { Question } from "@/lib/questions-data"

interface ValidationResult {
  isValid: boolean
  score: number
  feedback: string
  suggestions: string[]
  correctedAnswer: string
}

interface QuestionValidatorProps {
  onQuestionValidated: (question: Question, validation: ValidationResult) => void
}

export function QuestionValidator({ onQuestionValidated }: QuestionValidatorProps) {
  const [formData, setFormData] = useState({
    letter: "",
    question: "",
    answer: "",
    difficulty: "medio" as "facil" | "medio" | "dificil",
  })

  const [isValidating, setIsValidating] = useState(false)
  const [validation, setValidation] = useState<ValidationResult | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.letter || !formData.question || !formData.answer) return

    setIsValidating(true)
    setValidation(null)

    try {
      const response = await fetch("/api/validate-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Error al validar la pregunta")
      }

      const result: ValidationResult = await response.json()
      setValidation(result)
      setShowSuggestions(true)
    } catch (error) {
      console.error("Error:", error)
      setValidation({
        isValid: false,
        score: 0,
        feedback: "Error al conectar con el servicio de validación",
        suggestions: ["Intenta de nuevo más tarde"],
        correctedAnswer: formData.answer,
      })
    } finally {
      setIsValidating(false)
    }
  }

  const handleAcceptQuestion = () => {
    if (!validation) return

    const question: Question = {
      id: `custom-${Date.now()}`,
      letter: formData.letter.toUpperCase(),
      question: formData.question,
      answer: validation.correctedAnswer || formData.answer,
      difficulty: formData.difficulty,
      category: "personalizada",
    }

    onQuestionValidated(question, validation)

    // Reset form
    setFormData({
      letter: "",
      question: "",
      answer: "",
      difficulty: "medio",
    })
    setValidation(null)
    setShowSuggestions(false)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default"
    if (score >= 60) return "secondary"
    return "destructive"
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h3 className="text-xl font-semibold">Validador de Preguntas con IA</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="letter">Letra</Label>
            <Select
              value={formData.letter}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, letter: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una letra" />
              </SelectTrigger>
              <SelectContent>
                {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
                  <SelectItem key={letter} value={letter}>
                    {letter}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="difficulty">Dificultad</Label>
            <Select
              value={formData.difficulty}
              onValueChange={(value: "facil" | "medio" | "dificil") =>
                setFormData((prev) => ({ ...prev, difficulty: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="facil">Fácil</SelectItem>
                <SelectItem value="medio">Medio</SelectItem>
                <SelectItem value="dificil">Difícil</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="question">Pregunta</Label>
          <Textarea
            id="question"
            value={formData.question}
            onChange={(e) => setFormData((prev) => ({ ...prev, question: e.target.value }))}
            placeholder="Escribe la pregunta aquí..."
            className="min-h-[80px]"
          />
        </div>

        <div>
          <Label htmlFor="answer">Respuesta</Label>
          <Input
            id="answer"
            value={formData.answer}
            onChange={(e) => setFormData((prev) => ({ ...prev, answer: e.target.value }))}
            placeholder="Respuesta correcta"
          />
        </div>

        <Button
          type="submit"
          disabled={isValidating || !formData.letter || !formData.question || !formData.answer}
          className="w-full"
        >
          {isValidating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Validando con IA...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Validar Pregunta
            </>
          )}
        </Button>
      </form>

      {validation && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {validation.isValid ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span className="font-semibold">
                {validation.isValid ? "Pregunta Válida" : "Pregunta Necesita Mejoras"}
              </span>
            </div>
            <Badge variant={getScoreBadgeVariant(validation.score)}>
              <span className={getScoreColor(validation.score)}>Puntuación: {validation.score}/100</span>
            </Badge>
          </div>

          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>{validation.feedback}</AlertDescription>
          </Alert>

          {validation.suggestions.length > 0 && showSuggestions && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Sugerencias de Mejora:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                {validation.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {validation.correctedAnswer !== formData.answer && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Respuesta Sugerida:</h4>
              <p className="text-yellow-700">{validation.correctedAnswer}</p>
            </div>
          )}

          {validation.isValid && validation.score >= 60 && (
            <Button onClick={handleAcceptQuestion} className="w-full bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              Agregar Pregunta al Juego
            </Button>
          )}
        </div>
      )}
    </Card>
  )
}
