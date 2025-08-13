import { supabase } from "./client"
import type { Question } from "./client"
import { questionsDatabase } from "../questions-data"

export async function syncQuestionsToSupabase() {
  try {
    // Convertir el objeto questionsDatabase a array
    const questionsArray: Question[] = []

    Object.entries(questionsDatabase).forEach(([letter, questions]) => {
      (Array.isArray(questions) ? questions : [questions]).forEach((q) => {
        questionsArray.push({
          letter,
          question: q.question,
          answer: q.answer,
          difficulty: q.difficulty,
          category: q.category,
        })
      })
    })

    // Insertar preguntas en Supabase (ignorar duplicados)
    if (!supabase) {
      console.error("Supabase client is not initialized.")
      return false
    }
    const { error } = await supabase.from("questions").upsert(questionsArray, {
      onConflict: "letter,question",
      ignoreDuplicates: true,
    })

    if (error) {
      console.error("Error syncing questions to Supabase:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in syncQuestionsToSupabase:", error)
    return false
  }
}

export async function saveQuestionToSupabase(question: Question) {
  try {
    if (!supabase) {
      console.error("Supabase client is not initialized.")
      return false
    }
    const { error } = await supabase.from("questions").upsert([question], { onConflict: "letter,question" })

    if (error) {
      console.error("Error saving question to Supabase:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in saveQuestionToSupabase:", error)
    return false
  }
}

export async function deleteQuestionFromSupabase(id: string) {
  try {
    if (!supabase) {
      console.error("Supabase client is not initialized.")
      return false
    }
    const { error } = await supabase.from("questions").delete().eq("id", id)

    if (error) {
      console.error("Error deleting question from Supabase:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deleteQuestionFromSupabase:", error)
    return false
  }
}

export async function loadQuestionsFromSupabase() {
  try {
    if (!supabase) {
      console.error("Supabase client is not initialized.")
      return null
    }
    const { data, error } = await supabase.from("questions").select("*").order("letter", { ascending: true })

    if (error) {
      console.error("Error loading questions from Supabase:", error)
      return null
    }

    return data as Question[]
  } catch (error) {
    console.error("Error in loadQuestionsFromSupabase:", error)
    return null
  }
}
