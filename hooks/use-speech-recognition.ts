"use client"

import { useState, useEffect, useCallback } from "react"
import type SpeechRecognition from "speech-recognition"

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
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognition) {
        setIsSupported(true)
        const recognitionInstance = new SpeechRecognition()

        recognitionInstance.continuous = continuous
        recognitionInstance.interimResults = interimResults
        recognitionInstance.lang = language

        recognitionInstance.onstart = () => {
          setIsListening(true)
        }

        recognitionInstance.onend = () => {
          setIsListening(false)
        }

        recognitionInstance.onresult = (event) => {
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

          if (onResult) {
            onResult({
              transcript: fullTranscript,
              confidence: event.results[event.results.length - 1]?.[0]?.confidence || 0,
              isFinal: event.results[event.results.length - 1]?.isFinal || false,
            })
          }
        }

        recognitionInstance.onerror = (event) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
          if (onError) {
            onError(event.error)
          }
        }

        setRecognition(recognitionInstance)
      } else {
        setIsSupported(false)
      }
    }
  }, [language, continuous, interimResults, onResult, onError])

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      setTranscript("")
      recognition.start()
    }
  }, [recognition, isListening])

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop()
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

// Extend Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}
