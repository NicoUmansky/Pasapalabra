-- Remover la constraint UNIQUE de la columna answer
-- porque es normal que diferentes preguntas tengan la misma respuesta
ALTER TABLE questions DROP CONSTRAINT IF EXISTS unique_answer;

-- Agregar un índice para mejorar performance en búsquedas por respuesta
-- pero sin restricción de unicidad
CREATE INDEX IF NOT EXISTS idx_questions_answer ON questions(answer);

-- Opcional: Agregar constraint única en la combinación de pregunta y respuesta
-- para evitar preguntas exactamente duplicadas
ALTER TABLE questions ADD CONSTRAINT unique_question_answer 
UNIQUE (question, answer) ON CONFLICT DO NOTHING;
