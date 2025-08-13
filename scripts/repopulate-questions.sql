-- Limpiar tabla existente
DELETE FROM questions;

-- Insertar todas las preguntas
INSERT INTO questions (letter, question, answer, difficulty, category) VALUES
-- Letra A
('A', 'Conjunto de partículas minerales en la playa', 'Arena', 'facil', 'naturaleza'),
('A', 'Animal que vuela y tiene plumas', 'Ave', 'facil', 'animales'),
('A', 'Líquido transparente e incoloro esencial para la vida', 'Agua', 'facil', 'naturaleza'),
('A', 'Instrumento musical de cuerda pulsada', 'Arpa', 'medio', 'musica'),
('A', 'Capital de Grecia', 'Atenas', 'medio', 'geografia'),
('A', 'Sustancia que combate infecciones bacterianas', 'Antibiótico', 'dificil', 'medicina'),

-- Letra B
('B', 'Sitio poblado de árboles y matas', 'Bosque', 'facil', 'naturaleza'),
('B', 'Deporte que se juega con una pelota y dos aros elevados', 'Baloncesto', 'facil', 'deportes'),
('B', 'Embarcación para navegar', 'Barco', 'facil', 'transporte'),
('B', 'Escritor argentino autor de ''El Aleph'' y ''Ficciones''', 'Borges', 'dificil', 'literatura'),

-- Letra C
('C', 'Bebida fermentada de cebada', 'Cerveza', 'facil', 'comida'),
('C', 'Bebida caliente hecha con granos tostados', 'Café', 'facil', 'comida'),
('C', 'Vehículo de cuatro ruedas', 'Coche', 'facil', 'transporte'),
('C', 'Tejido flexible que recubre articulaciones y nariz', 'Cartílago', 'dificil', 'anatomia'),

-- Letra D
('D', 'Actor estadounidense protagonista de Titanic', 'DiCaprio', 'dificil', 'espectaculos'),
('D', 'Territorio arenoso o pedregoso con escasa vegetación', 'Desierto', 'facil', 'geografia'),
('D', 'Forma de gobierno donde el pueblo elige', 'Democracia', 'medio', 'politica'),
('D', 'Gas formado por carbono y oxígeno presente en respiración y combustión', 'Dióxido de carbono', 'dificil', 'quimica'),

-- Letra E
('E', 'Ocultación de un astro por otro', 'Eclipse', 'facil', 'astronomia'),
('E', 'Animal paquidermo con trompa', 'Elefante', 'facil', 'animales'),
('E', 'Lugar donde se enseña', 'Escuela', 'facil', 'educacion'),
('E', 'Conjunto de seres vivos y su entorno que interactúan', 'Ecosistema', 'dificil', 'ciencia'),

-- Letra F
('F', 'Deporte que se juega con los pies', 'Fútbol', 'facil', 'deportes'),
('F', 'Historia breve con enseñanza moral', 'Fábula', 'facil', 'literatura'),
('F', 'Red social más grande del mundo', 'Facebook', 'facil', 'tecnologia'),
('F', 'Proceso por el cual las plantas convierten luz en energía', 'Fotosíntesis', 'dificil', 'biologia'),

-- Letra G
('G', 'Animal doméstico que maúlla', 'Gato', 'facil', 'animales'),
('G', 'Deporte que se juega con palos y pelota pequeña', 'Golf', 'facil', 'deportes'),
('G', 'Buscador de internet más utilizado', 'Google', 'facil', 'tecnologia'),
('G', 'Masa de hielo en movimiento formada por acumulación de nieve', 'Glaciar', 'dificil', 'geografia'),

-- Letra H
('H', 'Postre frío hecho con leche y azúcar', 'Helado', 'facil', 'comida'),
('H', 'Lugar donde vive una familia', 'Hogar', 'facil', 'general'),
('H', 'Deporte que se juega sobre hielo', 'Hockey', 'medio', 'deportes'),
('H', 'Proteína de la sangre que transporta oxígeno', 'Hemoglobina', 'dificil', 'biologia'),

-- Letra I
('I', 'Aplicación móvil para compartir fotos', 'Instagram', 'facil', 'tecnologia'),
('I', 'Lugar donde se reza', 'Iglesia', 'facil', 'religion'),
('I', 'Estación del año más fría', 'Invierno', 'facil', 'naturaleza'),
('I', 'Aumento generalizado y sostenido de los precios', 'Inflación', 'dificil', 'economia'),

-- Letra J
('J', 'Lugar donde se cultivan plantas', 'Jardín', 'facil', 'naturaleza'),
('J', 'Profesión que administra justicia', 'Juez', 'medio', 'profesiones'),
('J', 'Cantante estadounidense ''King of Pop''', 'Jackson', 'medio', 'espectaculos'),
('J', 'Planeta más grande del sistema solar', 'Júpiter', 'dificil', 'astronomia'),

-- Letra K
('K', 'Unidad de peso de mil gramos', 'Kilogramo', 'facil', 'medidas'),
('K', 'Arte marcial japonés de golpes con manos y pies', 'Karate', 'medio', 'deportes'),
('K', 'Aderezo de tomate dulce y ácido', 'Ketchup', 'facil', 'comida'),
('K', 'Unidad de longitud equivalente a mil metros', 'Kilómetro', 'dificil', 'medidas'),

-- Letra L
('L', 'Animal que ruge en la selva', 'León', 'facil', 'animales'),
('L', 'Satélite natural de la Tierra', 'Luna', 'facil', 'astronomia'),
('L', 'Bebida blanca que dan las vacas', 'Leche', 'facil', 'comida'),
('L', 'Estructura de caminos complicados diseñada para confundir', 'Laberinto', 'medio', 'general'),
('L', 'Coordenada geográfica que indica la distancia al ecuador', 'Latitud', 'dificil', 'geografia'),

-- Letra M
('M', 'Fruto del manzano', 'Manzana', 'facil', 'comida'),
('M', 'Futbolista argentino apodado ''La Pulga''', 'Messi', 'medio', 'deportes'),
('M', 'Videojuego de construcción con bloques', 'Minecraft', 'facil', 'tecnologia'),
('M', 'Orgánulo celular encargado de producir energía', 'Mitocondria', 'dificil', 'biologia'),

-- Letra N
('N', 'Masa de vapor de agua suspendida en la atmósfera', 'Nube', 'facil', 'naturaleza'),
('N', 'Órgano del olfato', 'Nariz', 'facil', 'anatomia'),
('N', 'Plataforma de streaming de series y películas', 'Netflix', 'facil', 'tecnologia'),
('N', 'Gas que compone la mayor parte del aire', 'Nitrógeno', 'dificil', 'quimica'),

-- Letra O
('O', 'Órgano de los sentidos para oír', 'Oído', 'facil', 'anatomia'),
('O', 'Capital de Noruega', 'Oslo', 'medio', 'geografia'),
('O', 'Órganos de la vista', 'Ojos', 'facil', 'anatomia'),
('O', 'Trayectoria que sigue un cuerpo alrededor de otro por gravedad', 'Órbita', 'dificil', 'astronomia'),

-- Letra P
('P', 'Instrumento musical de teclas', 'Piano', 'medio', 'musica'),
('P', 'Animal doméstico fiel al hombre', 'Perro', 'facil', 'animales'),
('P', 'Comida italiana hecha con masa, salsa y queso', 'Pizza', 'facil', 'comida'),
('P', 'Supercontinente que existió hace cientos de millones de años', 'Pangea', 'dificil', 'geologia'),

-- Letra Q
('Q', 'Ciencia que estudia las sustancias', 'Química', 'medio', 'ciencia'),
('Q', 'Producto lácteo para untar', 'Queso', 'facil', 'comida'),
('Q', 'Capital de Ecuador', 'Quito', 'medio', 'geografia'),
('Q', 'Número mínimo de miembros necesarios para sesionar', 'Quórum', 'dificil', 'derecho'),

-- Letra R
('R', 'Animal roedor pequeño', 'Ratón', 'facil', 'animales'),
('R', 'Corriente de agua natural', 'Río', 'facil', 'naturaleza'),
('R', 'Capital de Italia', 'Roma', 'medio', 'geografia'),
('R', 'Energía que se propaga en forma de ondas o partículas', 'Radiación', 'dificil', 'fisica'),

-- Letra S
('S', 'Astro que da luz y calor', 'Sol', 'facil', 'astronomia'),
('S', 'Reptil que reptan sin patas', 'Serpiente', 'facil', 'animales'),
('S', 'Servicio de música en streaming', 'Spotify', 'facil', 'tecnologia'),
('S', 'Conexión funcional entre neuronas para transmitir señales', 'Sinapsis', 'dificil', 'biologia'),

-- Letra T
('T', 'Medio de transporte sobre rieles', 'Tren', 'facil', 'general'),
('T', 'Capital de Japón', 'Tokio', 'medio', 'geografia'),
('T', 'Animal felino con rayas', 'Tigre', 'facil', 'animales'),
('T', 'Instrumento que mide la temperatura', 'Termómetro', 'dificil', 'instrumentos'),

-- Letra U
('U', 'Vestimenta igual para todos en un grupo', 'Uniforme', 'facil', 'vestimenta'),
('U', 'Fruta morada en racimos', 'Uva', 'facil', 'comida'),
('U', 'Servicio de transporte por aplicación', 'Uber', 'facil', 'tecnologia'),
('U', 'Tipo de radiación electromagnética más energética que la luz violeta', 'Ultravioleta', 'dificil', 'fisica'),

-- Letra V
('V', 'Animal que da leche', 'Vaca', 'facil', 'animales'),
('V', 'Bebida alcohólica hecha de uvas', 'Vino', 'facil', 'comida'),
('V', 'Deporte de pelota con red alta', 'Voleibol', 'medio', 'deportes'),
('V', 'Sustancia que estimula defensas para prevenir enfermedades', 'Vacuna', 'dificil', 'medicina'),

-- Letra W
('W', 'Bebida alcohólica destilada de cereales', 'Whisky', 'medio', 'bebidas'),
('W', 'Red informática mundial', 'Web', 'facil', 'tecnologia'),
('W', 'Aplicación de mensajería para teléfonos', 'WhatsApp', 'facil', 'tecnologia'),
('W', 'Tecnología que permite conexión inalámbrica a internet', 'Wifi', 'dificil', 'tecnologia'),

-- Letra X
('X', 'Instrumento musical de percusión', 'Xilófono', 'medio', 'musica'),
('X', 'Consola de videojuegos de Microsoft', 'Xbox', 'medio', 'tecnologia'),
('X', 'Elemento químico noble usado en lámparas y flashes', 'Xenón', 'dificil', 'quimica'),

-- Letra Y
('Y', 'Plataforma de videos en línea más utilizada', 'YouTube', 'facil', 'tecnologia'),
('Y', 'Embarcación de recreo', 'Yate', 'medio', 'nautica'),
('Y', 'Parte central del huevo', 'Yema', 'medio', 'comida'),
('Y', 'Elemento químico usado como antiséptico y en la tiroides', 'Yodo', 'dificil', 'quimica'),

-- Letra Z
('Z', 'Plataforma de videollamadas muy usada en pandemia', 'Zoom', 'facil', 'tecnologia'),
('Z', 'Calzado que cubre el pie', 'Zapato', 'facil', 'vestimenta'),
('Z', 'Lugar donde se exhiben animales', 'Zoológico', 'medio', 'lugares'),
('Z', 'Rama de la biología que estudia a los animales', 'Zoología', 'dificil', 'biologia');
