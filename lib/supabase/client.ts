import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
