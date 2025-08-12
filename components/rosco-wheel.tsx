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
  const radius = 180
  const centerX = 250
  const centerY = 250
  const letterRadius = 25

  const getLetterPosition = (index: number, total: number) => {
    const angle = (index * 2 * Math.PI) / total - Math.PI / 2
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)
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
    <div className="flex justify-center">
      <svg width="500" height="500" className="drop-shadow-lg">
        {/* Centro del rosco */}
        <circle cx={centerX} cy={centerY} r="60" fill="#8B5CF6" className="drop-shadow-md" />
        <text
          x={centerX}
          y={centerY}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-white text-2xl font-bold"
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
                r={letterRadius}
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
                className={cn("fill-white text-lg font-bold pointer-events-none", {
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
