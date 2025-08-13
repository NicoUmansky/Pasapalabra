export type GameDifficulty = "facil" | "medio" | "dificil" | "sorpresa"
export type GameMode = "individual" | "multijugador"
export type LetterStatus = "pending" | "correct" | "incorrect" | "skipped"
export type ResponseMode = "buttons" | "visible" | "input" | "voice"

export type Difficulty = GameDifficulty
export interface Question {
  question: string
  answer: string
  difficulty: Difficulty
  category?: string
}

export interface GameSettings {
  duration: number // en segundos
  difficulty: GameDifficulty
  mode: GameMode
  playerCount?: number
  responseMode?: ResponseMode
}

export interface LetterState {
  letter: string
  status: LetterStatus
  question?: string
  answer?: string
  userAnswer?: string
}

export interface GameState {
  currentLetter: string
  timeRemaining: number
  isPlaying: boolean
  isPaused: boolean
  letters: LetterState[]
  score: {
    correct: number
    incorrect: number
    skipped: number
    remaining: number
  }
  settings: GameSettings
}

export interface Player {
  id: string
  name: string
  score: {
    correct: number
    incorrect: number
    skipped: number
  }
  isActive: boolean
}

export interface MultiplayerGame extends GameState {
  players: Player[]
  currentPlayerIndex: number
  roundsCompleted: number
}
