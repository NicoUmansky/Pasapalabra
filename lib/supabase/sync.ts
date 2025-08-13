import { createClient } from "./client"
import { questionsDatabase } from "../questions-data"
import type { Question } from "../game-types"

export class SupabaseSync {
  private static instance: SupabaseSync
  private supabase = createClient()
  private isInitialized = false

  static getInstance(): SupabaseSync {
    if (!SupabaseSync.instance) {
      SupabaseSync.instance = new SupabaseSync()
    }
    return SupabaseSync.instance
  }

  async initializeSync(): Promise<void> {
    if (this.isInitialized) return

    try {
      console.log("Iniciando sincronización con Supabase...")

      // Verificar si hay datos en Supabase
      const { data: existingQuestions, error } = await this.supabase.from("questions").select("*").limit(1)

      if (error) {
        console.warn("Error conectando con Supabase, usando datos locales:", error)
        this.loadLocalData()
        return
      }

      if (!existingQuestions || existingQuestions.length === 0) {
        // Si no hay datos en Supabase, subir el JSON inicial
        console.log("No hay datos en Supabase, subiendo JSON inicial...")
        await this.uploadInitialData()
      } else {
        // Si hay datos en Supabase, descargarlos a memoria
        console.log("Descargando datos de Supabase a memoria...")
        await this.downloadFromSupabase()
      }

      this.isInitialized = true
      console.log("Sincronización completada")
    } catch (error) {
      console.error("Error en sincronización inicial:", error)
      this.loadLocalData()
    }
  }

  private loadLocalData(): void {
    const groupedQuestions = this.groupQuestionsByLetter(questionsDatabase)
    localStorage.setItem("questionsDatabase", JSON.stringify(groupedQuestions))
    localStorage.setItem("questionsArray", JSON.stringify(questionsDatabase))
  }

  private async uploadInitialData(): Promise<void> {
    try {
      const { error } = await this.supabase.from("questions").upsert(
        questionsDatabase.map((q) => ({
          letter: q.letter,
          question: q.question,
          answer: q.answer,
          difficulty: q.difficulty,
          category: q.category,
        })),
        {
          onConflict: "question,answer",
          ignoreDuplicates: true,
        },
      )

      if (error) {
        console.error("Error subiendo datos iniciales:", error)
        this.loadLocalData()
        return
      }

      // Actualizar datos locales
      const groupedQuestions = this.groupQuestionsByLetter(questionsDatabase)
      localStorage.setItem("questionsDatabase", JSON.stringify(groupedQuestions))
      localStorage.setItem("questionsArray", JSON.stringify(questionsDatabase))
    } catch (error) {
      console.error("Error en uploadInitialData:", error)
      this.loadLocalData()
    }
  }

  async downloadFromSupabase(): Promise<Question[]> {
    try {
      const { data: questions, error } = await this.supabase
        .from("questions")
        .select("*")
        .order("letter", { ascending: true })

      if (error) {
        console.error("Error descargando de Supabase:", error)
        return questionsDatabase
      }

      if (!questions || questions.length === 0) {
        return questionsDatabase
      }

      // Convertir datos de Supabase al formato local
      const localQuestions: Question[] = questions.map((q) => ({
        id: q.id,
        letter: q.letter,
        question: q.question,
        answer: q.answer,
        difficulty: q.difficulty,
        category: q.category,
      }))

      // Agrupar por letra y guardar en localStorage
      const groupedQuestions = this.groupQuestionsByLetter(localQuestions)
      localStorage.setItem("questionsDatabase", JSON.stringify(groupedQuestions))
      localStorage.setItem("questionsArray", JSON.stringify(localQuestions))

      return localQuestions
    } catch (error) {
      console.error("Error en downloadFromSupabase:", error)
      return questionsDatabase
    }
  }

  async syncToSupabase(questions: Record<string, Question[]>): Promise<boolean> {
    try {
      const questionsArray = Object.values(questions).flat()

      // Primero eliminar todas las preguntas existentes
      const { error: deleteError } = await this.supabase
        .from("questions")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000") // Usar UUID imposible para eliminar todo

      if (deleteError) {
        console.error("Error eliminando preguntas existentes:", deleteError)
        return false
      }

      const batchSize = 100
      for (let i = 0; i < questionsArray.length; i += batchSize) {
        const batch = questionsArray.slice(i, i + batchSize)

        const { error } = await this.supabase.from("questions").insert(
          batch.map((q) => ({
            letter: q.letter,
            question: q.question,
            answer: q.answer,
            difficulty: q.difficulty,
            category: q.category,
          })),
        )

        if (error) {
          console.error(`Error insertando lote ${i / batchSize + 1}:`, error)
          return false
        }
      }

      // Actualizar datos locales
      localStorage.setItem("questionsDatabase", JSON.stringify(questions))
      localStorage.setItem("questionsArray", JSON.stringify(questionsArray))

      console.log(`Sincronizadas ${questionsArray.length} preguntas con Supabase`)
      return true
    } catch (error) {
      console.error("Error en syncToSupabase:", error)
      return false
    }
  }

  async exportAllQuestions(): Promise<Question[]> {
    try {
      return await this.downloadFromSupabase()
    } catch (error) {
      console.error("Error exportando preguntas:", error)
      // Fallback a datos locales
      const localData = localStorage.getItem("questionsArray")
      return localData ? JSON.parse(localData) : questionsDatabase
    }
  }

  private groupQuestionsByLetter(questions: Question[]): Record<string, Question[]> {
    const grouped: Record<string, Question[]> = {}
    questions.forEach((question) => {
      const letter = question.letter.toUpperCase()
      if (!grouped[letter]) {
        grouped[letter] = []
      }
      grouped[letter].push(question)
    })
    return grouped
  }
}

// Instancia singleton
export const supabaseSync = SupabaseSync.getInstance()
