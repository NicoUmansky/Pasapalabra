"use client"

import { useState, useEffect, useCallback } from "react"

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

      if (SpeechRecognition) {
        setIsSupported(true)
        const recognitionInstance = new SpeechRecognition()

        recognitionInstance.continuous = continuous
        recognitionInstance.interimResults = interimResults
        recognitionInstance.lang = language
        recognitionInstance.maxAlternatives = 1

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

          if (onResult && fullTranscript.trim()) {
            onResult({
              transcript: fullTranscript.trim(),
              confidence: event.results[event.results.length - 1]?.[0]?.confidence || 0.8,
              isFinal: event.results[event.results.length - 1]?.isFinal || false,
            })
          }
        }

        recognitionInstance.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
          if (onError) {
            onError(event.error)
          }
        }

        setRecognition(recognitionInstance)
      } else {
        console.warn("Speech recognition not supported")
        setIsSupported(false)
      }
    }
  }, [language, continuous, interimResults, onResult, onError])

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      try {
        setTranscript("")
        recognition.start()
      } catch (error) {
        console.error("Error starting speech recognition:", error)
        if (onError) {
          onError("Error starting speech recognition")
        }
      }
    }
  }, [recognition, isListening, onError])

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
