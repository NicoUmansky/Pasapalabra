"use client"

import { Button } from "@/components/ui/button"
import { Play, Pause } from "lucide-react"

interface GameControlsProps {
  onStart: () => void
  onPause?: () => void
  isPlaying: boolean
  isPaused?: boolean
}

export function GameControls({ onStart, onPause, isPlaying, isPaused }: GameControlsProps) {
  if (!isPlaying) {
    return (
      <Button onClick={onStart} className="w-full bg-black text-white hover:bg-gray-800 py-3">
        <Play className="w-5 h-5 mr-2" />
        Comenzar Rosco
      </Button>
    )
  }

  return (
    <div className="space-y-2">
      {onPause && (
        <Button onClick={onPause} variant="outline" className="w-full bg-transparent">
          <Pause className="w-5 h-5 mr-2" />
          {isPaused ? "Reanudar" : "Pausar"}
        </Button>
      )}
    </div>
  )
}
