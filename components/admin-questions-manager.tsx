"use client"

import type React from "react"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Edit, Plus, X, Upload, Download, Check, Clock, ArrowLeft, BookOpen } from "lucide-react"
import type { Question, Difficulty } from "@/lib/game-types"
import { questionsDatabase, updateLocalQuestions, getCurrentQuestions } from "@/lib/questions-data"
import { createClient } from "@/lib/supabase/client"
import { updateLocalQuestionsFile } from "@/lib/supabase/questions-sync"

interface PendingQuestion extends Question {
  id: string
  submittedAt: Date
  status: "pending" | "approved" | "rejected"
}

export function AdminQuestionsManager() {
  const [questions, setQuestions] = useState<Record<string, Question[]>>({})
  const [pendingQuestions, setPendingQuestions] = useState<PendingQuestion[]>([])
  const [selectedLetter, setSelectedLetter] = useState("A")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "all">("all")
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [activeTab, setActiveTab] = useState<"questions" | "pending">("questions")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const importQuestions = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const questionsData = JSON.parse(e.target?.result as string)
        setQuestions(questionsData)
        localStorage.setItem("questionsDatabase", JSON.stringify(questionsData))
      }
      reader.readAsText(file)
    }
  }

  const exportQuestions = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(questions))
    const downloadAnchorNode = document.createElement("a")
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", "questions.json")
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  const saveToSupabase = async (questionsData: Record<string, Question[]>) => {
    try {
      const questionsArray = Object.values(questionsData).flat()
      
      // Actualizar el archivo local primero
      updateLocalQuestionsFile(questionsArray)
      
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn("Supabase no configurado, guardando solo en archivo local")
        return true
      }

      const supabase = createClient()

      // Eliminar todas las preguntas existentes
      await supabase.from("questions").delete().neq("id", "")

      // Insertar las nuevas preguntas
      const { error } = await supabase.from("questions").insert(
        questionsArray.map((q) => ({
          letter: q.letter,
          question: q.question,
          answer: q.answer,
          difficulty: q.difficulty,
          category: q.category,
        })),
      )

      if (error) {
        console.error("Error guardando en Supabase:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error conectando con Supabase:", error)
      return true
    }
  }

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        // Convertir el array de preguntas a objeto agrupado por letra
        const groupedQuestions: Record<string, Question[]> = {}

        questionsDatabase.forEach((question) => {
          const letter = question.letter.toUpperCase()
          if (!groupedQuestions[letter]) {
            groupedQuestions[letter] = []
          }
          groupedQuestions[letter].push(question)
        })

        setQuestions(groupedQuestions)

        // Cargar preguntas pendientes desde localStorage
        const savedPending = localStorage.getItem("pendingQuestions")
        if (savedPending) {
          setPendingQuestions(JSON.parse(savedPending))
        }
      } catch (error) {
        console.error("Error cargando preguntas:", error)
      }
    }

    loadQuestions()
  }, [])

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

  const filteredQuestions =
    questions[selectedLetter]?.filter((q) => {
      const matchesSearch =
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDifficulty = selectedDifficulty === "all" || q.difficulty === selectedDifficulty
      return matchesSearch && matchesDifficulty
    }) || []

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question)
  }

  const handleSaveEdit = async (updatedQuestion: Question) => {
    const newQuestions = { ...questions }
    const letterQuestions = newQuestions[updatedQuestion.letter] || []
    const questionIndex = letterQuestions.findIndex((q) => q.id === updatedQuestion.id)

    if (questionIndex !== -1) {
      letterQuestions[questionIndex] = updatedQuestion
      setQuestions(newQuestions)
      setEditingQuestion(null)

      localStorage.setItem("questionsDatabase", JSON.stringify(newQuestions))

      const saved = await saveToSupabase(newQuestions)

      // Sincronizar con el objeto questionsData global
      if (typeof window !== "undefined") {
        const questionsArray = Object.values(newQuestions).flat()
        localStorage.setItem("questionsArray", JSON.stringify(questionsArray))
      }

      alert(
        saved
          ? "Pregunta actualizada y guardada en la base de datos"
          : "Pregunta actualizada localmente (error en base de datos)",
      )
    }
  }

  const handleDeleteQuestion = (questionId: string, letter: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta pregunta?")) {
      const newQuestions = { ...questions }
      newQuestions[letter] = newQuestions[letter].filter((q) => q.id !== questionId)
      setQuestions(newQuestions)

      localStorage.setItem("questionsDatabase", JSON.stringify(newQuestions))

      // Sincronizar con el objeto questionsData global
      if (typeof window !== "undefined") {
        const questionsArray = Object.values(newQuestions).flat()
        localStorage.setItem("questionsArray", JSON.stringify(questionsArray))
      }

      alert("Pregunta eliminada exitosamente")
    }
  }

  const validateQuestion = (question: Question | null): string | null => {
    if (!question?.question?.trim()) return "La pregunta es requerida"
    if (!question?.answer?.trim()) return "La respuesta es requerida"

    // Validar que la respuesta empiece con la letra correcta
    const firstLetter = question.answer.trim().charAt(0).toUpperCase()
    if (firstLetter !== selectedLetter) {
      return `La respuesta debe empezar con la letra ${selectedLetter}`
    }

    return null
  }

  const saveQuestion = async () => {
    if (!editingQuestion) return
    
    const validation = validateQuestion(editingQuestion)
    if (validation) {
      alert(validation)
      return
    }

    const questionToSave: Question = {
      question: editingQuestion.question.trim(),
      answer: editingQuestion.answer.trim(),
      difficulty: editingQuestion.difficulty,
      category: editingQuestion.category || "general",
      letter: selectedLetter,
      id: Date.now().toString(),
    }

    const newQuestions = {
      ...questions,
      [selectedLetter]: [...(questions[selectedLetter] || []), questionToSave],
    }

    setQuestions(newQuestions)
    setEditingQuestion(null)

    localStorage.setItem("questionsDatabase", JSON.stringify(newQuestions))

    const saved = await saveToSupabase(newQuestions)

    // Sincronizar con el objeto questionsData global
    if (typeof window !== "undefined") {
      const questionsArray = Object.values(newQuestions).flat()
      localStorage.setItem("questionsArray", JSON.stringify(questionsArray))
    }

    alert(saved ? "Pregunta guardada en la base de datos" : "Pregunta guardada localmente (error en base de datos)")
  }

  const approvePendingQuestion = (pendingQuestion: PendingQuestion) => {
    const letter = pendingQuestion.answer.charAt(0).toUpperCase()

    setQuestions((prev) => ({
      ...prev,
      [letter]: [
        ...(prev[letter] || []),
        {
          question: pendingQuestion.question,
          answer: pendingQuestion.answer,
          difficulty: pendingQuestion.difficulty,
          category: pendingQuestion.category,
          letter: letter,
          id: pendingQuestion.id,
        },
      ],
    }))

    setPendingQuestions((prev) => prev.filter((q) => q.id !== pendingQuestion.id))
    localStorage.setItem(
      "pendingQuestions",
      JSON.stringify(pendingQuestions.filter((q) => q.id !== pendingQuestion.id)),
    )
  }

  const rejectPendingQuestion = (pendingQuestion: PendingQuestion) => {
    setPendingQuestions((prev) => prev.filter((q) => q.id !== pendingQuestion.id))
    localStorage.setItem(
      "pendingQuestions",
      JSON.stringify(pendingQuestions.filter((q) => q.id !== pendingQuestion.id)),
    )
  }

  const getDifficultyColor = (difficulty: Difficulty) => {
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

  const onClose = () => {
    // Implement close logic here
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Gestor de Preguntas - Admin</h2>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                <ArrowLeft className="w-4 h-4" />
                Volver al Menú
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full sm:w-auto">
              <Select value={selectedLetter} onValueChange={setSelectedLetter}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {letters.map((letter) => (
                    <SelectItem key={letter} value={letter}>
                      {letter}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Buscar preguntas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64"
              />

              <Select value={selectedDifficulty} onValueChange={(value: Difficulty | "all") => setSelectedDifficulty(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="facil">Fácil</SelectItem>
                  <SelectItem value="medio">Medio</SelectItem>
                  <SelectItem value="dificil">Difícil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                onClick={() =>
                  handleEditQuestion({
                    question: "",
                    answer: "",
                    difficulty: "medio",
                    category: "general",
                    letter: selectedLetter,
                    id: "",
                  })
                }
                disabled={editingQuestion !== null}
                className="w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Pregunta
              </Button>
              <input type="file" accept=".json" onChange={importQuestions} ref={fileInputRef} className="hidden" />
              <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full sm:w-auto">
                <Upload className="w-4 h-4 mr-2" />
                Importar
              </Button>
              <Button variant="outline" onClick={exportQuestions} className="w-full sm:w-auto bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Estadísticas - Letra {selectedLetter}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-green-600">
                    {questions[selectedLetter]?.filter((q) => q.difficulty === "facil").length || 0}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Fácil</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-yellow-600">
                    {questions[selectedLetter]?.filter((q) => q.difficulty === "medio").length || 0}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Medio</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-red-600">
                    {questions[selectedLetter]?.filter((q) => q.difficulty === "dificil").length || 0}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Difícil</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">
                    {questions[selectedLetter]?.length || 0}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Total</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {activeTab === "questions" && (
            <>
              <div className="space-y-4">
                {filteredQuestions.map((question) => (
                  <Card key={question.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{question.difficulty}</Badge>
                          <Badge variant="secondary">{question.category}</Badge>
                        </div>
                        <p className="font-medium mb-1">{question.question}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Respuesta: <span className="font-medium">{question.answer}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditQuestion(question)}
                          className="flex items-center gap-1"
                        >
                          <Edit className="w-4 h-4" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteQuestion(question.id, question.letter)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}

                {filteredQuestions.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center text-gray-500">
                      No hay preguntas para la letra {selectedLetter}
                      {searchTerm && " que coincidan con la búsqueda"}
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}

          {activeTab === "pending" && (
            <div className="space-y-4">
              {pendingQuestions.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-gray-500">
                    No hay preguntas pendientes de aprobación
                  </CardContent>
                </Card>
              ) : (
                pendingQuestions.map((pendingQuestion) => (
                  <Card key={pendingQuestion.id}>
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <Badge className={getDifficultyColor(pendingQuestion.difficulty)}>
                              {pendingQuestion.difficulty}
                            </Badge>
                            <Badge variant="outline">{pendingQuestion.category}</Badge>
                            <Badge variant="outline" className="bg-orange-100 text-orange-800">
                              <Clock className="w-3 h-3 mr-1" />
                              Pendiente
                            </Badge>
                          </div>
                          <p className="font-medium mb-1 break-words">{pendingQuestion.question}</p>
                          <p className="text-green-600 font-semibold break-words">→ {pendingQuestion.answer}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            Enviada: {pendingQuestion.submittedAt.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => approvePendingQuestion(pendingQuestion)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Check className="w-4 h-4" />
                            Aprobar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => rejectPendingQuestion(pendingQuestion)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                            Rechazar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>

        {editingQuestion && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-60">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl p-6">
              <h3 className="text-xl font-bold mb-4">Editar Pregunta</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Pregunta</label>
                  <Textarea
                    value={editingQuestion.question}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, question: e.target.value })}
                    placeholder="Escribe la pregunta..."
                    rows={3}
                    className="resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Respuesta</label>
                  <Input
                    value={editingQuestion.answer}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, answer: e.target.value })}
                    placeholder={`Respuesta que empiece con ${selectedLetter}...`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Dificultad</label>
                    <Select
                      value={editingQuestion.difficulty}
                      onValueChange={(value) =>
                        setEditingQuestion({ ...editingQuestion, difficulty: value as Difficulty })
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
                  <div>
                    <label className="block text-sm font-medium mb-2">Categoría</label>
                    <Input
                      value={editingQuestion.category}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, category: e.target.value })}
                      placeholder="Categoría..."
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setEditingQuestion(null)}>
                    Cancelar
                  </Button>
                  <Button onClick={saveQuestion}>Guardar Cambios</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
