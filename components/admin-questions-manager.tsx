"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Edit, Plus, Save, X, Upload, Download, Check, Clock, ArrowLeft } from "lucide-react"
import type { Question, Difficulty } from "@/lib/game-types"
import { questionsDatabase, questionsData } from "@/lib/questions-data"

interface PendingQuestion extends Question {
  id: string
  submittedAt: Date
  status: "pending" | "approved" | "rejected"
}

export function AdminQuestionsManager() {
  const [questions, setQuestions] = useState<Record<string, Question[]>>({})
  const [pendingQuestions, setPendingQuestions] = useState<PendingQuestion[]>([])
  const [selectedLetter, setSelectedLetter] = useState("A")
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    question: "",
    answer: "",
    difficulty: "medio",
    category: "general",
  })
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"questions" | "pending">("questions")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setQuestions(questionsDatabase)

    // Cargar preguntas pendientes desde localStorage
    const savedPending = localStorage.getItem("pendingQuestions")
    if (savedPending) {
      setPendingQuestions(JSON.parse(savedPending))
    }
  }, [])

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

  const filteredQuestions =
    questions[selectedLetter]?.filter(
      (q) =>
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []

  const validateQuestion = (question: Partial<Question>): string | null => {
    if (!question.question?.trim()) return "La pregunta es requerida"
    if (!question.answer?.trim()) return "La respuesta es requerida"

    // Validar que la respuesta empiece con la letra correcta
    const firstLetter = question.answer.trim().charAt(0).toUpperCase()
    if (firstLetter !== selectedLetter) {
      return `La respuesta debe empezar con la letra ${selectedLetter}`
    }

    return null
  }

  const saveQuestion = () => {
    const validation = validateQuestion(newQuestion)
    if (validation) {
      alert(validation)
      return
    }

    const questionToSave: Question = {
      question: newQuestion.question!.trim(),
      answer: newQuestion.answer!.trim(),
      difficulty: newQuestion.difficulty as Difficulty,
      category: newQuestion.category || "general",
    }

    setQuestions((prev) => ({
      ...prev,
      [selectedLetter]: [...(prev[selectedLetter] || []), questionToSave],
    }))

    setNewQuestion({
      question: "",
      answer: "",
      difficulty: "medio",
      category: "general",
    })
    setIsAddingNew(false)
  }

  const updateQuestion = () => {
    if (!editingQuestion) return

    const validation = validateQuestion(editingQuestion)
    if (validation) {
      alert(validation)
      return
    }

    setQuestions((prev) => {
      const updatedQuestions = { ...prev }
      if (updatedQuestions[selectedLetter]) {
        updatedQuestions[selectedLetter] = updatedQuestions[selectedLetter].map((q) =>
          q.id === editingQuestion.id ? { ...editingQuestion } : q,
        )
      }
      return updatedQuestions
    })

    const questionIndex = questionsData.findIndex((q) => q.id === editingQuestion.id)
    if (questionIndex !== -1) {
      questionsData[questionIndex] = { ...editingQuestion }
    }

    setEditingQuestion(null)
    alert("Pregunta actualizada correctamente")
  }

  const deleteQuestion = (questionToDelete: Question) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta pregunta?")) {
      setQuestions((prev) => ({
        ...prev,
        [selectedLetter]: prev[selectedLetter]?.filter((q) => q !== questionToDelete) || [],
      }))
    }
  }

  const importQuestions = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedQuestions = JSON.parse(e.target?.result as string)
        setQuestions(importedQuestions)
        alert("Preguntas importadas exitosamente")
      } catch (error) {
        alert("Error al importar el archivo. Asegúrate de que sea un JSON válido.")
      }
    }
    reader.readAsText(file)
  }

  const exportQuestions = () => {
    const dataStr = JSON.stringify(questions, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "preguntas-pasapalabra.json"
    link.click()
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => (window.location.href = "/")} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver al Menú
          </Button>
          <h2 className="text-2xl font-bold">Administrador de Preguntas</h2>
        </div>

        <div className="flex border-b">
          <button
            className={`px-4 py-2 font-medium ${activeTab === "questions" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("questions")}
          >
            Preguntas ({Object.values(questions).flat().length})
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === "pending" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("pending")}
          >
            Pendientes ({pendingQuestions.length})
          </button>
        </div>
      </div>

      {activeTab === "questions" && (
        <>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
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
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button onClick={() => setIsAddingNew(true)} disabled={isAddingNew} className="w-full sm:w-auto">
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

          {isAddingNew && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Nueva Pregunta - Letra {selectedLetter}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Pregunta</label>
                  <Textarea
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion((prev) => ({ ...prev, question: e.target.value }))}
                    placeholder="Escribe la pregunta..."
                    rows={3}
                    className="resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Respuesta (debe empezar con {selectedLetter})
                  </label>
                  <Input
                    value={newQuestion.answer}
                    onChange={(e) => setNewQuestion((prev) => ({ ...prev, answer: e.target.value }))}
                    placeholder={`Respuesta que empiece con ${selectedLetter}...`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Dificultad</label>
                    <Select
                      value={newQuestion.difficulty}
                      onValueChange={(value) =>
                        setNewQuestion((prev) => ({ ...prev, difficulty: value as Difficulty }))
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
                      value={newQuestion.category}
                      onChange={(e) => setNewQuestion((prev) => ({ ...prev, category: e.target.value }))}
                      placeholder="Categoría..."
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={saveQuestion} className="w-full sm:w-auto">
                    <Save className="w-4 h-4 mr-2" />
                    Guardar
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingNew(false)} className="w-full sm:w-auto">
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {filteredQuestions.map((question, index) => (
              <Card key={index}>
                <CardContent className="p-3 sm:p-4">
                  {editingQuestion === question ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Pregunta</label>
                        <Textarea
                          value={editingQuestion.question}
                          onChange={(e) =>
                            setEditingQuestion((prev) => (prev ? { ...prev, question: e.target.value } : null))
                          }
                          rows={3}
                          className="resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Respuesta</label>
                        <Input
                          value={editingQuestion.answer}
                          onChange={(e) =>
                            setEditingQuestion((prev) => (prev ? { ...prev, answer: e.target.value } : null))
                          }
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Select
                          value={editingQuestion.difficulty}
                          onValueChange={(value) =>
                            setEditingQuestion((prev) => (prev ? { ...prev, difficulty: value as Difficulty } : null))
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

                        <Input
                          value={editingQuestion.category}
                          onChange={(e) =>
                            setEditingQuestion((prev) => (prev ? { ...prev, category: e.target.value } : null))
                          }
                          placeholder="Categoría..."
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button onClick={updateQuestion} size="sm" className="w-full sm:w-auto">
                          <Save className="w-4 h-4 mr-2" />
                          Guardar
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setEditingQuestion(null)}
                          size="sm"
                          className="w-full sm:w-auto"
                        >
                          <X className="w-4 h-4" />
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
                          <Badge variant="outline">{question.category}</Badge>
                        </div>
                        <p className="font-medium mb-1 break-words">{question.question}</p>
                        <p className="text-green-600 font-semibold break-words">→ {question.answer}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button variant="outline" size="sm" onClick={() => setEditingQuestion(question)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deleteQuestion(question)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredQuestions.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                No hay preguntas para la letra {selectedLetter}
                {searchTerm && " que coincidan con la búsqueda"}
              </CardContent>
            </Card>
          )}
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
  )
}
