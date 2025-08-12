"use client"

import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimerProps {
  timeRemaining: number
}

export function Timer({ timeRemaining }: TimerProps) {
  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60
  const isLowTime = timeRemaining <= 30

  return (
    <div
      className={cn("flex items-center gap-2 text-lg font-semibold", {
        "text-green-600": timeRemaining > 60,
        "text-yellow-600": timeRemaining <= 60 && timeRemaining > 30,
        "text-red-600 animate-pulse": isLowTime,
      })}
    >
      <Clock className="w-5 h-5" />
      <span>
        {minutes}:{seconds.toString().padStart(2, "0")}
      </span>
    </div>
  )
}
