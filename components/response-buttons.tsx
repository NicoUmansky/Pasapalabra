"use client"

import { Button } from "@/components/ui/button"
import { Check, X, SkipForward } from "lucide-react"

interface ResponseButtonsProps {
  onResponse: (response: "correct" | "incorrect" | "skip") => void
}

export function ResponseButtons({ onResponse }: ResponseButtonsProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600 text-center mb-4">Respuesta del Jugador:</p>

      <Button onClick={() => onResponse("correct")} className="w-full bg-green-600 hover:bg-green-700 text-white py-3">
        <Check className="w-5 h-5 mr-2" />
        Correcto
      </Button>

      <Button onClick={() => onResponse("skip")} className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3">
        <SkipForward className="w-5 h-5 mr-2" />
        Pasapalabra
      </Button>

      <Button onClick={() => onResponse("incorrect")} className="w-full bg-red-600 hover:bg-red-700 text-white py-3">
        <X className="w-5 h-5 mr-2" />
        Incorrecto
      </Button>
    </div>
  )
}
