"use client"

import { useState } from "react"
import { RoscoWheel } from "@/components/rosco-wheel"
import { GameControls } from "@/components/game-controls"
import { GameStats } from "@/components/game-stats"
import { Timer } from "@/components/timer"
import { QuestionPanel } from "@/components/question-panel"
import { ResponseButtons } from "@/components/response-buttons"
import { GameSettings } from "@/components/game-settings"
import { AdvancedSettings } from "@/components/advanced-settings"
import { GameResults } from "@/components/game-results"
import { GameProgress } from "@/components/game-progress"
import { CustomQuestionsManager } from "@/components/custom-questions-manager"
import { useGameLogic } from "@/hooks/use-game-logic"
import { useSettings } from "@/hooks/use-settings"
import { Button } from "@/components/ui/button"
import { Settings, Globe, Pause, Play, Users, Shield } from "lucide-react"
import Link from "next/link"

export default function PasapalabraGame() {
  const {
    gameState,
    currentQuestion,
    startGame,
    handleResponse,
    togglePause,
    endGame,
    resetGame,
    updateSettings,
    jumpToLetter,
    getGameStats,
  } = useGameLogic()

  const {
    settings: extendedSettings,
    isLoaded,
    saveSettings,
    resetSettings,
    exportSettings,
    importSettings,
  } = useSettings()

  const [showSettings, setShowSettings] = useState(false)
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showCustomQuestions, setShowCustomQuestions] = useState(false)

  const handleGameEnd = () => {
    setShowResults(true)
  }

  const handlePlayAgain = () => {
    setShowResults(false)
    resetGame()
    setTimeout(() => startGame(), 100)
  }

  const handleNewGame = () => {
    setShowResults(false)
    resetGame()
    setShowSettings(true)
  }

  const handleSettingsSave = (newSettings: any) => {
    updateSettings(newSettings)
    setShowSettings(false)
  }

  const handleAdvancedSettingsSave = (newSettings: any) => {
    saveSettings(newSettings)
    updateSettings(newSettings)
    setShowAdvancedSettings(false)
  }

  const handleAdvancedResponse = (isCorrect: boolean) => {
    handleResponse(isCorrect ? "correct" : "incorrect")
  }

  const handlePassapalabra = () => {
    handleResponse("skip")
  }

  if (!gameState.isPlaying && gameState.score.remaining < 26 && !showResults) {
    setTimeout(() => setShowResults(true), 500)
  }

  const completedLetters = gameState.letters.filter((l) => l.status !== "pending").length
  const stats = getGameStats()

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Cargando configuración...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 ${
        extendedSettings.fontSize === "large" ? "text-lg" : extendedSettings.fontSize === "small" ? "text-sm" : ""
      } ${extendedSettings.highContrast ? "contrast-more" : ""}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">Pasapalabra</h1>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-4">
            <Timer timeRemaining={gameState.timeRemaining} />
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Globe className="w-5 h-5" />
              <span className="hidden sm:inline">
                {extendedSettings.language === "es"
                  ? "Español"
                  : extendedSettings.language === "en"
                    ? "English"
                    : "Français"}
              </span>
              <span className="sm:hidden">ES</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2"
              disabled={gameState.isPlaying}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Configuración</span>
            </Button>
            <Link href="/admin">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
                disabled={gameState.isPlaying}
              >
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            </Link>
            <Link href="/multiplayer">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-transparent"
                disabled={gameState.isPlaying}
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Multi</span>
              </Button>
            </Link>
            {gameState.isPlaying && (
              <Button
                variant="outline"
                size="sm"
                onClick={togglePause}
                className="flex items-center gap-2 bg-transparent"
              >
                {gameState.isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                <span className="hidden sm:inline">{gameState.isPaused ? "Reanudar" : "Pausar"}</span>
              </Button>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          {/* Rosco */}
          <div className="lg:col-span-2 order-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-center mb-4 sm:mb-6 dark:text-gray-100">Rosco</h2>
              <RoscoWheel
                letters={gameState.letters}
                currentLetter={gameState.currentLetter}
                onLetterClick={jumpToLetter}
                isPlaying={gameState.isPlaying}
              />
            </div>
          </div>

          {/* Panel de Control */}
          <div className="space-y-4 lg:space-y-6 order-2">
            {gameState.isPlaying && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-4">
                <GameProgress
                  totalLetters={26}
                  completedLetters={completedLetters}
                  currentLetter={gameState.currentLetter}
                />
              </div>
            )}

            {/* Estado del Juego */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6">
              {!gameState.isPlaying ? (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-300">Esperando...</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-6">
                    <p>
                      Idioma:{" "}
                      {extendedSettings.language === "es"
                        ? "Español"
                        : extendedSettings.language === "en"
                          ? "English"
                          : "Français"}
                    </p>
                    <p>Dificultad: {gameState.settings.difficulty}</p>
                    <p>
                      Duración del Rosco: {Math.floor(gameState.settings.duration / 60)}:
                      {(gameState.settings.duration % 60).toString().padStart(2, "0")}
                    </p>
                  </div>
                  <GameControls onStart={startGame} isPlaying={gameState.isPlaying} />
                </div>
              ) : (
                <div>
                  {gameState.isPaused ? (
                    <div className="text-center py-8">
                      <Pause className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600 dark:text-gray-300">Juego pausado</p>
                      <Button onClick={togglePause} className="mt-4">
                        Reanudar
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4">
                        <QuestionPanel
                          question={currentQuestion?.question || ""}
                          letter={gameState.currentLetter}
                          isPlaying={gameState.isPlaying}
                          currentQuestion={
                            currentQuestion
                              ? {
                                  question: currentQuestion.question,
                                  answer: currentQuestion.answer,
                                  difficulty: gameState.settings.difficulty,
                                }
                              : undefined
                          }
                          onAnswer={handleAdvancedResponse}
                          onPassapalabra={handlePassapalabra}
                        />
                      </div>
                      {extendedSettings.responseMode === "buttons" && (
                        <div className="mt-4">
                          <ResponseButtons onResponse={handleResponse} />
                        </div>
                      )}
                    </>
                  )}
                  <div className="mt-4">
                    <Button variant="destructive" onClick={endGame} className="w-full">
                      Terminar Juego
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Estadísticas */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-4">
              <GameStats score={gameState.score} />
            </div>
          </div>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <GameSettings
            settings={gameState.settings}
            onSave={handleSettingsSave}
            onClose={() => setShowSettings(false)}
            onAdvanced={() => {
              setShowSettings(false)
              setShowAdvancedSettings(true)
            }}
          />
        )}

        {/* Advanced Settings Modal */}
        {showAdvancedSettings && (
          <AdvancedSettings
            settings={extendedSettings}
            onSave={handleAdvancedSettingsSave}
            onClose={() => setShowAdvancedSettings(false)}
            onReset={resetSettings}
            onExport={exportSettings}
            onImport={importSettings}
          />
        )}

        {/* Custom Questions Manager Modal */}
        {showCustomQuestions && <CustomQuestionsManager onClose={() => setShowCustomQuestions(false)} />}

        {/* Results Modal */}
        {showResults && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
              <GameResults
                score={gameState.score}
                timeElapsed={gameState.settings.duration - gameState.timeRemaining}
                totalTime={gameState.settings.duration}
                accuracy={stats.accuracy}
                onPlayAgain={handlePlayAgain}
                onNewGame={handleNewGame}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
