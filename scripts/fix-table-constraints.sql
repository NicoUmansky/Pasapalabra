-- Eliminar constraint problemática si existe
ALTER TABLE questions DROP CONSTRAINT IF EXISTS unique_answer;

-- Crear constraint única compuesta para evitar duplicados exactos
ALTER TABLE questions ADD CONSTRAINT unique_question_answer 
UNIQUE (letter, question, answer);

-- Repoblar tabla con todas las preguntas
TRUNCATE TABLE questions RESTART IDENTITY;

-- Insertar todas las preguntas (este script incluye todas las preguntas del JSON)
INSERT INTO questions (letter, question, answer, difficulty, category) VALUES
-- Letra A
('A', 'Animal mamífero que vive en el agua', 'Ballena', 'facil', 'animales'),
('A', 'Fruto del manzano', 'Manzana', 'facil', 'naturaleza'),
('A', 'Color que resulta de mezclar rojo y amarillo', 'Naranja', 'facil', 'general'),
('A', 'Instrumento musical de cuerda', 'Arpa', 'medio', 'musica'),
('A', 'Capital de Argentina', 'Buenos Aires', 'medio', 'geografia'),
('A', 'Ciencia que estudia los astros', 'Astronomia', 'dificil', 'ciencia'),

-- Letra B
('B', 'Deporte que se juega con una pelota naranja', 'Basquet', 'facil', 'deportes'),
('B', 'Animal que produce miel', 'Abeja', 'facil', 'animales'),
('B', 'Lugar donde se guardan libros', 'Biblioteca', 'facil', 'general'),
('B', 'Instrumento musical de viento', 'Trompeta', 'medio', 'musica'),
('B', 'Capital de Brasil', 'Brasilia', 'medio', 'geografia'),
('B', 'Ciencia que estudia los seres vivos', 'Biologia', 'dificil', 'ciencia'),

-- Letra C
('C', 'Animal felino doméstico', 'Gato', 'facil', 'animales'),
('C', 'Fruto cítrico amarillo', 'Limon', 'facil', 'naturaleza'),
('C', 'Vehículo de cuatro ruedas', 'Coche', 'facil', 'general'),
('C', 'Instrumento musical de teclas', 'Piano', 'medio', 'musica'),
('C', 'Capital de Chile', 'Santiago', 'medio', 'geografia'),
('C', 'Elemento químico con símbolo C', 'Carbono', 'dificil', 'ciencia'),

-- Letra D
('D', 'Animal doméstico fiel al hombre', 'Perro', 'facil', 'animales'),
('D', 'Fruto dulce del desierto', 'Datil', 'facil', 'naturaleza'),
('D', 'Juego de mesa con fichas numeradas', 'Domino', 'facil', 'general'),
('D', 'Instrumento musical de percusión', 'Bateria', 'medio', 'musica'),
('D', 'Capital de Dinamarca', 'Copenhague', 'medio', 'geografia'),
('D', 'Unidad de medida de la densidad', 'Densidad', 'dificil', 'ciencia'),

-- Letra E
('E', 'Animal paquidermo con trompa', 'Elefante', 'facil', 'animales'),
('E', 'Fruto rojo pequeño', 'Fresa', 'facil', 'naturaleza'),
('E', 'Aparato para subir pisos', 'Ascensor', 'facil', 'general'),
('E', 'Deporte de motor más famoso del mundo', 'Formula1', 'medio', 'deportes'),
('E', 'Capital de España', 'Madrid', 'medio', 'geografia'),
('E', 'Partícula con carga negativa', 'Electron', 'dificil', 'ciencia'),

-- Letra F
('F', 'Fruto amarillo alargado', 'Platano', 'facil', 'naturaleza'),
('F', 'Deporte que se juega con los pies', 'Futbol', 'facil', 'deportes'),
('F', 'Instrumento musical de viento', 'Flauta', 'medio', 'musica'),
('F', 'Capital de Francia', 'Paris', 'medio', 'geografia'),
('F', 'Fuerza que atrae los objetos hacia la Tierra', 'Gravedad', 'dificil', 'ciencia'),

-- Letra G
('G', 'Animal felino grande', 'Leon', 'facil', 'animales'),
('G', 'Fruto de la vid', 'Uva', 'facil', 'naturaleza'),
('G', 'Instrumento musical de cuerda', 'Guitarra', 'medio', 'musica'),
('G', 'Capital de Grecia', 'Atenas', 'medio', 'geografia'),
('G', 'Gas noble más abundante', 'Argon', 'dificil', 'ciencia'),

-- Letra H
('H', 'Órgano que bombea sangre', 'Corazon', 'facil', 'anatomia'),
('H', 'Fruto seco comestible', 'Nuez', 'facil', 'naturaleza'),
('H', 'Lugar donde se alojan huéspedes', 'Hotel', 'facil', 'general'),
('H', 'Instrumento musical de cuerda', 'Arpa', 'medio', 'musica'),
('H', 'Capital de Hungría', 'Budapest', 'medio', 'geografia'),
('H', 'Elemento químico más ligero', 'Hidrogeno', 'dificil', 'ciencia'),

-- Letra I
('I', 'Órgano de la digestión', 'Intestino', 'facil', 'anatomia'),
('I', 'Fruto cítrico naranja', 'Naranja', 'facil', 'naturaleza'),
('I', 'Lugar donde se enseña', 'Escuela', 'facil', 'general'),
('I', 'Deporte de combate japonés', 'Judo', 'medio', 'deportes'),
('I', 'Capital de Italia', 'Roma', 'medio', 'geografia'),
('I', 'Elemento químico con símbolo I', 'Yodo', 'dificil', 'ciencia'),

-- Letra J
('J', 'Deporte que se juega en equipo', 'Futbol', 'facil', 'deportes'),
('J', 'Animal que salta mucho', 'Canguro', 'facil', 'animales'),
('J', 'Piedra preciosa verde', 'Esmeralda', 'medio', 'general'),
('J', 'Instrumento musical de viento', 'Saxofon', 'medio', 'musica'),
('J', 'Capital de Japón', 'Tokio', 'medio', 'geografia'),
('J', 'Unidad de energía', 'Julio', 'dificil', 'ciencia'),

-- Letra K
('K', 'Unidad de peso', 'Kilogramo', 'facil', 'general'),
('K', 'Animal marsupial australiano', 'Koala', 'facil', 'animales'),
('K', 'Deporte de artes marciales', 'Karate', 'medio', 'deportes'),
('K', 'Capital de Kenia', 'Nairobi', 'medio', 'geografia'),
('K', 'Elemento químico alcalino', 'Potasio', 'dificil', 'ciencia'),

-- Letra L
('L', 'Animal felino salvaje', 'Leon', 'facil', 'animales'),
('L', 'Fruto cítrico amarillo', 'Limon', 'facil', 'naturaleza'),
('L', 'Estructura con caminos complicados', 'Laberinto', 'medio', 'general'),
('L', 'Instrumento musical de cuerda', 'Laud', 'medio', 'musica'),
('L', 'Capital de Inglaterra', 'Londres', 'medio', 'geografia'),
('L', 'Elemento químico más ligero', 'Litio', 'dificil', 'ciencia'),

-- Letra M
('M', 'Animal que da leche', 'Vaca', 'facil', 'animales'),
('M', 'Fruto dulce y jugoso', 'Melon', 'facil', 'naturaleza'),
('M', 'Vehículo de dos ruedas', 'Motocicleta', 'facil', 'general'),
('M', 'Instrumento musical de cuerda', 'Mandolina', 'medio', 'musica'),
('M', 'Capital de México', 'Ciudad de Mexico', 'medio', 'geografia'),
('M', 'Unidad de longitud', 'Metro', 'dificil', 'ciencia'),

-- Letra N
('N', 'Órgano del olfato', 'Nariz', 'facil', 'anatomia'),
('N', 'Fruto seco comestible', 'Nuez', 'facil', 'naturaleza'),
('N', 'Embarcación grande', 'Barco', 'facil', 'general'),
('N', 'Instrumento musical de viento', 'Oboe', 'medio', 'musica'),
('N', 'Capital de Noruega', 'Oslo', 'medio', 'geografia'),
('N', 'Elemento químico gaseoso', 'Nitrogeno', 'dificil', 'ciencia'),

-- Letra O
('O', 'Órgano de la vista', 'Ojo', 'facil', 'anatomia'),
('O', 'Fruto del olivo', 'Aceituna', 'facil', 'naturaleza'),
('O', 'Metal precioso amarillo', 'Oro', 'facil', 'general'),
('O', 'Instrumento musical de viento', 'Oboe', 'medio', 'musica'),
('O', 'Capital de Canadá', 'Ottawa', 'medio', 'geografia'),
('O', 'Elemento químico gaseoso', 'Oxigeno', 'dificil', 'ciencia'),

-- Letra P
('P', 'Animal que vuela', 'Pajaro', 'facil', 'animales'),
('P', 'Fruto dulce y jugoso', 'Pera', 'facil', 'naturaleza'),
('P', 'Utensilio para escribir', 'Lapiz', 'facil', 'general'),
('P', 'Instrumento musical de teclas', 'Piano', 'medio', 'musica'),
('P', 'Capital de Perú', 'Lima', 'medio', 'geografia'),
('P', 'Elemento químico del grupo 15', 'Fosforo', 'dificil', 'ciencia'),

-- Letra Q
('Q', 'Alimento lácteo', 'Queso', 'facil', 'comida'),
('Q', 'Ciencia que estudia las sustancias', 'Quimica', 'medio', 'ciencia'),
('Q', 'Capital de Ecuador', 'Quito', 'medio', 'geografia'),
('Q', 'Unidad de calor', 'Caloria', 'dificil', 'ciencia'),

-- Letra R
('R', 'Animal roedor pequeño', 'Raton', 'facil', 'animales'),
('R', 'Fruto rojo pequeño', 'Frambuesa', 'facil', 'naturaleza'),
('R', 'Aparato que recibe ondas', 'Radio', 'facil', 'tecnologia'),
('R', 'Deporte de raqueta', 'Tenis', 'medio', 'deportes'),
('R', 'Capital de Italia', 'Roma', 'medio', 'geografia'),
('R', 'Gas noble radioactivo', 'Radon', 'dificil', 'ciencia'),

-- Letra S
('S', 'Animal reptil sin patas', 'Serpiente', 'facil', 'animales'),
('S', 'Fruto dulce de verano', 'Sandia', 'facil', 'naturaleza'),
('S', 'Mueble para sentarse', 'Silla', 'facil', 'general'),
('S', 'Instrumento musical de cuerda', 'Saxofon', 'medio', 'musica'),
('S', 'Capital de Suecia', 'Estocolmo', 'medio', 'geografia'),
('S', 'Elemento químico amarillo', 'Azufre', 'dificil', 'ciencia'),

-- Letra T
('T', 'Animal felino rayado', 'Tigre', 'facil', 'animales'),
('T', 'Fruto rojo del verano', 'Tomate', 'facil', 'naturaleza'),
('T', 'Aparato de comunicación', 'Telefono', 'facil', 'tecnologia'),
('T', 'Baile típico de Argentina', 'Tango', 'medio', 'cultura'),
('T', 'Capital de Turquía', 'Ankara', 'medio', 'geografia'),
('T', 'Elemento químico de transición', 'Titanio', 'dificil', 'ciencia'),

-- Letra U
('U', 'Fruto morado pequeño', 'Uva', 'facil', 'naturaleza'),
('U', 'Instrumento musical de cuerda', 'Ukelele', 'medio', 'musica'),
('U', 'Capital de Uruguay', 'Montevideo', 'medio', 'geografia'),
('U', 'Elemento químico radioactivo', 'Uranio', 'dificil', 'ciencia'),

-- Letra V
('V', 'Animal que vuela de noche', 'Murcielago', 'facil', 'animales'),
('V', 'Fruto de la vid', 'Uva', 'facil', 'naturaleza'),
('V', 'Vehículo de transporte', 'Vehiculo', 'facil', 'general'),
('V', 'Instrumento musical de cuerda', 'Violin', 'medio', 'musica'),
('V', 'Capital de Venezuela', 'Caracas', 'medio', 'geografia'),
('V', 'Elemento químico de transición', 'Vanadio', 'dificil', 'ciencia'),

-- Letra W
('W', 'Deporte acuático', 'Waterpolo', 'medio', 'deportes'),
('W', 'Unidad de potencia', 'Watt', 'dificil', 'ciencia'),

-- Letra X
('X', 'Instrumento musical de percusión', 'Xilofon', 'medio', 'musica'),
('X', 'Gas noble', 'Xenon', 'dificil', 'ciencia'),

-- Letra Y
('Y', 'Embarcación de recreo', 'Yate', 'medio', 'general'),
('Y', 'Elemento químico de tierras raras', 'Ytrio', 'dificil', 'ciencia'),

-- Letra Z
('Z', 'Animal equino rayado', 'Cebra', 'facil', 'animales'),
('Z', 'Calzado que cubre el pie', 'Zapato', 'facil', 'general'),
('Z', 'Elemento químico de transición', 'Zinc', 'dificil', 'ciencia');
