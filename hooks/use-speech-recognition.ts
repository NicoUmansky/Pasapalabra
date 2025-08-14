"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface SpeechRecognitionResult {
  transcript: string
  confidence: number
  isFinal: boolean
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
  const [isMobile, setIsMobile] = useState(false)

  const onResultRef = useRef(onResult)
  const onErrorRef = useRef(onError)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    onResultRef.current = onResult
  }, [onResult])

  useEffect(() => {
    onErrorRef.current = onError
  }, [onError])

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Detectar si es móvil
      const isMobileDevice = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      setIsMobile(isMobileDevice)

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

      if (SpeechRecognition) {
        try {
          const recognitionInstance = new SpeechRecognition()

          // Configuración específica para móviles
          if (isMobileDevice) {
            recognitionInstance.continuous = false // Mejor para móvil
            recognitionInstance.interimResults = false // Más estable en móvil
            recognitionInstance.maxAlternatives = 1
            // Configuraciones adicionales para móvil
            recognitionInstance.serviceURI = undefined // Usar servicio por defecto
          } else {
            recognitionInstance.continuous = continuous
            recognitionInstance.interimResults = interimResults
            recognitionInstance.maxAlternatives = 3
          }

          recognitionInstance.lang = language

          recognitionInstance.onstart = () => {
            console.log("Speech recognition started")
            setIsListening(true)

            // Timeout para móviles (auto-stop después de 10 segundos)
            if (isMobileDevice) {
              timeoutRef.current = setTimeout(() => {
                if (recognitionInstance) {
                  recognitionInstance.stop()
                }
              }, 10000)
            }
          }

          recognitionInstance.onend = () => {
            console.log("Speech recognition ended")
            setIsListening(false)
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current)
            }
          }

          recognitionInstance.onresult = (event: any) => {
            console.log("Speech recognition result:", event)
            let finalTranscript = ""
            let interimTranscript = ""

            for (let i = event.resultIndex; i < event.results.length; i++) {
              const result = event.results[i]
              const transcript = result[0].transcript.trim()

              if (result.isFinal) {
                finalTranscript += transcript
              } else {
                interimTranscript += transcript
              }
            }

            const fullTranscript = finalTranscript || interimTranscript
            setTranscript(fullTranscript)

            if (onResultRef.current && fullTranscript) {
              // Detectar palabras clave para pasapalabra
              const lowerTranscript = fullTranscript.toLowerCase()
              const pasapalabraKeywords = [
                "pasapalabra",
                "pasa palabra",
                "paso",
                "siguiente",
                "saltar",
                "pasar",
                "skip",
                "next",
              ]

              const isPasapalabra = pasapalabraKeywords.some((keyword) => lowerTranscript.includes(keyword))

              onResultRef.current({
                transcript: isPasapalabra ? "PASAPALABRA" : fullTranscript,
                confidence: event.results[event.results.length - 1]?.[0]?.confidence || 0.8,
                isFinal: event.results[event.results.length - 1]?.isFinal || false,
              })
            }
          }

          recognitionInstance.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error)
            setIsListening(false)

            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current)
            }

            let errorMessage = event.error
            switch (event.error) {
              case "not-allowed":
                errorMessage = isMobileDevice
                  ? "Permisos de micrófono denegados. Ve a Configuración > Safari/Chrome > Micrófono y permite el acceso."
                  : "Permisos de micrófono denegados. Por favor, permite el acceso al micrófono."
                break
              case "no-speech":
                errorMessage = "No se detectó voz. Intenta hablar más claro y cerca del micrófono."
                break
              case "audio-capture":
                errorMessage = isMobileDevice
                  ? "No se pudo acceder al micrófono. Verifica que no esté siendo usado por otra app."
                  : "No se pudo acceder al micrófono."
                break
              case "network":
                errorMessage = "Error de conexión. Verifica tu conexión a internet."
                break
              case "service-not-allowed":
                errorMessage = "Servicio de reconocimiento de voz no disponible en este navegador."
                break
              default:
                errorMessage = `Error de reconocimiento de voz: ${event.error}`
            }

            if (onErrorRef.current) {
              onErrorRef.current(errorMessage)
            }
          }

          recognitionInstance.onspeechend = () => {
            console.log("Speech ended")
            // En móviles, detener automáticamente
            if (isMobileDevice) {
              recognitionInstance.stop()
            }
          }

          recognitionInstance.onsoundstart = () => {
            console.log("Sound detected")
          }

          recognitionInstance.onsoundend = () => {
            console.log("Sound ended")
          }

          setRecognition(recognitionInstance)
          setIsSupported(true)
        } catch (error) {
          console.error("Error creating speech recognition:", error)
          setIsSupported(false)
        }
      } else {
        console.warn("Speech recognition not supported in this browser")
        setIsSupported(false)
      }
    }
  }, [language, continuous, interimResults])

  const startListening = useCallback(async () => {
    if (recognition && !isListening) {
      try {
        // Solicitar permisos explícitamente en móviles
        if (isMobile && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
                sampleRate: 44100,
              },
            })
            // Cerrar el stream inmediatamente, solo necesitábamos los permisos
            stream.getTracks().forEach((track) => track.stop())
          } catch (permissionError) {
            console.error("Microphone permission denied:", permissionError)
            if (onErrorRef.current) {
              onErrorRef.current(
                "Permisos de micrófono denegados. Ve a Configuración del navegador y permite el acceso al micrófono para este sitio.",
              )
            }
            return
          }
        }

        setTranscript("")
        recognition.start()
      } catch (error) {
        console.error("Error starting speech recognition:", error)
        setIsListening(false)
        if (onErrorRef.current) {
          onErrorRef.current("Error al iniciar el reconocimiento de voz. Intenta de nuevo.")
        }
      }
    }
  }, [recognition, isListening, isMobile])

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      try {
        recognition.stop()
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      } catch (error) {
        console.error("Error stopping speech recognition:", error)
        setIsListening(false)
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
    isMobile,
  }
}
