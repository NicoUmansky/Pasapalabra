"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QuestionValidator } from "@/components/question-validator"
import type { Question } from "@/lib/questions-data"
import { Search, Trash2, Plus, BookOpen, Filter } from "lucide-react"

interface CustomQuestionsManagerProps {
  onClose: () => void
}

export function CustomQuestionsManager({ onClose }: CustomQuestionsManagerProps) {
  const [customQuestions, setCustomQuestions] = useState<Question[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterLetter, setFilterLetter] = useState("")
  const [filterDifficulty, setFilterDifficulty] = useState("")

  // Load custom questions from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pasapalabra-custom-questions")
      if (saved) {
        setCustomQuestions(JSON.parse(saved))
      }
    } catch (error) {
      console.error("Error loading custom questions:", error)
    }
  }, [])

  // Save custom questions to localStorage
  const saveCustomQuestions = (questions: Question[]) => {
    try {
      localStorage.setItem("pasapalabra-custom-questions", JSON.stringify(questions))
      setCustomQuestions(questions)
    } catch (error) {
      console.error("Error saving custom questions:", error)
    }
  }

  const handleQuestionValidated = (question: Question, validation: any) => {
    const newQuestions = [...customQuestions, question]
    saveCustomQuestions(newQuestions)
  }

  const handleDeleteQuestion = (questionId: string) => {
    const newQuestions = customQuestions.filter((q) => q.id !== questionId)
    saveCustomQuestions(newQuestions)
  }

  const filteredQuestions = customQuestions.filter((question) => {
    const matchesSearch =
      question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLetter = !filterLetter || question.letter === filterLetter
    const matchesDifficulty = !filterDifficulty || question.difficulty === filterDifficulty

    return matchesSearch && matchesLetter && matchesDifficulty
  })

  const questionsByLetter = filteredQuestions.reduce(
    (acc, question) => {
      if (!acc[question.letter]) {
        acc[question.letter] = []
      }
      acc[question.letter].push(question)
      return acc
    },
    {} as Record<string, Question[]>,
  )

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "facil":
        return "bg-green-100 text-green-800"
      case "medio":
        return "bg-yellow-100 text-yellow-800"
      case "dificil":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              <h2 className="text-2xl font-semibold">Gestor de Preguntas Personalizadas</h2>
            </div>
            <Button variant="ghost" onClick={onClose}>
              ×
            </Button>
          </div>

          <Tabs defaultValue="add" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="add" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Agregar Pregunta
              </TabsTrigger>
              <TabsTrigger value="manage" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Gestionar Preguntas ({customQuestions.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="add" className="mt-6">
              <QuestionValidator onQuestionValidated={handleQuestionValidated} />
            </TabsContent>

            <TabsContent value="manage" className="mt-6">
              <div className="space-y-6">
                {/* Filters */}
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Buscar preguntas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <select
                    value={filterLetter}
                    onChange={(e) => setFilterLetter(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="">Todas las letras</option>
                    {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
                      <option key={letter} value={letter}>
                        {letter}
                      </option>
                    ))}
                  </select>
                  <select
                    value={filterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="">Todas las dificultades</option>
                    <option value="facil">Fácil</option>
                    <option value="medio">Medio</option>
                    <option value="dificil">Difícil</option>
                  </select>
                </div>

                {/* Questions List */}
                {Object.keys(questionsByLetter).length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">
                      {customQuestions.length === 0
                        ? "No hay preguntas personalizadas aún"
                        : "No se encontraron preguntas con los filtros aplicados"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(questionsByLetter)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([letter, questions]) => (
                        <div key={letter}>
                          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">
                              {letter}
                            </div>
                            Letra {letter} ({questions.length} preguntas)
                          </h3>
                          <div className="grid gap-3">
                            {questions.map((question) => (
                              <Card key={question.id} className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge className={getDifficultyColor(question.difficulty)}>
                                        {question.difficulty}
                                      </Badge>
                                      <Badge variant="outline">Personalizada</Badge>
                                    </div>
                                    <p className="font-medium mb-1">{question.question}</p>
                                    <p className="text-sm text-gray-600">
                                      <strong>Respuesta:</strong> {question.answer}
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteQuestion(question.id)}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  )
}
