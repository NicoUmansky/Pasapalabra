export interface Question {
  id: string
  letter: string
  question: string
  answer: string
  difficulty: "facil" | "medio" | "dificil"
  category?: string
}

export const questionsDatabase: Question[] = [
  {"id":"cb36ccf4-13a9-45df-b6d6-dbf9131ca3bd","letter":"A","question":"Conjunto de partículas minerales en la playa","answer":"Arena","difficulty":"facil","category":"naturaleza"},
  {"id":"f24b821f-1198-47cf-96c0-7d8abc70b8e3","letter":"A","question":"Animal que vuela y tiene plumas","answer":"Ave","difficulty":"facil","category":"animales"},
  {"id":"aaa0ef87-c753-4471-86ae-ab9bb2d1cb3d","letter":"A","question":"Líquido transparente e incoloro esencial para la vida","answer":"Agua","difficulty":"facil","category":"naturaleza"},
  {"id":"1f238a7f-b27f-492e-95d0-a5be65175aa1","letter":"A","question":"Instrumento musical de cuerda pulsada","answer":"Arpa","difficulty":"medio","category":"musica"},
  {"id":"f9395723-7642-498d-b6c5-0563497ff815","letter":"A","question":"Capital de Grecia","answer":"Atenas","difficulty":"medio","category":"geografia"},
  {"id":"3cab1e04-6c29-455c-9bf3-8897ec9b4081","letter":"A","question":"Sustancia que combate infecciones bacterianas","answer":"Antibiótico","difficulty":"dificil","category":"medicina"},
  {"id":"3be3247e-13a4-4d9a-9a25-9ff4243d2b62","letter":"A","question":"Estructura con forma de almendra ubicada en el cerebro y en la garganta","answer":"Amigdala","difficulty":"dificil","category":"medicina "},
  {"id":"64ede135-37ea-480a-b075-7597f6eceb40","letter":"A","question":"Tipo de animal que puede vivir tanto en el agua como en la tierra","answer":"Anfibio","difficulty":"medio","category":"animales"},
  {"id":"ea7347e6-8701-4d2c-ab75-79a5b9b0fb29","letter":"A","question":"Persona que realiza saltos y piruetas en espectáculos","answer":"Acrobata","difficulty":"dificil","category":"general"},
  {"id":"9a4e2512-b225-4060-a646-7260e35569db","letter":"A","question":"Juego de estrategia con piezas blancas y negras","answer":"Ajedrez","difficulty":"medio","category":"general"},
  {"id":"c9d36437-5622-4b38-a175-fd61c8691dc7","letter":"A","question":"Sistema operativo en telefonos de Samsung, Google, Motorola, entre otros.","answer":"Android","difficulty":"dificil","category":"general"},
  {"id":"2d015f08-2b8e-480b-9bcd-973198a85d4a","letter":"B","question":"Sitio poblado de árboles y matas","answer":"Bosque","difficulty":"facil","category":"naturaleza"},
  {"id":"559767b3-229b-4921-9067-8e5663a3aab8","letter":"B","question":"Embarcación para navegar","answer":"Barco","difficulty":"facil","category":"transporte"},
  {"id":"f559442e-81f5-4567-8663-c6bdcb3e3db1","letter":"B","question":"Escritor argentino autor de 'El Aleph' y 'Ficciones'","answer":"Borges","difficulty":"dificil","category":"literatura"},
  {"id":"3a646e45-7aad-4898-9d8f-dd9d3664acd2","letter":"B","question":"Deporte en equipo que se usa una pelota anaranjada","answer":"Basquet","difficulty":"medio","category":"deportes"},
  {"id":"2becb690-297e-4110-8e68-e2f3e7b74bb1","letter":"B","question":"Deporte poco comun que se juega con raquetas y un volante","answer":"Badminton","difficulty":"dificil","category":"deporte"},
  {"id":"dd667514-a969-4b2c-b0d5-330bfcd7dcaf","letter":"B","question":"Instrumento de navegacion que señala siempre al norte","answer":"Brujula","difficulty":"medio","category":"general"},
  {"id":"d1888920-e0eb-460b-86e1-f727c1505824","letter":"C","question":"Bebida fermentada de cebada","answer":"Cerveza","difficulty":"facil","category":"comida"},
  {"id":"00c394f6-1acd-4b31-a889-17e715105dc7","letter":"C","question":"Bebida caliente hecha con granos tostados","answer":"Café","difficulty":"facil","category":"comida"},
  {"id":"69b65cd2-0165-4fb6-99c4-fcc4b4ad5541","letter":"C","question":"Tejido flexible que recubre articulaciones y nariz","answer":"Cartílago","difficulty":"dificil","category":"anatomia"},
  {"id":"e79812b5-46fa-4c15-bc02-f61e7810224a","letter":"C","question":"Animal jorobado","answer":"Camello","difficulty":"facil","category":"general"},
  {"id":"dfe0b313-546e-459c-abe7-868931a62455","letter":"C","question":"Vehículo de gran tamaño con cuatro ruedas","answer":"Camion","difficulty":"medio","category":"general"},
  {"id":"af546008-a553-4874-bf7f-b10da86816f0","letter":"C","question":"Hueso duro en el centro de algunas frutas que contiene la semilla.","answer":"Carozo","difficulty":"medio","category":"general"},
  {"id":"bed60df0-828c-4795-860b-6f9bda47b5ef","letter":"C","question":"Una línea que cambia continuamente de dirección.","answer":"Curva","difficulty":"medio","category":"General"},
  {"id":"87f73dc6-73a8-47cf-b15f-908ea2105f72","letter":"C","question":"Dinero digital descentralizado","answer":"Criptomoneda","difficulty":"dificil","category":"economia"},
  {"id":"e1841ad1-134f-404a-9960-0594d79eddfb","letter":"C","question":"Metal rojizo conocido por ser un excelente conductor de electricidad y calor.","answer":"Cobre","difficulty":"dificil","category":"ciencia"},
  {"id":"94a5b0b3-8669-4e0b-af08-ec8ac2322451","letter":"C","question":"Marca de bebida dulcemente gasificada sin alcohol.","answer":"Coca Cola","difficulty":"facil","category":"general"},
  {"id":"4d3006c2-bcea-4d1d-a357-e33d7e078485","letter":"D","question":"Actor estadounidense protagonista de Titanic","answer":"DiCaprio","difficulty":"dificil","category":"espectaculos"},
  {"id":"e4c0d36d-2d5d-43fc-bc32-104ddf837e0e","letter":"D","question":"Territorio arenoso o pedregoso con escasa vegetación","answer":"Desierto","difficulty":"facil","category":"geografia"},
  {"id":"8fd6fc7d-55d9-478f-b4dd-6408499aa39a","letter":"D","question":"Forma de gobierno donde el pueblo elige","answer":"Democracia","difficulty":"medio","category":"politica"},
  {"id":"ab0570a4-9f72-465a-8d09-ae978be13916","letter":"D","question":"Animal que aparece más de cien veces en una película de Disney","answer":"Dalmata","difficulty":"facil","category":"entretenimiento"},
  {"id":"b755e8cf-8761-4c82-aafc-611528b23d46","letter":"D","question":"Que equivale a 12 unidades","answer":"Docena","difficulty":"facil","category":"general"},
  {"id":"882ec65e-8792-4261-83ed-2f847171469c","letter":"D","question":"Tenista Serbio Ex N1 del ranking ATP","answer":"Djokovic","difficulty":"dificil","category":"deporte"},
  {"id":"e44e4826-78a7-4380-acbc-01eef466f9b7","letter":"D","question":"Referente a un muerto","answer":"Difunto","difficulty":"dificil","category":"general"},
  {"id":"fbc3f713-a89d-41aa-bf3b-4dc18f458398","letter":"D","question":"Cuchillo corto similar a una espada","answer":"Daga","difficulty":"dificil","category":"general"},
  {"id":"4b804880-fc42-427c-83c2-b193f35a8856","letter":"D","question":"Figura geométrica de 10 lados","answer":"Decaedro","difficulty":"dificil","category":"general"},
  {"id":"7090307e-dd18-4cb5-a747-049412acee15","letter":"E","question":"Ocultación de un astro por otro","answer":"Eclipse","difficulty":"facil","category":"astronomia"},
  {"id":"f0fccdcf-09ea-4ac0-9d1f-100459843920","letter":"E","question":"Animal paquidermo con trompa","answer":"Elefante","difficulty":"facil","category":"animales"},
  {"id":"d98745d1-64ad-48c5-9b76-d263e3e9f9b5","letter":"E","question":"Lugar donde se enseña","answer":"Escuela","difficulty":"facil","category":"educacion"},
  {"id":"376b219a-ef5f-462f-af9a-b10186e43935","letter":"E","question":"Conjunto de seres vivos y su entorno que interactúan","answer":"Ecosistema","difficulty":"dificil","category":"ciencia"},
  {"id":"798f6d5e-1412-46b6-afe2-e0a565617a2d","letter":"E","question":"Capital de Suecia","answer":"Estocolmo","difficulty":"medio","category":"mundi"},
  {"id":"ba719454-0d66-47b0-baa5-01bc0ad7561c","letter":"E","question":"Trastorno neurológico que causa convulsiones","answer":"Epilepsia","difficulty":"dificil","category":"medicina"},
  {"id":"cc56ccbd-6d29-48bc-b00d-7b7ef8685f0d","letter":"E","question":"Aparato que produce y emite calor","answer":"Estufa","difficulty":"medio","category":"general"},
  {"id":"458d89b5-24ed-4699-af24-971f03fe7fc7","letter":"E","question":"Deporte olímpico qué involucra lucha de espadas","answer":"Esgrima","difficulty":"dificil","category":"general"},
  {"id":"6e20c67e-b1fe-4f7f-9810-6bce10313654","letter":"F","question":"Deporte que se juega con los pies","answer":"Fútbol","difficulty":"facil","category":"deportes"},
  {"id":"f3ba8558-326e-41bb-a37e-7a1e59541052","letter":"F","question":"Historia breve con enseñanza moral","answer":"Fábula","difficulty":"facil","category":"literatura"},
  {"id":"b24fae29-eced-48f6-a573-bbf16db4d36c","letter":"F","question":"Red social más grande del mundo","answer":"Facebook","difficulty":"facil","category":"tecnologia"},
  {"id":"66b40eb1-01e6-4246-b9f4-039b372ebc8e","letter":"F","question":"Proceso por el cual las plantas convierten luz en energía","answer":"Fotosíntesis","difficulty":"dificil","category":"biologia"},
  {"id":"63771975-ad6c-43e2-87ff-aa65b5dfee9c","letter":"F","question":"Resto de un ser vivo conservado en rocas durante muchos años","answer":"Fosil","difficulty":"medio","category":"general"},
  {"id":"e2fbfded-231d-4871-88f9-87cb193f4315","letter":"F","question":"Elemento de la tabla y objeto utilizado para prender fuego","answer":"Fosforo","difficulty":"medio","category":"quimica"},
  {"id":"ea96c160-31ff-430f-9633-f29cfe9015d0","letter":"F","question":"Creencia en algo o alguien","answer":"Fe","difficulty":"medio","category":"general"},
  {"id":"7947f77b-6023-4933-8ee7-1b080ed9fe83","letter":"F","question":"Tipo de pasta alargada","answer":"Fideos","difficulty":"facil","category":"gastronomía"},
  {"id":"f51e5676-84e2-4390-a365-9cb26c2e5f38","letter":"F","question":"Padre del psicoanálisis","answer":"Freud","difficulty":"dificil","category":"general"},
  {"id":"310aeebc-5c9c-4bd7-882b-8ffbd87374e7","letter":"F","question":"Marca de autos creada por Henry","answer":"Ford","difficulty":"medio","category":"general"},
  {"id":"faeaa01d-063a-4b07-b74a-a0017328b777","letter":"F","question":"Alma o espíritu de un difunto que se manifiesta en el mundo de los vivos","answer":"Fantasma","difficulty":"medio","category":"general"},
  {"id":"461cadbd-1294-4c50-b547-82f544aebf61","letter":"F","question":"Trago popular asociado a la provincia de Cordoba","answer":"Fernet","difficulty":"facil","category":"general"},
  {"id":"904dba8e-479b-4372-82e5-d3035b191370","letter":"F","question":"Acción contraria a la verdad y a la rectitud, con la que se perjudica a alguien.","answer":"Fraude","difficulty":"dificil","category":"general"},
  {"id":"01db1aef-37c3-4ad0-bf05-547d7b1819b9","letter":"G","question":"Animal doméstico que maúlla","answer":"Gato","difficulty":"facil","category":"animales"},
  {"id":"e882866b-0d6c-4175-b978-c6cc13da5704","letter":"G","question":"Deporte que se juega con palos y pelota pequeña","answer":"Golf","difficulty":"facil","category":"deportes"},
  {"id":"721e646b-3ca4-4e39-8bd9-c64dc8cafafd","letter":"G","question":"Buscador de internet más utilizado","answer":"Google","difficulty":"facil","category":"tecnologia"},
  {"id":"aa756a66-871a-4287-a38c-900b556d6a7c","letter":"G","question":"Masa de hielo en movimiento formada por acumulación de nieve","answer":"Glaciar","difficulty":"dificil","category":"geografia"},
  {"id":"852b28a5-c133-449c-9f29-0721592b29b7","letter":"G","question":"Forma de carbono utilizada en lápices y otros elementos","answer":"Grafito","difficulty":"medio","category":"general"},
  {"id":"e85ac14d-3358-4506-ba27-1045c3239449","letter":"G","question":"Adjetivo que refiere a algo de gran tamaño","answer":"Gigante","difficulty":"medio","category":"general"},
  {"id":"a85a1a7d-6a4a-45ef-9e18-f2166fec8376","letter":"G","question":"Médico que se especializa en el aparato reproductor femenino","answer":"Ginecologo","difficulty":"medio","category":"general"},
  {"id":"12c647b5-4f9c-4c7e-812b-f7ba64599b66","letter":"H","question":"Postre frío hecho con leche y azúcar","answer":"Helado","difficulty":"facil","category":"comida"},
  {"id":"9b059a6e-b9eb-4a12-a5b8-4ea14239c66c","letter":"H","question":"Lugar donde vive una familia","answer":"Hogar","difficulty":"facil","category":"general"},
  {"id":"3d26f0ea-fd67-440c-9913-8084c003e6e0","letter":"H","question":"Deporte que se juega sobre hielo","answer":"Hockey","difficulty":"medio","category":"deportes"},
  {"id":"3906de3d-3178-454a-b62c-da0c311742d3","letter":"H","question":"Proteína de la sangre que transporta oxígeno","answer":"Hemoglobina","difficulty":"dificil","category":"biologia"},
  {"id":"2baf7b99-20bc-4f8b-bd1e-912a30a23e52","letter":"I","question":"Aplicación móvil para compartir fotos","answer":"Instagram","difficulty":"facil","category":"tecnologia"},
  {"id":"e5c8368a-5d58-4bc4-9c94-0bf70d7cba12","letter":"I","question":"Lugar donde se reza","answer":"Iglesia","difficulty":"facil","category":"religion"},
  {"id":"808dd431-010a-49ee-b292-90055c8bbf94","letter":"I","question":"Estación del año más fría","answer":"Invierno","difficulty":"facil","category":"naturaleza"},
  {"id":"1022af32-11b5-484b-aa44-a50d295e3fa5","letter":"I","question":"Aumento generalizado y sostenido de los precios","answer":"Inflación","difficulty":"dificil","category":"economia"},
  {"id":"1281cca3-8341-408e-b30c-bf34f1a344a3","letter":"I","question":"Material u objeto que produce un campo magnetico","answer":"Iman","difficulty":"medio","category":"general"},
  {"id":"01228df6-10e0-4347-ac0c-f97f37fc874a","letter":"I","question":"Fuego de grandes dimensiones qué se desarrolla sin control","answer":"Incendio","difficulty":"medio","category":"general"},
  {"id":"0460accb-a85d-4423-975b-82e4e009484f","letter":"J","question":"Lugar donde se cultivan plantas","answer":"Jardín","difficulty":"facil","category":"naturaleza"},
  {"id":"408725cd-7785-48a6-bb3e-49ae2b78534c","letter":"J","question":"Profesión que administra justicia","answer":"Juez","difficulty":"medio","category":"profesiones"},
  {"id":"23a84159-7223-424e-8d20-3565b84b21d9","letter":"J","question":"Cantante estadounidense 'King of Pop'","answer":"Jackson","difficulty":"medio","category":"espectaculos"},
  {"id":"7e4c344e-2115-42cc-aaeb-69d0a83a5474","letter":"J","question":"Planeta más grande del sistema solar","answer":"Júpiter","difficulty":"dificil","category":"astronomia"},
  {"id":"1d224a1c-2690-40c8-a720-fcdef0d4161f","letter":"K","question":"Unidad de peso de mil gramos","answer":"Kilogramo","difficulty":"facil","category":"medidas"},
  {"id":"366608bf-16a5-4798-9ac8-ed5e2c510faa","letter":"K","question":"Arte marcial japonés de golpes con manos y pies","answer":"Karate","difficulty":"medio","category":"deportes"},
  {"id":"56d9e843-fcb0-4122-b982-a69f71380320","letter":"K","question":"Aderezo de tomate dulce y ácido","answer":"Ketchup","difficulty":"facil","category":"comida"},
  {"id":"61e96d9e-c61c-465a-a323-5379296eb9f5","letter":"K","question":"Unidad de longitud equivalente a mil metros","answer":"Kilómetro","difficulty":"dificil","category":"medidas"},
  {"id":"75106ef2-dfce-4190-9f28-9daae803c3a0","letter":"K","question":"Feria con muchos juegos","answer":"Kermes","difficulty":"medio","category":"general"},
  {"id":"c451f37a-814f-49ef-8ffb-018b15f6af12","letter":"L","question":"Animal que ruge en la selva","answer":"León","difficulty":"facil","category":"animales"},
  {"id":"670fc91b-cf1f-40b2-8f3c-722f83a801de","letter":"L","question":"Satélite natural de la Tierra","answer":"Luna","difficulty":"facil","category":"astronomia"},
  {"id":"30927213-7295-4b20-8cdc-5d5851c60ff8","letter":"L","question":"Bebida blanca que dan las vacas","answer":"Leche","difficulty":"facil","category":"comida"},
  {"id":"f00fb40e-4d53-41a2-a99e-7f25d7fc3faa","letter":"L","question":"Estructura de caminos complicados diseñada para confundir","answer":"Laberinto","difficulty":"medio","category":"general"},
  {"id":"8254f99a-c249-4c43-9f2f-f6e2e7361455","letter":"L","question":"Coordenada geográfica que indica la distancia al ecuador","answer":"Latitud","difficulty":"dificil","category":"geografia"},
  {"id":"5eac3a90-acb4-4331-8a7f-39485e269113","letter":"M","question":"Fruto del manzano","answer":"Manzana","difficulty":"facil","category":"comida"},
  {"id":"2de91115-ff17-4b02-82b5-234a14de8616","letter":"M","question":"Futbolista argentino apodado 'La Pulga'","answer":"Messi","difficulty":"medio","category":"deportes"},
  {"id":"1c569a99-8078-4128-9a5d-a18f0e13456c","letter":"M","question":"Videojuego de construcción con bloques","answer":"Minecraft","difficulty":"facil","category":"tecnologia"},
  {"id":"977a430f-3788-46a0-a7da-22869e55304e","letter":"M","question":"Orgánulo celular encargado de producir energía","answer":"Mitocondria","difficulty":"dificil","category":"biologia"},
  {"id":"273e3421-1b81-4d8e-9af8-2fa243057fc1","letter":"M","question":"Poste vertical que sostiene banderas o velas en un barco","answer":"Mastil","difficulty":"medio","category":"general"},
  {"id":"6668531e-4c86-4cad-9952-4c617da3711e","letter":"M","question":"Herramienta para golpear","answer":"Martillo","difficulty":"medio","category":"general"},
  {"id":"b369b631-1bf5-4636-ba79-fb515d6d34d7","letter":"N","question":"Masa de vapor de agua suspendida en la atmósfera","answer":"Nube","difficulty":"facil","category":"naturaleza"},
  {"id":"232a06d6-3880-4403-a95b-479adb7d2505","letter":"N","question":"Órgano del olfato","answer":"Nariz","difficulty":"facil","category":"anatomia"},
  {"id":"e3d9a188-ee4b-402c-8bbf-5a3308eb01f1","letter":"N","question":"Plataforma de streaming de series y películas","answer":"Netflix","difficulty":"facil","category":"tecnologia"},
  {"id":"d58942b1-36be-42d7-b1e9-b9e806a58414","letter":"N","question":"Gas que compone la mayor parte del aire","answer":"Nitrógeno","difficulty":"dificil","category":"quimica"},
  {"id":"c067cf74-22d5-4929-8a05-1fd7672260af","letter":"O","question":"Órgano de los sentidos para oír","answer":"Oído","difficulty":"facil","category":"anatomia"},
  {"id":"2377456f-9968-4632-b629-4ddcd14f4cb7","letter":"O","question":"Capital de Noruega","answer":"Oslo","difficulty":"medio","category":"geografia"},
  {"id":"0f76aab9-3f21-463b-84e2-3328b550ca13","letter":"O","question":"Órganos de la vista","answer":"Ojos","difficulty":"facil","category":"anatomia"},
  {"id":"93ef69b7-f177-4529-9222-83867e9d3b3d","letter":"O","question":"Trayectoria que sigue un cuerpo alrededor de otro por gravedad","answer":"Órbita","difficulty":"dificil","category":"astronomia"},
  {"id":"de1192c3-d3c2-49e1-9990-bac840617da6","letter":"O","question":"Preparación a base de huevo","answer":"Omelette","difficulty":"medio","category":"gastronomía"},
  {"id":"b9c2069c-dc2e-4b76-a3e2-0adf474e7a23","letter":"O","question":"Perturbación propaganda en el agua","answer":"Ola","difficulty":"medio","category":"general"},
  {"id":"0c80c63c-d56d-42d5-8f1b-80fbf04fcdcd","letter":"O","question":"Curva cerrada y convexa, similar a una elipse","answer":"Ovalo","difficulty":"dificil","category":"general"},
  {"id":"e28b8f10-41b8-4c73-bab9-f7fb74ad5f38","letter":"O","question":"La cicatriz del cordón umbilical en el abdomen.","answer":"Ombligo","difficulty":"medio","category":"medicina"},
  {"id":"9e67ec35-c453-46ee-81ee-d5dbe6dad3b2","letter":"P","question":"Instrumento musical de teclas","answer":"Piano","difficulty":"medio","category":"musica"},
  {"id":"c60b5ae3-48fa-46a3-96bc-3e749b7f0e81","letter":"P","question":"Animal doméstico fiel al hombre","answer":"Perro","difficulty":"facil","category":"animales"},
  {"id":"71b1db02-d0d6-4943-9b29-7b73d0602b70","letter":"P","question":"Comida italiana hecha con masa, salsa y queso","answer":"Pizza","difficulty":"facil","category":"comida"},
  {"id":"db0f649c-42e4-4da8-b12f-39f8c3643de1","letter":"P","question":"Supercontinente que existió hace cientos de millones de años","answer":"Pangea","difficulty":"dificil","category":"geologia"},
  {"id":"926c6029-6723-4376-87ec-5535d6f69818","letter":"P","question":"Elemento de la tabla periodica que te brinda al comer una banana","answer":"Potasio","difficulty":"dificil","category":"ciencia"},
  {"id":"63c15f56-e22e-468e-bae0-339ab4c8309f","letter":"Q","question":"Ciencia que estudia las sustancias","answer":"Química","difficulty":"medio","category":"ciencia"},
  {"id":"c28546a6-5ede-4ecb-adc8-a63e689326e7","letter":"Q","question":"Producto lácteo para untar","answer":"Queso","difficulty":"facil","category":"comida"},
  {"id":"93409699-8c7e-4b4e-9ba7-806b9775c47b","letter":"Q","question":"Capital de Ecuador","answer":"Quito","difficulty":"medio","category":"geografia"},
  {"id":"9ce63399-a203-48b6-9e3f-a5bfd1b92319","letter":"Q","question":"Número mínimo de miembros necesarios para sesionar","answer":"Quórum","difficulty":"dificil","category":"derecho"},
  {"id":"d18583fe-71e6-4c63-b488-a9496c55f59a","letter":"Q","question":"Cítrico pequeño, ovalado y anaranjado, similar a la naranja,","answer":"Quinoto","difficulty":"dificil","category":"gastronomía"},
  {"id":"a7c3033a-3e1d-4652-b7f9-24fb43e027dd","letter":"Q","question":"Tortilla mexicana de queso","answer":"Quesadilla","difficulty":"medio","category":"gastronomía"},
  {"id":"8f759ff6-e130-4bc7-b6bf-bb4291ae7996","letter":"Q","question":"Personaje de un libro de Cervantes, oriundo de La Mancha","answer":"Quijote","difficulty":"dificil","category":"general"},
  {"id":"73604493-aa8f-4224-85be-66702bf98251","letter":"R","question":"Animal roedor pequeño","answer":"Ratón","difficulty":"facil","category":"animales"},
  {"id":"6d575581-f451-4bcf-9024-0e7102e6e898","letter":"R","question":"Corriente de agua natural","answer":"Río","difficulty":"facil","category":"naturaleza"},
  {"id":"9d5cfed3-0c5f-4a43-983a-028fd3064e7f","letter":"R","question":"Capital de Italia","answer":"Roma","difficulty":"medio","category":"geografia"},
  {"id":"e02bc6db-3204-4bf3-b8b9-42bcdc53e854","letter":"R","question":"Energía que se propaga en forma de ondas o partículas","answer":"Radiación","difficulty":"dificil","category":"fisica"},
  {"id":"84f5abf5-5e6b-4b46-b1fc-04b12cba6637","letter":"S","question":"Astro que da luz y calor","answer":"Sol","difficulty":"facil","category":"astronomia"},
  {"id":"d63541f4-2096-42d6-971f-cd34158b5e89","letter":"S","question":"Reptil que reptan sin patas","answer":"Serpiente","difficulty":"facil","category":"animales"},
  {"id":"f71edbce-af4f-4960-ba5e-76d90f4ab490","letter":"S","question":"Servicio de música en streaming","answer":"Spotify","difficulty":"facil","category":"tecnologia"},
  {"id":"4cf8b875-bccc-4e6c-89c0-ed31e07dfc86","letter":"S","question":"Conexión funcional entre neuronas para transmitir señales","answer":"Sinapsis","difficulty":"dificil","category":"biologia"},
  {"id":"0d22c0a8-aadd-4417-947b-f4eceacde51e","letter":"T","question":"Medio de transporte sobre rieles","answer":"Tren","difficulty":"facil","category":"general"},
  {"id":"ab968db8-3332-458f-a050-d2bbd2a39885","letter":"T","question":"Capital de Japón","answer":"Tokio","difficulty":"medio","category":"geografia"},
  {"id":"77303fb6-6512-4e09-822e-f3ff743c03df","letter":"T","question":"Animal felino con rayas","answer":"Tigre","difficulty":"facil","category":"animales"},
  {"id":"3c48f947-5bf6-4426-b5cc-d49ff71cc004","letter":"T","question":"Instrumento que mide la temperatura","answer":"Termómetro","difficulty":"dificil","category":"instrumentos"},
  {"id":"adbe9c75-7b0a-4fa4-8593-0989ed7874be","letter":"U","question":"Vestimenta igual para todos en un grupo","answer":"Uniforme","difficulty":"facil","category":"vestimenta"},
  {"id":"1fb771f0-d95a-4445-b657-62f8860c86bb","letter":"U","question":"Fruta morada en racimos","answer":"Uva","difficulty":"facil","category":"comida"},
  {"id":"b66bb23e-26ec-4dbb-8f9f-0bafdaf1006f","letter":"U","question":"Servicio de transporte por aplicación","answer":"Uber","difficulty":"facil","category":"tecnologia"},
  {"id":"3b098596-fc9c-4620-9508-31b4963d3925","letter":"U","question":"Tipo de radiación electromagnética más energética que la luz violeta","answer":"Ultravioleta","difficulty":"dificil","category":"fisica"},
  {"id":"97741315-20d6-4cb3-9aad-a152c8fa5293","letter":"V","question":"Animal que da leche","answer":"Vaca","difficulty":"facil","category":"animales"},
  {"id":"0d6dbe95-3fbc-422a-bc47-785a4ff2cb28","letter":"V","question":"Bebida alcohólica hecha de uvas","answer":"Vino","difficulty":"facil","category":"comida"},
  {"id":"12d9e4de-c583-4d7a-9e79-9da8f411b81a","letter":"V","question":"Deporte de pelota con red alta","answer":"Voleibol","difficulty":"medio","category":"deportes"},
  {"id":"b6a616e1-af9e-487a-9bbe-b78fe2902cc2","letter":"V","question":"Sustancia que estimula defensas para prevenir enfermedades","answer":"Vacuna","difficulty":"dificil","category":"medicina"},
  {"id":"d48499a5-1aae-4247-a09c-2ee18212a20a","letter":"W","question":"Bebida alcohólica destilada de cereales","answer":"Whisky","difficulty":"medio","category":"bebidas"},
  {"id":"b5408f94-6a5f-4f2a-bd56-61b58122a662","letter":"W","question":"Red informática mundial","answer":"Web","difficulty":"facil","category":"tecnologia"},
  {"id":"2dc2e9b6-ccf9-4830-954e-4a657c2e95fa","letter":"W","question":"Aplicación de mensajería para teléfonos","answer":"WhatsApp","difficulty":"facil","category":"tecnologia"},
  {"id":"7f3c5f1f-4591-4150-8edb-1c8e9dccbb6e","letter":"W","question":"Tecnología que permite conexión inalámbrica a internet","answer":"Wifi","difficulty":"dificil","category":"tecnologia"},
  {"id":"fe7406af-6521-4001-b923-0f147d476df4","letter":"W","question":"Deporte acuático con pelota en equipo","answer":"Waterpolo","difficulty":"medio","category":"deporte"},
  {"id":"c297671a-a657-4ea4-ab5a-3f97cb43b6fd","letter":"W","question":"Dispositivo portátil para reproducir cintas de casete.","answer":"Walkman","difficulty":"dificil","category":"general"},
  {"id":"4ce368fe-0b44-4804-80d6-1e923b9c7261","letter":"W","question":"Sistema operativo de Microsoft","answer":"Windows","difficulty":"medio","category":"tecnología"},
  {"id":"9ae6f506-432d-4ba3-82cb-33cbb79b6810","letter":"X","question":"Instrumento musical de percusión","answer":"Xilófono","difficulty":"medio","category":"musica"},
  {"id":"a9798b32-9e69-441c-b98a-cc49fc85f53e","letter":"X","question":"Consola de videojuegos de Microsoft","answer":"Xbox","difficulty":"medio","category":"tecnologia"},
  {"id":"2d71a8a1-019a-4adc-b751-803fa270ad21","letter":"X","question":"Elemento químico noble usado en lámparas y flashes","answer":"Xenón","difficulty":"dificil","category":"quimica"},
  {"id":"9197fe9e-9d4f-454c-a578-6fb28610db50","letter":"Y","question":"Plataforma de videos en línea más utilizada","answer":"YouTube","difficulty":"facil","category":"tecnologia"},
  {"id":"873eed08-925d-498a-8183-befa07bcc091","letter":"Y","question":"Embarcación de recreo","answer":"Yate","difficulty":"medio","category":"nautica"},
  {"id":"5443a292-5194-42ed-bc6a-750be2d5ef00","letter":"Y","question":"Parte central del huevo","answer":"Yema","difficulty":"medio","category":"comida"},
  {"id":"d00dd056-c40b-4e44-a4e8-142f396c11a7","letter":"Y","question":"Elemento químico usado como antiséptico y en la tiroides","answer":"Yodo","difficulty":"dificil","category":"quimica"},
  {"id":"ef084842-208d-4f80-8f92-b388cc535421","letter":"Z","question":"Plataforma de videollamadas muy usada en pandemia","answer":"Zoom","difficulty":"facil","category":"tecnologia"},
  {"id":"a6ef9cac-5ca4-4eb3-8714-53d20e99c96f","letter":"Z","question":"Calzado que cubre el pie","answer":"Zapato","difficulty":"facil","category":"vestimenta"},
  {"id":"f01ecc44-b202-49dc-94b3-7e3e3e645866","letter":"Z","question":"Lugar donde se exhiben animales","answer":"Zoológico","difficulty":"medio","category":"lugares"},
  {"id":"21bc1929-6227-4e27-8f8b-0752a955b25c","letter":"Z","question":"Rama de la biología que estudia a los animales","answer":"Zoología","difficulty":"dificil","category":"biologia"}
];

import { supabaseSync } from "./supabase/sync"

function loadQuestionsFromStorage(): Question[] {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("questionsArray")
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (error) {
        console.error("Error loading questions from storage:", error)
      }
    }
  }
  return questionsDatabase
}

const currentQuestions = loadQuestionsFromStorage()

export const questionsData: Record<string, Question[]> = {}

currentQuestions.forEach((question) => {
  if (!questionsData[question.letter]) {
    questionsData[question.letter] = []
  }
  questionsData[question.letter].push(question)
})

export function getRandomQuestion(
  letter: string,
  difficulty: "facil" | "medio" | "dificil" | "sorpresa",
): Question | null {
  const updatedQuestions = loadQuestionsFromStorage()
  const updatedQuestionsData: Record<string, Question[]> = {}

  updatedQuestions.forEach((question) => {
    if (!updatedQuestionsData[question.letter]) {
      updatedQuestionsData[question.letter] = []
    }
    updatedQuestionsData[question.letter].push(question)
  })

  const letterQuestions = updatedQuestionsData[letter] || []

  if (difficulty === "sorpresa") {
    if (letterQuestions.length === 0) return null
    return letterQuestions[Math.floor(Math.random() * letterQuestions.length)]
  }

  const filteredQuestions = letterQuestions.filter((q) => q.difficulty === difficulty)

  if (filteredQuestions.length === 0) {
    // Si no hay preguntas de esa dificultad, usar cualquier dificultad
    const allQuestions = letterQuestions
    if (allQuestions.length === 0) return null
    return allQuestions[Math.floor(Math.random() * allQuestions.length)]
  }

  return filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)]
}

export async function initializeQuestions(): Promise<void> {
  try {
    await supabaseSync.initializeSync()
  } catch (error) {
    console.error("Error inicializando preguntas:", error)
  }
}

export function getAllLetters(): string[] {
  return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
}
