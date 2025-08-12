"use client"

import { useState } from "react"
import { MultiplayerRosco } from "@/components/multiplayer-rosco"
import { MultiplayerScoreboard } from "@/components/multiplayer-scoreboard"
import { MultiplayerSetup } from "@/components/multiplayer-setup"
import { MultiplayerResults } from "@/components/multiplayer-results"
import { Timer } from "@/components/timer"
import { QuestionPanel } from "@/components/question-panel"
import { ResponseButtons } from "@/components/response-buttons"
import { GameSettings } from "@/components/game-settings"
import { useMultiplayerLogic } from "@/hooks/use-multiplayer-logic"
import { Button } from "@/components/ui/button"
import { Settings, Globe, Pause, Play, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function MultiplayerGame() {
  const {
    gameState,
    currentQuestion,
    playerLetters,
    startGame,
    handleResponse,
    togglePause,
    endGame,
    resetGame,
    updateSettings,
    getCurrentPlayer,
    getGameStats,
  } = useMultiplayerLogic()

  const [showSetup, setShowSetup] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handleStartGame = () => {
    if (gameState.settings.mode === "multijugador") {
      setShowSetup(true)
    } else {
      startGame()
    }
  }

  const handleSetupComplete = (playerNames: string[]) => {
    setShowSetup(false)
    startGame(playerNames)
  }

  const handlePlayAgain = () => {
    setShowResults(false)
    resetGame()
    setShowSetup(true)
  }

  const handleNewGame = () => {
    setShowResults(false)
    resetGame()
    setShowSettings(true)
  }

  if (!gameState.isPlaying && gameState.players.length > 0 && !showResults) {
    const allPlayersFinished = gameState.players.every((player) => {
      const playerLettersForCheck = playerLetters[player.id] || []
      return playerLettersForCheck.every((l) => l.status !== "pending")
    })

    if (allPlayersFinished) {
      setTimeout(() => setShowResults(true), 500)
    }
  }

  const currentPlayer = getCurrentPlayer()
  const stats = getGameStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Link href="/">
              <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                <ArrowLeft className="w-4 h-4" />
                Volver
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-gray-800">Pasapalabra Multijugador</h1>
          </div>

          <div className="flex items-center justify-center gap-6 mb-4">
            <Timer timeRemaining={gameState.timeRemaining} />
            <div className="flex items-center gap-2 text-gray-600">
              <Globe className="w-5 h-5" />
              <span>Español</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2"
              disabled={gameState.isPlaying}
            >
              <Settings className="w-4 h-4" />
              Configuración
            </Button>
            {gameState.isPlaying && (
              <Button
                variant="outline"
                size="sm"
                onClick={togglePause}
                className="flex items-center gap-2 bg-transparent"
              >
                {gameState.isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                {gameState.isPaused ? "Reanudar" : "Pausar"}
              </Button>
            )}
          </div>

          {currentPlayer && gameState.isPlaying && (
            <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg inline-block">
              <span className="font-semibold">Turno de: {currentPlayer.name}</span>
            </div>
          )}
        </header>

        {!gameState.isPlaying && gameState.players.length === 0 ? (
          // Setup screen
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-4">Modo Multijugador</h2>
            <p className="text-gray-600 mb-8">Compite con tus amigos en el rosco de Pasapalabra</p>
            <Button onClick={handleStartGame} size="lg" className="px-8">
              Configurar Partida
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Rosco del Jugador Activo */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-center mb-4 sm:mb-6">
                  {currentPlayer ? `Rosco de ${currentPlayer.name}` : "Rosco"}
                </h2>
                <MultiplayerRosco
                  playerLetters={playerLetters}
                  players={gameState.players}
                  currentLetter={gameState.currentLetter}
                  currentPlayer={currentPlayer}
                  showOnlyActive={true}
                />

                {/* Progreso del Rosco - Movido aquí para móvil */}
                <div className="mt-6 lg:hidden">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Progreso del Rosco</h3>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>
                        Completadas:{" "}
                        {currentPlayer
                          ? playerLetters[currentPlayer.id]?.filter((l) => l.status === "correct").length || 0
                          : 0}
                        /26
                      </span>
                      <span>
                        Restantes:{" "}
                        {currentPlayer
                          ? playerLetters[currentPlayer.id]?.filter((l) => l.status === "pending").length || 26
                          : 26}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel de Control y Marcador */}
            <div className="lg:col-span-1 space-y-4 sm:space-y-6">
              {/* Marcador */}
              <MultiplayerScoreboard
                players={stats.players}
                currentPlayer={currentPlayer}
                roundsCompleted={gameState.roundsCompleted}
              />

              {/* Progreso del Rosco - Solo en desktop */}
              <div className="hidden lg:block">
                <div className="bg-white rounded-2xl shadow-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">Progreso del Rosco</h3>
                  {currentPlayer && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Correctas:</span>
                        <span className="font-medium text-green-600">
                          {playerLetters[currentPlayer.id]?.filter((l) => l.status === "correct").length || 0}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Incorrectas:</span>
                        <span className="font-medium text-red-600">
                          {playerLetters[currentPlayer.id]?.filter((l) => l.status === "incorrect").length || 0}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Pasapalabra:</span>
                        <span className="font-medium text-yellow-600">
                          {playerLetters[currentPlayer.id]?.filter((l) => l.status === "skipped").length || 0}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Restantes:</span>
                        <span className="font-medium text-blue-600">
                          {playerLetters[currentPlayer.id]?.filter((l) => l.status === "pending").length || 26}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Panel de Juego */}
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                {!gameState.isPlaying ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">Partida terminada</p>
                    <Button onClick={handleStartGame}>Nueva Partida</Button>
                  </div>
                ) : gameState.isPaused ? (
                  <div className="text-center py-8">
                    <Pause className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Juego pausado</p>
                    <Button onClick={togglePause} className="mt-4">
                      Reanudar
                    </Button>
                  </div>
                ) : (
                  <>
                    <QuestionPanel
                      question={currentQuestion?.question || ""}
                      letter={gameState.currentLetter}
                      isPlaying={gameState.isPlaying}
                    />
                    <div className="mt-6">
                      <ResponseButtons onResponse={handleResponse} />
                    </div>
                    <div className="mt-4">
                      <Button variant="destructive" onClick={endGame} className="w-full">
                        Terminar Juego
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
        {showSetup && (
          <MultiplayerSetup
            playerCount={gameState.settings.playerCount || 2}
            onStart={handleSetupComplete}
            onClose={() => setShowSetup(false)}
          />
        )}

        {showSettings && (
          <GameSettings
            settings={gameState.settings}
            onSave={(settings) => {
              updateSettings(settings)
              setShowSettings(false)
            }}
            onClose={() => setShowSettings(false)}
          />
        )}

        {showResults && (
          <MultiplayerResults players={stats.players} onPlayAgain={handlePlayAgain} onNewGame={handleNewGame} />
        )}
      </div>
    </div>
  )
}
