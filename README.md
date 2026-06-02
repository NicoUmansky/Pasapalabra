# El Rosco

Juego web inspirado en **Pasapalabra**, construido con **Next.js**, **TypeScript** y **Tailwind CSS**. El proyecto incluye un modo individual y un modo multijugador, además de funciones de accesibilidad y opciones de configuración para adaptar la experiencia a cada jugador.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/redress-projects-ea5fa733/v0-el-rosco)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/pnTaYa72rqW)

## Descripción del proyecto

**El Rosco** es una experiencia interactiva basada en el clásico concurso de palabras. El objetivo es responder correctamente a las definiciones asociadas a cada letra del abecedario antes de que se agote el tiempo.

El proyecto está pensado para jugar de forma individual o en grupo, y permite personalizar varios aspectos de la partida, como el idioma, la dificultad, el modo de respuesta o la activación de voz.

## Funcionalidades principales

- **Modo individual** para jugar al rosco clásico.
- **Modo multijugador** con configuración de jugadores y marcador.
- **Rosco visual** con estados de letras: correcta, incorrecta, saltada o pendiente.
- **Reconocimiento de voz** para responder sin teclado.
- **Configuración personalizable** guardada en `localStorage`.
- **Importación y exportación** de ajustes.
- **Tema visual moderno** con componentes reutilizables.
- **Diseño responsive** adaptado a móvil y escritorio.

## Tecnologías utilizadas

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Lucide Icons**

## Estructura general

- `app/`: páginas y layout principal de la aplicación.
- `components/`: componentes UI y componentes del juego.
- `hooks/`: lógica reutilizable, como ajustes y reconocimiento de voz.
- `lib/`: tipos y utilidades compartidas.

## Cómo jugar

1. Inicia una partida desde la pantalla principal.
2. Responde a cada definición con la letra que toque.
3. Si no sabes la respuesta, puedes pasar palabra y volver más tarde.
4. En multijugador, cada jugador compite con su propio rosco.
5. Gana quien consiga más aciertos al final de la partida.

## Configuración

El juego incluye opciones como:

- duración de la partida
- dificultad
- idioma
- modo de respuesta
- tamaño de fuente
- alto contraste
- sugerencias
- respuesta por voz

Los ajustes se guardan automáticamente en el navegador.

## Despliegue

El proyecto está desplegado en Vercel:

**https://vercel.com/redress-projects-ea5fa733/v0-el-rosco**

## Desarrollo

Para seguir trabajando en la app desde v0:

**https://v0.app/chat/projects/pnTaYa72rqW**

## Notas

Este repositorio se sincroniza con las implementaciones generadas desde v0.app.
