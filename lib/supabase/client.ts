import { createClient as createSupabaseClient } from "@supabase/supabase-js"
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Variables de entorno de Supabase faltantes:", {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey,
  })
}

export const supabase = supabaseUrl && supabaseAnonKey ? createSupabaseClient(supabaseUrl, supabaseAnonKey) : null

export const createClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Variables de entorno de Supabase no configuradas. Verifica NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY",
    )
  }
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

export type Question = {
  id?: string
  letter: string
  question: string
  answer: string
  difficulty: "facil" | "medio" | "dificil"
  category: string
  created_at?: string
  updated_at?: string
}
