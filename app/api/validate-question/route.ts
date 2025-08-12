import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { question, answer, letter, difficulty } = await request.json()

    if (!question || !answer || !letter) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const validationPrompt = `
Eres un experto en el juego Pasapalabra. Valida la siguiente pregunta:

PREGUNTA: "${question}"
RESPUESTA: "${answer}"
LETRA: ${letter}
DIFICULTAD: ${difficulty}

Evalúa los siguientes criterios:

1. FORMATO: ¿La pregunta está bien formulada y es clara?
2. RESPUESTA: ¿La respuesta es correcta y comienza con la letra "${letter}"?
3. DIFICULTAD: ¿La dificultad es apropiada para el nivel "${difficulty}"?
4. CONTENIDO: ¿Es apropiada para todas las edades y culturalmente neutral?
5. ORIGINALIDAD: ¿Es una pregunta interesante y no demasiado obvia?

Responde en formato JSON con esta estructura:
{
  "isValid": boolean,
  "score": number (0-100),
  "feedback": "explicación detallada",
  "suggestions": ["sugerencia1", "sugerencia2"],
  "correctedAnswer": "respuesta corregida si es necesario"
}

Si la pregunta es válida, isValid debe ser true y score alto (80+).
Si hay problemas menores, isValid puede ser true pero con score medio (60-79) y sugerencias.
Si hay problemas graves, isValid debe ser false con score bajo (<60).
`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: validationPrompt,
      temperature: 0.3,
    })

    // Parse the AI response
    let validation
    try {
      validation = JSON.parse(text)
    } catch (parseError) {
      // Fallback if AI doesn't return valid JSON
      validation = {
        isValid: false,
        score: 0,
        feedback: "Error al procesar la validación con IA",
        suggestions: ["Intenta reformular la pregunta"],
        correctedAnswer: answer,
      }
    }

    return NextResponse.json(validation)
  } catch (error) {
    console.error("Error validating question:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
