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
import { supabaseSync } from "@/lib/supabase/sync"
import { validateQuestion } from "@/lib/validation" // Import the validateQuestion function

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
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [modifiedQuestions, setModifiedQuestions] = useState<Set<string>>(new Set())
  const [deletedQuestions, setDeletedQuestions] = useState<Set<string>>(new Set())

  const importQuestions = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const questionsData = JSON.parse(e.target?.result as string)
        setQuestions(questionsData)
        localStorage.setItem("questionsDatabase", JSON.stringify(questionsData))
        setHasUnsavedChanges(true)
      }
      reader.readAsText(file)
    }
  }

  const exportQuestions = async () => {
    try {
      const allQuestions = await supabaseSync.exportAllQuestions()
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allQuestions))
      const downloadAnchorNode = document.createElement("a")
      downloadAnchorNode.setAttribute("href", dataStr)
      downloadAnchorNode.setAttribute("download", "questions-supabase.json")
      document.body.appendChild(downloadAnchorNode)
      downloadAnchorNode.click()
      downloadAnchorNode.remove()
    } catch (error) {
      console.error("Error exportando:", error)
      alert("Error al exportar las preguntas")
    }
  }

  const saveAllChanges = async () => {
    if (!hasUnsavedChanges) {
      alert("No hay cambios para guardar")
      return
    }

    setIsSaving(true)
    try {
      for (const questionId of deletedQuestions) {
        await supabaseSync.deleteQuestion(questionId)
      }

      for (const questionId of modifiedQuestions) {
        let foundQuestion: Question | null = null
        for (const letter in questions) {
          const question = questions[letter].find((q) => q.id === questionId)
          if (question) {
            foundQuestion = question
            break
          }
        }

        if (foundQuestion) {
          await supabaseSync.updateQuestion(foundQuestion)
        }
      }

      const success = await supabaseSync.syncToSupabase(questions)

      if (success) {
        setModifiedQuestions(new Set())
        setDeletedQuestions(new Set())
        setHasUnsavedChanges(false)

        localStorage.removeItem("modifiedQuestions")
        localStorage.removeItem("deletedQuestions")

        alert("Todos los cambios han sido guardados en la base de datos")
      } else {
        alert("Error al guardar en la base de datos. Los cambios se mantienen localmente.")
      }
    } catch (error) {
      console.error("Error guardando cambios:", error)
      alert("Error al guardar los cambios")
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question)
  }

  const handleSaveEdit = async (updatedQuestion: Question) => {
    const newQuestions = { ...questions }
    const letterQuestions = newQuestions[updatedQuestion.letter] || []
    const questionIndex = letterQuestions.findIndex((q) => q.id === updatedQuestion.id)

    if (questionIndex !== -1) {
      const newModified = new Set(modifiedQuestions)
      newModified.add(updatedQuestion.id)
      setModifiedQuestions(newModified)

      letterQuestions[questionIndex] = updatedQuestion
      setQuestions(newQuestions)
      setEditingQuestion(null)
      setHasUnsavedChanges(true)

      localStorage.setItem("questionsDatabase", JSON.stringify(newQuestions))
      localStorage.setItem("modifiedQuestions", JSON.stringify(Array.from(newModified)))
      alert("Pregunta actualizada. Presiona 'GUARDAR' para sincronizar con la base de datos.")
    }
  }

  const handleDeleteQuestion = (questionId: string, letter: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta pregunta?")) {
      const newDeleted = new Set(deletedQuestions)
      newDeleted.add(questionId)
      setDeletedQuestions(newDeleted)

      const newQuestions = { ...questions }
      newQuestions[letter] = newQuestions[letter].filter((q) => q.id !== questionId)
      setQuestions(newQuestions)
      setHasUnsavedChanges(true)

      localStorage.setItem("questionsDatabase", JSON.stringify(newQuestions))
      localStorage.setItem("deletedQuestions", JSON.stringify(Array.from(newDeleted)))
      alert("Pregunta eliminada. Presiona 'GUARDAR' para sincronizar con la base de datos.")
    }
  }

  const saveQuestion = async () => {
    const validation = validateQuestion(editingQuestion)
    if (validation) {
      alert(validation)
      return
    }

    const questionToSave: Question = {
      question: editingQuestion?.question!.trim(),
      answer: editingQuestion?.answer!.trim(),
      difficulty: editingQuestion?.difficulty as Difficulty,
      category: editingQuestion?.category || "general",
      letter: selectedLetter,
      id: Date.now().toString(),
    }

    const newQuestions = {
      ...questions,
      [selectedLetter]: [...(questions[selectedLetter] || []), questionToSave],
    }

    setQuestions(newQuestions)
    setEditingQuestion(null)
    setHasUnsavedChanges(true)

    localStorage.setItem("questionsDatabase", JSON.stringify(newQuestions))
    alert("Pregunta agregada. Presiona 'GUARDAR' para sincronizar con la base de datos.")
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
    setHasUnsavedChanges(true)
  }

  const rejectPendingQuestion = (pendingQuestion: PendingQuestion) => {
    setPendingQuestions((prev) => prev.filter((q) => q.id !== pendingQuestion.id))
    localStorage.setItem(
      "pendingQuestions",
      JSON.stringify(pendingQuestions.filter((q) => q.id !== pendingQuestion.id)),
    )
    setHasUnsavedChanges(true)
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

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        await supabaseSync.initializeSync()

        const savedQuestions = localStorage.getItem("questionsDatabase")
        if (savedQuestions) {
          setQuestions(JSON.parse(savedQuestions))
        }

        const savedPending = localStorage.getItem("pendingQuestions")
        if (savedPending) {
          setPendingQuestions(JSON.parse(savedPending))
        }

        const savedModified = localStorage.getItem("modifiedQuestions")
        if (savedModified) {
          setModifiedQuestions(new Set(JSON.parse(savedModified)))
        }

        const savedDeleted = localStorage.getItem("deletedQuestions")
        if (savedDeleted) {
          setDeletedQuestions(new Set(JSON.parse(savedDeleted)))
        }

        if (savedModified || savedDeleted) {
          setHasUnsavedChanges(true)
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-6 border-b border-gray-200 dark:border-gray-700 gap-3 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
            <h2 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-gray-100 truncate">
              Gestor de Preguntas - Admin
            </h2>
            {hasUnsavedChanges && (
              <Badge variant="outline" className="bg-orange-100 text-orange-800 text-xs sm:text-sm flex-shrink-0">
                Cambios sin guardar
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              onClick={saveAllChanges}
              disabled={!hasUnsavedChanges || isSaving}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold flex-1 sm:flex-none text-sm sm:text-base"
            >
              {isSaving ? "Guardando..." : "GUARDAR"}
            </Button>
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 sm:gap-2 bg-transparent text-xs sm:text-sm"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Volver</span>
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={onClose} className="p-1 sm:p-2">
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>

        <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(95vh-120px)] sm:max-h-[calc(90vh-80px)]">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
              <Select value={selectedLetter} onValueChange={setSelectedLetter}>
                <SelectTrigger className="w-full sm:w-20">
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
                className="w-full sm:flex-1"
              />

              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-full sm:w-32">
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
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
                className="w-full text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Pregunta
              </Button>
              <input type="file" accept=".json" onChange={importQuestions} ref={fileInputRef} className="hidden" />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full text-sm sm:text-base"
              >
                <Upload className="w-4 h-4 mr-2" />
                Importar
              </Button>
              <Button
                variant="outline"
                onClick={exportQuestions}
                className="w-full bg-transparent text-sm sm:text-base"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Estadísticas - Letra {selectedLetter}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-green-600">
                    {questions[selectedLetter]?.filter((q) => q.difficulty === "facil").length || 0}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Fácil</div>
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-yellow-600">
                    {questions[selectedLetter]?.filter((q) => q.difficulty === "medio").length || 0}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Medio</div>
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-red-600">
                    {questions[selectedLetter]?.filter((q) => q.difficulty === "dificil").length || 0}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Difícil</div>
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-blue-600">
                    {questions[selectedLetter]?.length || 0}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Total</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {activeTab === "questions" && (
            <div className="space-y-3 sm:space-y-4">
              {filteredQuestions.map((question) => (
                <Card key={question.id} className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0 w-full sm:w-auto">
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {question.difficulty}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {question.category}
                        </Badge>
                      </div>
                      <p className="font-medium mb-1 text-sm sm:text-base break-words">{question.question}</p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 break-words">
                        Respuesta: <span className="font-medium">{question.answer}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditQuestion(question)}
                        className="flex items-center gap-1 flex-1 sm:flex-none text-xs sm:text-sm"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Editar</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteQuestion(question.id, question.letter)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700 flex-1 sm:flex-none text-xs sm:text-sm"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Eliminar</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              {filteredQuestions.length === 0 && (
                <Card>
                  <CardContent className="p-6 sm:p-8 text-center text-gray-500 text-sm sm:text-base">
                    No hay preguntas para la letra {selectedLetter}
                    {searchTerm && " que coincidan con la búsqueda"}
                  </CardContent>
                </Card>
              )}
            </div>
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-60">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-4">
                  {editingQuestion.id ? "Editar Pregunta" : "Nueva Pregunta"}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Pregunta</label>
                    <Textarea
                      value={editingQuestion.question}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, question: e.target.value })}
                      placeholder="Escribe la pregunta..."
                      rows={3}
                      className="resize-none text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Respuesta</label>
                    <Input
                      value={editingQuestion.answer}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, answer: e.target.value })}
                      placeholder={`Respuesta que empiece con ${selectedLetter}...`}
                      className="text-sm sm:text-base"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Dificultad</label>
                      <Select
                        value={editingQuestion.difficulty}
                        onValueChange={(value) =>
                          setEditingQuestion({ ...editingQuestion, difficulty: value as Difficulty })
                        }
                      >
                        <SelectTrigger className="text-sm sm:text-base">
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
                        className="text-sm sm:text-base"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setEditingQuestion(null)} className="w-full sm:w-auto">
                      Cancelar
                    </Button>
                    <Button onClick={saveQuestion} className="w-full sm:w-auto">
                      Guardar Cambios
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
