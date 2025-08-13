import type { Question } from "./game-types"

export function validateQuestion(question: Partial<Question> | null): string | null {
  if (!question) return "La pregunta es requerida"
  if (!question.question?.trim()) return "La pregunta es requerida"
  if (!question.answer?.trim()) return "La respuesta es requerida"
  if (!question.letter) return "La letra es requerida"

  // Validar que la respuesta empiece con la letra correcta
  const firstLetter = question.answer.trim().charAt(0).toUpperCase()
  if (firstLetter !== question.letter.toUpperCase()) {
    return `La respuesta debe empezar con la letra ${question.letter.toUpperCase()}`
  }

  return null
}
