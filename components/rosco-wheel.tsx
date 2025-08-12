"use client"

import type { LetterState } from "@/lib/game-types"
import { cn } from "@/lib/utils"

interface RoscoWheelProps {
  letters: LetterState[]
  currentLetter: string
  onLetterClick?: (letter: string) => void
  isPlaying?: boolean
}

export function RoscoWheel({ letters, currentLetter, onLetterClick, isPlaying }: RoscoWheelProps) {
  const getLetterPosition = (index: number, total: number) => {
    const angle = (index * 2 * Math.PI) / total - Math.PI / 2
    const x = 50 + 35 * Math.cos(angle) // Centrado en viewBox 100x100
    const y = 50 + 35 * Math.sin(angle)
    return { x, y }
  }

  const getLetterColor = (letter: LetterState, isCurrent: boolean) => {
    if (isCurrent && isPlaying) return "#8B5CF6" // Purple for current
    switch (letter.status) {
      case "correct":
        return "#10B981" // Green
      case "incorrect":
        return "#EF4444" // Red
      case "skipped":
        return "#F59E0B" // Yellow
      default:
        return "#3B82F6" // Blue for pending
    }
  }

  const handleLetterClick = (letter: LetterState) => {
    if (isPlaying && letter.status === "pending" && onLetterClick) {
      onLetterClick(letter.letter)
    }
  }

  return (
    <div className="flex justify-center w-full">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full max-w-[300px] max-h-[300px] sm:max-w-[400px] sm:max-h-[400px] lg:max-w-[500px] lg:max-h-[500px] drop-shadow-lg"
        style={{ aspectRatio: "1/1" }}
      >
        {/* Centro del rosco */}
        <circle cx="50" cy="50" r="8" fill="#8B5CF6" className="drop-shadow-md" />
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-white text-[4px] sm:text-[3px] font-bold"
        >
          🎯
        </text>

        {/* Letras del rosco */}
        {letters.map((letter, index) => {
          const { x, y } = getLetterPosition(index, letters.length)
          const isCurrent = letter.letter === currentLetter
          const color = getLetterColor(letter, isCurrent)
          const isClickable = isPlaying && letter.status === "pending"

          return (
            <g key={letter.letter}>
              <circle
                cx={x}
                cy={y}
                r="5.5"
                fill={color}
                className={cn("drop-shadow-md transition-all duration-300", {
                  "animate-pulse": isCurrent && isPlaying,
                  "cursor-pointer hover:scale-110": isClickable,
                  "opacity-75": !isPlaying && letter.status === "pending",
                })}
                onClick={() => handleLetterClick(letter)}
              />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className={cn("fill-white text-[3.5px] font-bold pointer-events-none", {
                  "animate-pulse": isCurrent && isPlaying,
                })}
              >
                {letter.letter}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
