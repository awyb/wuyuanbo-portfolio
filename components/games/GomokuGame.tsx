'use client'

import React, { useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

const BOARD_SIZE = 15
const EMPTY = 0
const BLACK = 1
const WHITE = 2

type GameMode = 'pvp' | 'pve'
type Winner = 'black' | 'white' | 'draw' | null

interface AIConfig {
  depth: number
}

const GomokuGame: React.FC = () => {
  const { t } = useLanguage()
  const [board, setBoard] = useState<number[][]>(() =>
    Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(EMPTY)),
  )
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(BLACK)
  const [winner, setWinner] = useState<Winner>(null)
  const [gameMode, setGameMode] = useState<GameMode>('pvp')
  const [gameStarted, setGameStarted] = useState(false)
  const [aiThinking, setAiThinking] = useState(false)

  // 检查获胜
  const checkWinner = useCallback(
    (board: number[][], row: number, col: number, player: number): boolean => {
      const directions = [
        [0, 1], // 水平
        [1, 0], // 垂直
        [1, 1], // 对角线
        [1, -1], // 反对角线
      ]

      for (const [dr, dc] of directions) {
        let count = 1

        // 正方向
        for (let i = 1; i < 5; i++) {
          const r = row + dr * i
          const c = col + dc * i
          if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE || board[r][c] !== player) break
          count++
        }

        // 反方向
        for (let i = 1; i < 5; i++) {
          const r = row - dr * i
          const c = col - dc * i
          if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE || board[r][c] !== player) break
          count++
        }

        if (count >= 5) return true
      }

      return false
    },
    [],
  )

  // 检查游戏是否结束
  const checkGameOver = useCallback((board: number[]): boolean => {
    return board.every(cell => cell !== EMPTY)
  }, [])

  // 评估棋盘（用于AI）- 更智能的评估函数
  const evaluateBoard = useCallback((board: number[][], player: number): number => {
    let score = 0
    const opponent = player === BLACK ? WHITE : BLACK

    // 评估所有四个方向
    const directions = [
      [0, 1], // 水平
      [1, 0], // 垂直
      [1, 1], // 对角线
      [1, -1], // 反对角线
    ]

    for (const [dr, dc] of directions) {
      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          // 检查连续的棋子
          let playerCount = 0
          let opponentCount = 0
          let emptyCount = 0

          for (let i = 0; i < 5; i++) {
            const r = row + dr * i
            const c = col + dc * i
            if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) break

            if (board[r][c] === player) playerCount++
            else if (board[r][c] === opponent) opponentCount++
            else emptyCount++
          }

          // 评分规则
          if (playerCount > 0 && opponentCount === 0) {
            // 玩家的棋
            if (playerCount === 5)
              score += 100000 // 成五
            else if (playerCount === 4 && emptyCount >= 1)
              score += 10000 // 活四
            else if (playerCount === 4)
              score += 1000 // 冲四
            else if (playerCount === 3 && emptyCount >= 2)
              score += 1000 // 活三
            else if (playerCount === 3)
              score += 100 // 眠三
            else if (playerCount === 2 && emptyCount >= 3)
              score += 100 // 活二
            else if (playerCount === 2)
              score += 10 // 眠二
            else if (playerCount === 1) score += 1
          } else if (opponentCount > 0 && playerCount === 0) {
            // 对手的棋 - 需要防守
            if (opponentCount === 5) score -= 90000
            else if (opponentCount === 4 && emptyCount >= 1) score -= 8000
            else if (opponentCount === 4) score -= 800
            else if (opponentCount === 3 && emptyCount >= 2) score -= 800
            else if (opponentCount === 3) score -= 80
            else if (opponentCount === 2 && emptyCount >= 3) score -= 80
            else if (opponentCount === 2) score -= 8
            else if (opponentCount === 1) score -= 1
          }
        }
      }
    }

    return score
  }, [])

  // 获取可能的移动
  const getPossibleMoves = useCallback((board: number[][]): [number, number][] => {
    const moves: [number, number][] = []
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (board[row][col] === EMPTY) {
          // 只考虑有邻居的位置
          let hasNeighbor = false
          for (let dr = -2; dr <= 2; dr++) {
            for (let dc = -2; dc <= 2; dc++) {
              if (dr === 0 && dc === 0) continue
              const r = row + dr
              const c = col + dc
              if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] !== EMPTY) {
                hasNeighbor = true
                break
              }
            }
            if (hasNeighbor) break
          }
          if (hasNeighbor || moves.length === 0) {
            moves.push([row, col])
          }
        }
      }
    }
    return moves
  }, [])

  // AI下棋 - 使用增强的评估算法
  const aiMove = useCallback(
    (currentBoard: number[][]): [number, number] => {
      const aiPlayer = WHITE
      const humanPlayer = BLACK

      // 获取所有可能的移动
      const moves = getPossibleMoves(currentBoard)

      // 如果没有找到可用的移动（第一步），返回中心位置
      if (moves.length === 0) {
        return [Math.floor(BOARD_SIZE / 2), Math.floor(BOARD_SIZE / 2)]
      }

      // 开局定式：如果棋盘上只有1-2个子，选择中心附近的位置
      const pieceCount = currentBoard.flat().filter(cell => cell !== EMPTY).length
      if (pieceCount <= 2) {
        const center = Math.floor(BOARD_SIZE / 2)
        let bestMove: [number, number] = [-1, -1]
        let minDist = Infinity
        for (const [row, col] of moves) {
          const dist = Math.abs(row - center) + Math.abs(col - center)
          if (dist < minDist) {
            minDist = dist
            bestMove = [row, col]
          }
        }
        return bestMove
      }

      // 使用增强的评估算法
      let bestScore = -Infinity
      let bestMove: [number, number] = [-1, -1]

      // 评估每个移动
      for (const [row, col] of moves) {
        const aiBoard = currentBoard.map(r => [...r])
        aiBoard[row][col] = aiPlayer

        // 检查这一步是否能赢
        if (checkWinner(aiBoard, row, col, aiPlayer)) {
          return [row, col] // 必胜
        }

        // 评估这一步的价值
        let score = evaluateBoard(aiBoard, aiPlayer)

        // 考虑防守价值：如果对手下这里，能赢吗？
        const humanBoard = currentBoard.map(r => [...r])
        humanBoard[row][col] = humanPlayer
        if (checkWinner(humanBoard, row, col, humanPlayer)) {
          // 必须防守
          score += 20000 // 阻止对手赢的优先级很高
        }

        // 多方向进攻评分
        const directions = [
          [0, 1],
          [1, 0],
          [1, 1],
          [1, -1],
        ]
        for (const [dr, dc] of directions) {
          // 统计AI在这个方向上的连续棋子
          let aiCount = 0
          let humanCount = 0
          for (let i = 1; i <= 4; i++) {
            const r = row + dr * i
            const c = col + dc * i
            if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) break
            if (aiBoard[r][c] === aiPlayer) aiCount++
            else if (aiBoard[r][c] === humanPlayer) humanCount++
            else break
          }

          // 进攻加分
          if (aiCount === 4 && humanCount === 0)
            score += 100000 // 活四
          else if (aiCount === 3 && humanCount === 0)
            score += 50000 // 活三
          else if (aiCount === 2 && humanCount === 0) score += 5000 // 活二

          // 防守权值
          if (humanCount === 4)
            score += 80000 // 阻止活四
          else if (humanCount === 3)
            score += 40000 // 阻止活三
          else if (humanCount === 2) score += 5000 // 阻止活二
        }

        if (score > bestScore) {
          bestScore = score
          bestMove = [row, col]
        }
      }

      return bestMove
    },
    [evaluateBoard, checkWinner, getPossibleMoves],
  )

  // 下棋
  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (!gameStarted || winner || board[row][col] !== EMPTY || aiThinking) return

      const newBoard = board.map(r => [...r])
      newBoard[row][col] = currentPlayer
      setBoard(newBoard)

      // 检查获胜
      if (checkWinner(newBoard, row, col, currentPlayer)) {
        setWinner(currentPlayer === BLACK ? 'black' : 'white')
        setGameStarted(false)
        return
      }

      // 检查平局
      if (checkGameOver(newBoard.flat())) {
        setWinner('draw')
        setGameStarted(false)
        return
      }

      // 切换玩家
      const nextPlayer = currentPlayer === BLACK ? WHITE : BLACK
      setCurrentPlayer(nextPlayer)

      // 如果是AI模式且轮到AI
      if (gameMode === 'pve' && nextPlayer === WHITE && !winner) {
        setAiThinking(true)
        setTimeout(() => {
          const [aiRow, aiCol] = aiMove(newBoard)
          if (aiRow !== -1 && aiCol !== -1) {
            const aiBoard = newBoard.map(r => [...r])
            aiBoard[aiRow][aiCol] = WHITE
            setBoard(aiBoard)

            // 检查获胜
            if (checkWinner(aiBoard, aiRow, aiCol, WHITE)) {
              setWinner('white')
              setGameStarted(false)
              setAiThinking(false)
              return
            }

            // 检查平局
            if (checkGameOver(aiBoard.flat())) {
              setWinner('draw')
              setGameStarted(false)
              setAiThinking(false)
              return
            }

            // 切换回黑棋
            setCurrentPlayer(BLACK)
          }
          setAiThinking(false)
        }, 700)
      }
    },
    [
      board,
      currentPlayer,
      gameStarted,
      winner,
      gameMode,
      aiThinking,
      checkWinner,
      checkGameOver,
      aiMove,
    ],
  )

  // 重置游戏
  const resetGame = useCallback(() => {
    setBoard(Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(EMPTY)))
    setCurrentPlayer(BLACK)
    setWinner(null)
    setGameStarted(true)
    setAiThinking(false)
  }, [])

  // 开始游戏
  const startGame = useCallback(
    (mode: GameMode) => {
      setGameMode(mode)
      resetGame()
    },
    [resetGame],
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
          {t('games.gomoku.title')}
        </h1>

        {/* 游戏模式选择 */}
        {!gameStarted && (
          <div className="mb-6 rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              {t('games.gomoku.selectMode')}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <button
                onClick={() => startGame('pvp')}
                className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 font-bold text-white shadow-lg transition-all hover:from-blue-700 hover:to-purple-700"
              >
                <div className="mb-2 text-4xl">👥</div>
                <div className="text-lg">{t('games.gomoku.pvpMode')}</div>
                <div className="mt-2 text-sm opacity-80">{t('games.gomoku.pvpDescription')}</div>
              </button>
              <button
                onClick={() => startGame('pve')}
                className="rounded-lg bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4 font-bold text-white shadow-lg transition-all hover:from-green-700 hover:to-teal-700"
              >
                <div className="mb-2 text-4xl">🤖</div>
                <div className="text-lg">{t('games.gomoku.aiMode')}</div>
                <div className="mt-2 text-sm opacity-80">{t('games.gomoku.aiDescription')}</div>
              </button>
            </div>
          </div>
        )}

        {/* 游戏信息 */}
        {gameStarted && (
          <div className="mb-4 rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white">
                    ●
                  </div>
                  <span className="text-gray-900 dark:text-white">{t('games.gomoku.black')}</span>
                  {currentPlayer === BLACK && !aiThinking && (
                    <span className="rounded bg-blue-600 px-2 py-1 text-xs text-white">
                      {t('games.gomoku.thinking')}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-400 bg-white">
                    ●
                  </div>
                  <span className="text-gray-900 dark:text-white">{t('games.gomoku.white')}</span>
                  {currentPlayer === WHITE && (
                    <span className="rounded bg-blue-600 px-2 py-1 text-xs text-white">
                      {aiThinking ? t('games.gomoku.aiThinking') : t('games.gomoku.thinking')}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={resetGame}
                className="rounded-lg bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700"
              >
                {t('games.gomoku.restart')}
              </button>
            </div>
          </div>
        )}

        {/* 游戏板 */}
        <div className="rounded-lg bg-amber-100 p-4 shadow-xl dark:bg-gray-700">
          <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)` }}>
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  disabled={!gameStarted || cell !== EMPTY || aiThinking}
                  className="relative aspect-square cursor-pointer border border-amber-800 bg-amber-50 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-800"
                  style={{ padding: '2px' }}
                >
                  {/* 棋盘交叉点 */}
                  <div
                    className={`absolute left-1/2 top-1/2 flex h-3/4 w-3/4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-transform hover:scale-110 ${
                      cell === BLACK
                        ? 'bg-black shadow-lg'
                        : cell === WHITE
                          ? 'border-2 border-gray-400 bg-white shadow-lg dark:border-gray-600'
                          : 'hover:bg-amber-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {cell !== EMPTY && '●'}
                  </div>
                </button>
              )),
            )}
          </div>
        </div>

        {/* 游戏结束弹窗 */}
        {winner && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="max-w-md rounded-lg bg-white p-8 text-center shadow-2xl dark:bg-gray-800">
              <div className="mb-4 text-6xl">
                {winner === 'black' && '⚫'}
                {winner === 'white' && '⚪'}
                {winner === 'draw' && '🤝'}
              </div>
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                {winner === 'draw' ? t('games.gomoku.draw') : t('games.gomoku.winner')}
              </h2>
              {winner !== 'draw' && (
                <p className="mb-6 text-xl text-gray-600 dark:text-gray-400">
                  {winner === 'black' ? t('games.gomoku.blackWins') : t('games.gomoku.whiteWins')}
                </p>
              )}
              <div className="flex gap-4">
                <button
                  onClick={resetGame}
                  className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-bold text-white shadow-lg transition-all hover:from-blue-700 hover:to-purple-700"
                >
                  {t('games.gomoku.playAgain')}
                </button>
                <button
                  onClick={() => setGameStarted(false)}
                  className="flex-1 rounded-lg border-2 border-gray-300 bg-gray-100 px-6 py-3 font-bold text-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                >
                  {t('games.gomoku.backToMenu')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 游戏规则 */}
        <div className="mt-6 rounded-lg bg-amber-50 p-4 dark:bg-gray-700">
          <h3 className="mb-2 font-bold text-gray-900 dark:text-white">
            {t('games.gomoku.rules')}
          </h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <li>{t('games.gomoku.rule1')}</li>
            <li>{t('games.gomoku.rule2')}</li>
            <li>{t('games.gomoku.rule3')}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default GomokuGame
