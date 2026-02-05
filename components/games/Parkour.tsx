'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react'

interface GameState {
  isRunning: boolean
  isGameOver: boolean
  score: number
  highScore: number
}

interface Player {
  x: number
  y: number
  width: number
  height: number
  velocityY: number
  isJumping: boolean
}

interface Obstacle {
  x: number
  y: number
  width: number
  height: number
  type: 'ground' | 'air'
  passed?: boolean
}

const GRAVITY = 0.8
const JUMP_FORCE = -15
const GROUND_Y = 400
const PLAYER_WIDTH = 50
const PLAYER_HEIGHT = 50
const OBSTACLE_SPEED = 6
const OBSTACLE_SPAWN_RATE = 120 // frames

export default function Parkour() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const frameCountRef = useRef(0)

  const [gameState, setGameState] = useState<GameState>({
    isRunning: false,
    isGameOver: false,
    score: 0,
    highScore: Number.parseInt(localStorage.getItem('parkourHighScore') || '0', 10),
  })

  const playerRef = useRef<Player>({
    x: 100,
    y: GROUND_Y - PLAYER_HEIGHT,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    velocityY: 0,
    isJumping: false,
  })

  const obstaclesRef = useRef<Obstacle[]>([])

  const updateHighScore = useCallback(
    (score: number) => {
      if (score > gameState.highScore) {
        localStorage.setItem('parkourHighScore', score.toString())
        setGameState(prev => ({ ...prev, highScore: score }))
      }
    },
    [gameState.highScore],
  )

  const jump = useCallback(() => {
    if (!gameState.isRunning || gameState.isGameOver) return

    const player = playerRef.current
    if (!player.isJumping) {
      player.velocityY = JUMP_FORCE
      player.isJumping = true
    }
  }, [gameState.isRunning, gameState.isGameOver])

  const startGame = useCallback(() => {
    playerRef.current = {
      x: 100,
      y: GROUND_Y - PLAYER_HEIGHT,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
      velocityY: 0,
      isJumping: false,
    }
    obstaclesRef.current = []
    frameCountRef.current = 0
    setGameState({
      isRunning: true,
      isGameOver: false,
      score: 0,
      highScore: gameState.highScore,
    })
  }, [gameState.highScore])

  const checkCollision = useCallback((player: Player, obstacle: Obstacle): boolean => {
    return (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    )
  }, [])

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !gameState.isRunning) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Update player
    const player = playerRef.current
    player.velocityY += GRAVITY
    player.y += player.velocityY

    // Ground collision
    if (player.y >= GROUND_Y - player.height) {
      player.y = GROUND_Y - player.height
      player.velocityY = 0
      player.isJumping = false
    }

    // Spawn obstacles
    frameCountRef.current++
    if (frameCountRef.current % OBSTACLE_SPAWN_RATE === 0) {
      const type = Math.random() > 0.7 ? 'air' : 'ground'
      let obstacle: Obstacle

      if (type === 'ground') {
        obstacle = {
          x: canvas.width,
          y: GROUND_Y - 40,
          width: 40,
          height: 40,
          type: 'ground',
        }
      } else {
        obstacle = {
          x: canvas.width,
          y: GROUND_Y - 120,
          width: 40,
          height: 40,
          type: 'air',
        }
      }

      obstaclesRef.current.push(obstacle)
    }

    // Update obstacles
    obstaclesRef.current = obstaclesRef.current.filter(obstacle => {
      obstacle.x -= OBSTACLE_SPEED

      // Check collision
      if (checkCollision(player, obstacle)) {
        setGameState(prev => {
          const newHighScore = Math.max(prev.score, prev.highScore)
          updateHighScore(prev.score)
          return {
            ...prev,
            isRunning: false,
            isGameOver: true,
            highScore: newHighScore,
          }
        })
        return false
      }

      // Score point when passed
      if (obstacle.x + obstacle.width < player.x && !obstacle.passed) {
        setGameState(prev => ({ ...prev, score: prev.score + 1 }))
        ;(obstacle as Obstacle & { passed: boolean }).passed = true
      }

      return obstacle.x + obstacle.width > 0
    })

    // Draw ground
    ctx.fillStyle = '#8B4513'
    ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y)

    // Draw grass
    ctx.fillStyle = '#228B22'
    ctx.fillRect(0, GROUND_Y, canvas.width, 10)

    // Draw player (simple character)
    const gradient = ctx.createLinearGradient(
      player.x,
      player.y,
      player.x,
      player.y + player.height,
    )
    gradient.addColorStop(0, '#FF6B6B')
    gradient.addColorStop(1, '#4ECDC4')
    ctx.fillStyle = gradient
    ctx.fillRect(player.x, player.y, player.width, player.height)

    // Draw player eyes
    ctx.fillStyle = 'white'
    ctx.beginPath()
    ctx.arc(player.x + 35, player.y + 15, 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = 'black'
    ctx.beginPath()
    ctx.arc(player.x + 37, player.y + 15, 3, 0, Math.PI * 2)
    ctx.fill()

    // Draw obstacles
    obstaclesRef.current.forEach(obstacle => {
      if (obstacle.type === 'ground') {
        // Ground obstacle (cactus-like)
        ctx.fillStyle = '#228B22'
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
        ctx.fillStyle = '#006400'
        ctx.fillRect(obstacle.x + 10, obstacle.y - 10, 20, 10)
      } else {
        // Air obstacle (bird-like)
        ctx.fillStyle = '#FFD700'
        ctx.beginPath()
        ctx.ellipse(
          obstacle.x + obstacle.width / 2,
          obstacle.y + obstacle.height / 2,
          obstacle.width / 2,
          obstacle.height / 2,
          0,
          0,
          Math.PI * 2,
        )
        ctx.fill()
        ctx.fillStyle = 'white'
        ctx.beginPath()
        ctx.arc(obstacle.x + 30, obstacle.y + 15, 5, 0, Math.PI * 2)
        ctx.fill()
      }
    })

    // Draw clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    const cloudOffset = (frameCountRef.current * 0.5) % (canvas.width + 200)
    ctx.beginPath()
    ctx.arc(canvas.width - cloudOffset, 80, 40, 0, Math.PI * 2)
    ctx.arc(canvas.width - cloudOffset + 50, 80, 50, 0, Math.PI * 2)
    ctx.arc(canvas.width - cloudOffset + 100, 80, 40, 0, Math.PI * 2)
    ctx.fill()

    // Continue game loop
    if (gameState.isRunning && !gameState.isGameOver) {
      animationFrameRef.current = requestAnimationFrame(gameLoop)
    }
  }, [gameState.isRunning, gameState.isGameOver, checkCollision, updateHighScore])

  useEffect(() => {
    if (gameState.isRunning && !gameState.isGameOver) {
      animationFrameRef.current = requestAnimationFrame(gameLoop)
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.isRunning, gameState.isGameOver])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault()
        if (!gameState.isRunning) {
          startGame()
        } else {
          jump()
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameState.isRunning, jump, startGame])

  return (
    <div className="mx-auto max-w-4xl">
      {/* 标题 */}
      <div className="mb-6 text-center">
        <h1 className="bg-linear-to-r mb-2 from-orange-600 to-red-600 bg-clip-text text-4xl font-black text-transparent">
          🏃 跑酷游戏
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          躲避障碍物，挑战最高分！按空格键或向上箭头跳跃
        </p>
      </div>

      {/* 游戏信息 */}
      <div className="mb-6 flex justify-between rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <div className="flex gap-6">
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">得分</div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {gameState.score}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">最高分</div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {gameState.highScore}
            </div>
          </div>
        </div>
        <button
          onClick={startGame}
          className="bg-linear-to-r rounded-lg from-orange-500 to-red-500 px-6 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        >
          {gameState.isRunning ? '重新开始' : '开始游戏'}
        </button>
      </div>

      {/* 游戏画布 */}
      <div className="relative mb-6">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className="bg-linear-to-b w-full rounded-xl from-sky-300 to-sky-100 shadow-2xl dark:from-sky-900 dark:to-sky-700"
        />

        {/* 游戏状态覆盖层 */}
        {!gameState.isRunning && !gameState.isGameOver && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50">
            <div className="text-center text-white">
              <div className="mb-4 text-6xl">🏃</div>
              <div className="mb-2 text-3xl font-bold">准备开始</div>
              <div className="text-xl">按空格键或点击按钮开始</div>
            </div>
          </div>
        )}

        {gameState.isGameOver && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/70">
            <div className="text-center text-white">
              <div className="mb-4 text-6xl">💥</div>
              <div className="mb-2 text-3xl font-bold">游戏结束</div>
              <div className="mb-4 text-2xl">得分: {gameState.score}</div>
              <div className="mb-6 text-xl">最高分: {gameState.highScore}</div>
              <button
                onClick={startGame}
                className="bg-linear-to-r rounded-lg from-orange-500 to-red-500 px-8 py-4 text-xl font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                再玩一次
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 移动端控制按钮 */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow-lg md:hidden dark:bg-gray-800">
        <button
          onClick={() => {
            if (!gameState.isRunning) {
              startGame()
            } else {
              jump()
            }
          }}
          className="bg-linear-to-r w-full rounded-lg from-orange-500 to-red-500 py-8 text-3xl font-bold text-white shadow-lg active:scale-95"
        >
          跳跃 🦘
        </button>
      </div>

      {/* 游戏说明 */}
      <div className="rounded-xl bg-gray-50 p-6 shadow-md dark:bg-gray-800">
        <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">📖 游戏说明</h3>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p>
            • 按 <kbd className="rounded bg-gray-200 px-2 py-1 dark:bg-gray-700">空格键</kbd> 或{' '}
            <kbd className="rounded bg-gray-200 px-2 py-1 dark:bg-gray-700">↑</kbd> 跳跃
          </p>
          <p>• 躲避地面障碍物（仙人掌）和空中障碍物（鸟）</p>
          <p>• 成功躲避障碍物获得分数</p>
          <p>• 碰到障碍物游戏结束</p>
          <p>• 挑战最高分记录！</p>
        </div>
      </div>
    </div>
  )
}
