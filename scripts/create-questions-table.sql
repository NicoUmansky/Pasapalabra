-- Create questions table for storing game questions
CREATE TABLE IF NOT EXISTS questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  letter VARCHAR(1) NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  difficulty VARCHAR(10) NOT NULL CHECK (difficulty IN ('facil', 'medio', 'dificil')),
  category VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_questions_letter ON questions(letter);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);

-- Enable Row Level Security
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since this is a game, no user-specific restrictions)
CREATE POLICY "Allow all operations on questions" ON questions
  FOR ALL USING (true);
