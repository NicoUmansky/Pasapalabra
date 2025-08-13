-- Eliminar la constraint única que está causando problemas
ALTER TABLE questions DROP CONSTRAINT IF EXISTS unique_answer;

-- Crear una constraint única compuesta que permita la misma respuesta para diferentes letras
ALTER TABLE questions ADD CONSTRAINT unique_letter_answer UNIQUE (letter, answer);
