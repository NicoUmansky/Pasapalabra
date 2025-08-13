import { supabase } from "./client"
import type { Question } from "../game-types"

// Browser-compatible version - uses localStorage instead of fs
// and removes Node.js specific dependencies

export async function downloadQuestionsFromSupabase(): Promise<Question[]> {
  try {
    console.log("Descargando preguntas desde Supabase...")

    if (!supabase) {
      throw new Error("Supabase client is not initialized.");
    }
    
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .order("letter", { ascending: true })

    if (error) {
      console.error("Error descargando preguntas desde Supabase:", error)
      throw error
    }

    if (!data || data.length === 0) {
      console.warn("No se encontraron preguntas en Supabase")
      return []
    }

    // Convertir a formato Question
    const questions: Question[] = data.map((item: any) => ({
      id: item.id || `${item.letter}${Math.random().toString(36).substr(2, 9)}`,
      letter: item.letter,
      question: item.question,
      answer: item.answer,
      difficulty: item.difficulty || "medio",
      category: item.category || "general"
    }))

    console.log(`Se descargaron ${questions.length} preguntas desde Supabase`)
    return questions
  } catch (error) {
    console.error("Error en downloadQuestionsFromSupabase:", error)
    throw error
  }
}

// Browser-compatible storage using localStorage
export function saveQuestionsToLocalStorage(questions: Question[]): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem("questions-from-supabase", JSON.stringify(questions))
      console.log("Preguntas guardadas en localStorage")
    }
  } catch (error) {
    console.error("Error guardando preguntas en localStorage:", error)
  }
}

export function loadQuestionsFromLocalStorage(): Question[] {
  try {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("questions-from-supabase")
      if (saved) {
        return JSON.parse(saved) as Question[]
      }
    }
    return []
  } catch (error) {
    console.error("Error cargando preguntas desde localStorage:", error)
    return []
  }
}

export async function syncQuestionsOnce(): Promise<Question[]> {
  try {
    // Check if we have questions in localStorage
    const localQuestions = loadQuestionsFromLocalStorage()
    
    if (localQuestions.length > 0) {
      console.log("Preguntas cargadas desde localStorage")
      return localQuestions
    }

    // If no local questions, download from Supabase
    console.log("Sincronizando preguntas desde Supabase...")
    const questions = await downloadQuestionsFromSupabase()
    
    if (questions.length > 0) {
      saveQuestionsToLocalStorage(questions)
    }

    return questions
  } catch (error) {
    console.error("Error en sincronización:", error)
    return []
  }
}

export function updateLocalQuestions(questions: Question[]): void {
  saveQuestionsToLocalStorage(questions)
}
