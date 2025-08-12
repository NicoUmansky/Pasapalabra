import { supabase } from "./client"
import type { Question } from "../game-types"
import fs from "fs"
import path from "path"

const QUESTIONS_FILE_PATH = path.join(process.cwd(), "lib", "questions-from-supabase.json")

export async function downloadQuestionsFromSupabase(): Promise<Question[]> {
  try {
    console.log("Descargando preguntas desde Supabase...")
    
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

export async function saveQuestionsToLocalFile(questions: Question[]): Promise<void> {
  try {
    // Crear el directorio si no existe
    const dir = path.dirname(QUESTIONS_FILE_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    // Guardar las preguntas en el archivo local
    fs.writeFileSync(QUESTIONS_FILE_PATH, JSON.stringify(questions, null, 2))
    console.log(`Preguntas guardadas en: ${QUESTIONS_FILE_PATH}`)
  } catch (error) {
    console.error("Error guardando preguntas en archivo local:", error)
    throw error
  }
}

export function loadQuestionsFromLocalFile(): Question[] {
  try {
    if (!fs.existsSync(QUESTIONS_FILE_PATH)) {
      console.warn("Archivo de preguntas local no encontrado, usando preguntas por defecto")
      return []
    }

    const fileContent = fs.readFileSync(QUESTIONS_FILE_PATH, "utf-8")
    const questions = JSON.parse(fileContent) as Question[]
    console.log(`Preguntas cargadas desde archivo local: ${questions.length}`)
    return questions
  } catch (error) {
    console.error("Error cargando preguntas desde archivo local:", error)
    return []
  }
}

export async function syncQuestionsOnce(): Promise<Question[]> {
  try {
    // Verificar si ya existe el archivo local
    if (fs.existsSync(QUESTIONS_FILE_PATH)) {
      console.log("Archivo de preguntas local ya existe, cargando desde ahí...")
      return loadQuestionsFromLocalFile()
    }

    // Si no existe, descargar desde Supabase y guardar localmente
    console.log("Primera vez sincronizando preguntas desde Supabase...")
    const questions = await downloadQuestionsFromSupabase()
    
    if (questions.length > 0) {
      await saveQuestionsToLocalFile(questions)
    }

    return questions
  } catch (error) {
    console.error("Error en sincronización única:", error)
    return []
  }
}

export function updateLocalQuestionsFile(questions: Question[]): void {
  try {
    saveQuestionsToLocalFile(questions)
    console.log("Archivo local de preguntas actualizado")
  } catch (error) {
    console.error("Error actualizando archivo local:", error)
  }
}
