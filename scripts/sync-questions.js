const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Configuración de Supabase (debe estar en variables de entorno)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Variables de entorno de Supabase no configuradas')
  console.error('Asegúrate de tener NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY configuradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const QUESTIONS_FILE_PATH = path.join(__dirname, '..', 'lib', 'questions-from-supabase.json')

async function downloadQuestionsFromSupabase() {
  try {
    console.log('Descargando preguntas desde Supabase...')
    
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('letter', { ascending: true })

    if (error) {
      console.error('Error descargando preguntas desde Supabase:', error)
      throw error
    }

    if (!data || data.length === 0) {
      console.warn('No se encontraron preguntas en Supabase')
      return []
    }

    // Convertir a formato Question
    const questions = data.map((item) => ({
      id: item.id || `${item.letter}${Math.random().toString(36).substr(2, 9)}`,
      letter: item.letter,
      question: item.question,
      answer: item.answer,
      difficulty: item.difficulty || 'medio',
      category: item.category || 'general'
    }))

    console.log(`Se descargaron ${questions.length} preguntas desde Supabase`)
    return questions
  } catch (error) {
    console.error('Error en downloadQuestionsFromSupabase:', error)
    throw error
  }
}

async function saveQuestionsToLocalFile(questions) {
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
    console.error('Error guardando preguntas en archivo local:', error)
    throw error
  }
}

async function syncQuestionsOnce() {
  try {
    // Verificar si ya existe el archivo local
    if (fs.existsSync(QUESTIONS_FILE_PATH)) {
      console.log('Archivo de preguntas local ya existe, no se sobrescribirá')
      console.log('Si quieres forzar la sincronización, elimina el archivo:', QUESTIONS_FILE_PATH)
      return
    }

    // Si no existe, descargar desde Supabase y guardar localmente
    console.log('Primera vez sincronizando preguntas desde Supabase...')
    const questions = await downloadQuestionsFromSupabase()
    
    if (questions.length > 0) {
      await saveQuestionsToLocalFile(questions)
      console.log('✅ Sincronización completada exitosamente')
    } else {
      console.log('⚠️ No se pudieron descargar preguntas desde Supabase')
    }
  } catch (error) {
    console.error('❌ Error en sincronización:', error)
    process.exit(1)
  }
}

// Ejecutar la sincronización
syncQuestionsOnce()
