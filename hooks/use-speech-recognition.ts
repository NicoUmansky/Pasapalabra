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
        try {
          const testRecognition = new SpeechRecognition()
          setIsSupported(true)

          const recognitionInstance = new SpeechRecognition()

          recognitionInstance.continuous = continuous
          recognitionInstance.interimResults = interimResults
          recognitionInstance.lang = language
          recognitionInstance.maxAlternatives = 1

          if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            recognitionInstance.continuous = false // Mejor para móvil
            recognitionInstance.interimResults = false // Más estable en móvil
          }

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

            if (onResultRef.current && fullTranscript.trim()) {
              onResultRef.current({
                transcript: fullTranscript.trim(),
                confidence: event.results[event.results.length - 1]?.[0]?.confidence || 0.8,
                isFinal: event.results[event.results.length - 1]?.isFinal || false,
              })
            }
          }

          recognitionInstance.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error)
            setIsListening(false)

            let errorMessage = event.error
            switch (event.error) {
              case "not-allowed":
                errorMessage = "Permisos de micrófono denegados. Por favor, permite el acceso al micrófono."
                break
              case "no-speech":
                errorMessage = "No se detectó voz. Intenta hablar más claro."
                break
              case "audio-capture":
                errorMessage = "No se pudo acceder al micrófono."
                break
              case "network":
                errorMessage = "Error de conexión. Verifica tu conexión a internet."
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
            recognitionInstance.stop()
          }

          setRecognition(recognitionInstance)
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
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            await navigator.mediaDevices.getUserMedia({ audio: true })
          } catch (permissionError) {
            console.error("Microphone permission denied:", permissionError)
            if (onErrorRef.current) {
              onErrorRef.current(
                "Permisos de micrófono denegados. Por favor, permite el acceso al micrófono en la configuración del navegador.",
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
          onErrorRef.current("Error al iniciar el reconocimiento de voz")
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
  }
}
