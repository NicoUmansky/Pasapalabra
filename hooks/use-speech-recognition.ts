"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { getMobileSpeechConfig, detectPasapalabra } from "@/lib/mobile-config"

interface SpeechRecognitionResult {
  transcript: string
  confidence: number
  isFinal: boolean
  isPasapalabra?: boolean
}

interface UseSpeechRecognitionProps {
  language?: string
  continuous?: boolean
  interimResults?: boolean
  onResult?: (result: SpeechRecognitionResult) => void
  onError?: (error: string) => void
}

export function useSpeechRecognition({
  language = "es-ES",
  continuous = false,
  interimResults = true,
  onResult,
  onError,
}: UseSpeechRecognitionProps = {}) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [recognition, setRecognition] = useState<any>(null)

  const onResultRef = useRef(onResult)
  const onErrorRef = useRef(onError)

  useEffect(() => {
    onResultRef.current = onResult
  }, [onResult])

  useEffect(() => {
    onErrorRef.current = onError
  }, [onError])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

      if (SpeechRecognition) {
        setIsSupported(true)
        const recognitionInstance = new SpeechRecognition()

        // Usar configuraciones optimizadas para móviles
        const mobileConfig = getMobileSpeechConfig()
        recognitionInstance.continuous = mobileConfig.continuous
        recognitionInstance.interimResults = mobileConfig.interimResults
        recognitionInstance.lang = mobileConfig.lang
        recognitionInstance.maxAlternatives = mobileConfig.maxAlternatives
        recognitionInstance.grammars = mobileConfig.grammars
        recognitionInstance.serviceURI = mobileConfig.serviceURI

        recognitionInstance.onstart = () => {
          console.log("Speech recognition started")
          setIsListening(true)
        }

        recognitionInstance.onend = () => {
          console.log("Speech recognition ended")
          setIsListening(false)
        }

        recognitionInstance.onresult = (event: any) => {
          console.log("Speech recognition result:", event)
          let finalTranscript = ""
          let interimTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i]
            const transcript = result[0].transcript

            if (result.isFinal) {
              finalTranscript += transcript
            } else {
              interimTranscript += transcript
            }
          }

          const fullTranscript = finalTranscript || interimTranscript
          setTranscript(fullTranscript)

          // Detectar si se dijo "pasapalabra" usando la función de configuración
          const isPasapalabra = detectPasapalabra(fullTranscript)

          if (onResultRef.current && fullTranscript.trim()) {
            onResultRef.current({
              transcript: fullTranscript.trim(),
              confidence: event.results[event.results.length - 1]?.[0]?.confidence || 0.8,
              isFinal: event.results[event.results.length - 1]?.isFinal || false,
              isPasapalabra: isPasapalabra
            })
          }
        }

        recognitionInstance.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
          
          // Manejo específico de errores móviles
          let errorMessage = event.error
          if (event.error === 'not-allowed') {
            errorMessage = 'Permiso de micrófono denegado. Por favor, permite el acceso al micrófono en tu dispositivo.'
          } else if (event.error === 'no-speech') {
            errorMessage = 'No se detectó voz. Intenta hablar más cerca del micrófono.'
          } else if (event.error === 'audio-capture') {
            errorMessage = 'Error al capturar audio. Verifica que tu micrófono esté funcionando.'
          } else if (event.error === 'network') {
            errorMessage = 'Error de red. Verifica tu conexión a internet.'
          }
          
          if (onErrorRef.current) {
            onErrorRef.current(errorMessage)
          }
        }

        setRecognition(recognitionInstance)
      } else {
        console.warn("Speech recognition not supported")
        setIsSupported(false)
      }
    }
  }, [language, continuous, interimResults]) // Removed onResult and onError from dependencies

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      try {
        setTranscript("")
        
        // En móviles, agregar un pequeño delay para mejor compatibilidad
        const mobileConfig = getMobileSpeechConfig()
        if (!mobileConfig.continuous) {
          setTimeout(() => {
            recognition.start()
          }, 100)
        } else {
          recognition.start()
        }
      } catch (error) {
        console.error("Error starting speech recognition:", error)
        if (onErrorRef.current) {
          onErrorRef.current("Error starting speech recognition")
        }
      }
    }
  }, [recognition, isListening])

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      try {
        recognition.stop()
      } catch (error) {
        console.error("Error stopping speech recognition:", error)
      }
    }
  }, [recognition, isListening])

  const resetTranscript = useCallback(() => {
    setTranscript("")
  }, [])

  return {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
  }
}
