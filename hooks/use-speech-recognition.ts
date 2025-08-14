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
  const [hasPermissions, setHasPermissions] = useState(false)

  const onResultRef = useRef(onResult)
  const onErrorRef = useRef(onError)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const restartTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    onResultRef.current = onResult
  }, [onResult])

  useEffect(() => {
    onErrorRef.current = onError
  }, [onError])

  const checkHTTPS = useCallback(() => {
    if (typeof window !== "undefined") {
      const isHTTPS = window.location.protocol === "https:" || window.location.hostname === "localhost"
      if (!isHTTPS) {
        console.warn("Speech Recognition requires HTTPS")
        if (onErrorRef.current) {
          onErrorRef.current("El reconocimiento de voz requiere HTTPS. Accede al sitio con https://")
        }
        return false
      }
    }
    return true
  }, [])

  const requestMicrophonePermissions = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return false
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: isMobile ? 16000 : 44100, // Menor sample rate para móviles
        },
      })

      // Cerrar el stream inmediatamente, solo necesitábamos los permisos
      stream.getTracks().forEach((track) => track.stop())
      setHasPermissions(true)
      return true
    } catch (error) {
      console.error("Microphone permission denied:", error)
      setHasPermissions(false)
      if (onErrorRef.current) {
        onErrorRef.current(
          isMobile
            ? "Permisos de micrófono denegados. Ve a Configuración > Safari/Chrome > Micrófono y permite el acceso para este sitio."
            : "Permisos de micrófono denegados. Haz clic en el ícono de micrófono en la barra de direcciones y permite el acceso.",
        )
      }
      return false
    }
  }, [isMobile])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isMobileDevice =
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        (navigator.maxTouchPoints && navigator.maxTouchPoints > 2)
      setIsMobile(isMobileDevice)

      // Verificar HTTPS
      if (!checkHTTPS()) {
        return
      }

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

      if (SpeechRecognition) {
        try {
          const recognitionInstance = new SpeechRecognition()

          if (isMobileDevice) {
            recognitionInstance.continuous = false // Mejor estabilidad en móvil
            recognitionInstance.interimResults = false // Evita interrupciones
            recognitionInstance.maxAlternatives = 1
            // No configurar grammars, usar el valor por defecto del navegador
          } else {
            recognitionInstance.continuous = continuous
            recognitionInstance.interimResults = interimResults
            recognitionInstance.maxAlternatives = 3
          }

          recognitionInstance.lang = language

          recognitionInstance.onstart = () => {
            console.log("Speech recognition started")
            setIsListening(true)

            if (isMobileDevice) {
              timeoutRef.current = setTimeout(() => {
                if (recognitionInstance) {
                  recognitionInstance.stop()
                }
              }, 8000) // 8 segundos para móvil
            }
          }

          recognitionInstance.onend = () => {
            console.log("Speech recognition ended")
            setIsListening(false)

            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current)
            }

            if (isMobileDevice && continuous && isListening) {
              restartTimeoutRef.current = setTimeout(() => {
                if (!isListening) {
                  try {
                    recognitionInstance.start()
                  } catch (error) {
                    console.error("Error restarting recognition:", error)
                  }
                }
              }, 100)
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
              const lowerTranscript = fullTranscript.toLowerCase().replace(/[.,!?]/g, "")
              const pasapalabraKeywords = [
                "pasapalabra",
                "pasa palabra",
                "paso",
                "siguiente",
                "saltar",
                "pasar",
                "skip",
                "next",
                "salta",
                "continúa",
                "adelante",
              ]

              const isPasapalabra = pasapalabraKeywords.some(
                (keyword) =>
                  lowerTranscript.includes(keyword) ||
                  lowerTranscript.startsWith(keyword) ||
                  lowerTranscript.endsWith(keyword),
              )

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
            if (restartTimeoutRef.current) {
              clearTimeout(restartTimeoutRef.current)
            }

            let errorMessage = event.error
            switch (event.error) {
              case "not-allowed":
                errorMessage = isMobileDevice
                  ? "Permisos de micrófono denegados. Ve a Configuración > Safari/Chrome > Micrófono y permite el acceso."
                  : "Permisos de micrófono denegados. Haz clic en el ícono de micrófono en la barra de direcciones."
                setHasPermissions(false)
                break
              case "no-speech":
                errorMessage = "No se detectó voz. Habla más cerca del micrófono."
                break
              case "audio-capture":
                errorMessage = isMobileDevice
                  ? "No se pudo acceder al micrófono. Cierra otras apps que puedan estar usándolo."
                  : "No se pudo acceder al micrófono. Verifica que esté conectado."
                break
              case "network":
                errorMessage = "Error de conexión. Verifica tu conexión a internet."
                break
              case "service-not-allowed":
                errorMessage = "Servicio de reconocimiento de voz no disponible."
                break
              case "aborted":
                // No mostrar error si fue abortado intencionalmente
                return
              default:
                errorMessage = `Error de reconocimiento: ${event.error}`
            }

            if (onErrorRef.current) {
              onErrorRef.current(errorMessage)
            }
          }

          recognitionInstance.onspeechend = () => {
            console.log("Speech ended")
            if (isMobileDevice) {
              // En móviles, detener después de un breve delay
              setTimeout(() => {
                if (recognitionInstance && isListening) {
                  recognitionInstance.stop()
                }
              }, 500)
            }
          }

          recognitionInstance.onsoundstart = () => {
            console.log("Sound detected")
          }

          recognitionInstance.onsoundend = () => {
            console.log("Sound ended")
          }

          recognitionInstance.onaudiostart = () => {
            console.log("Audio capture started")
          }

          recognitionInstance.onaudioend = () => {
            console.log("Audio capture ended")
          }

          setRecognition(recognitionInstance)
          setIsSupported(true)
        } catch (error) {
          console.error("Error creating speech recognition:", error)
          setIsSupported(false)
          if (onErrorRef.current) {
            onErrorRef.current("Tu navegador no soporta reconocimiento de voz.")
          }
        }
      } else {
        console.warn("Speech recognition not supported in this browser")
        setIsSupported(false)
        if (onErrorRef.current) {
          onErrorRef.current(
            isMobileDevice
              ? "Reconocimiento de voz no disponible. Usa Safari en iOS o Chrome en Android."
              : "Tu navegador no soporta reconocimiento de voz. Usa Chrome, Edge o Safari.",
          )
        }
      }
    }
  }, [language, continuous, interimResults, checkHTTPS])

  const startListening = useCallback(async () => {
    if (!recognition || isListening) return

    try {
      if (!checkHTTPS()) {
        return
      }

      if (!hasPermissions) {
        const permissionGranted = await requestMicrophonePermissions()
        if (!permissionGranted) {
          return
        }
      }

      setTranscript("")

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current)
      }

      recognition.start()
    } catch (error) {
      console.error("Error starting speech recognition:", error)
      setIsListening(false)

      if (onErrorRef.current) {
        const errorMessage = isMobile
          ? "Error al iniciar el micrófono. Verifica los permisos y que no esté siendo usado por otra app."
          : "Error al iniciar el reconocimiento de voz. Intenta de nuevo."
        onErrorRef.current(errorMessage)
      }
    }
  }, [recognition, isListening, isMobile, hasPermissions, checkHTTPS, requestMicrophonePermissions])

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      try {
        recognition.stop()

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        if (restartTimeoutRef.current) {
          clearTimeout(restartTimeoutRef.current)
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

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current)
      }
    }
  }, [])

  return {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    isMobile,
    hasPermissions,
  }
}
