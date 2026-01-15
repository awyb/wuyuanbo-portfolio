"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

// 游戏常量
const GRID_WIDTH = 3; // 3列
const GRID_HEIGHT = 12; // 12行
const CELL_SIZE = 60;
const INITIAL_DROP_SPEED = 800; // ms
const STACK_WARNING_HEIGHT = 8; // 警戒线高度

// 方块类型
interface Block {
  id: string;
  value: number; // 2, 4, 8, 16, 32...
  row: number;
  col: number;
  isNew?: boolean;
  isAnimating?: boolean;
}

interface GameGrid {
  [key: string]: Block | null;
}

export default function NumberStack() {
  // 游戏状态
  const [grid, setGrid] = useState<GameGrid>({});
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [dropSpeed, setDropSpeed] = useState(INITIAL_DROP_SPEED);
  const [nextBlock, setNextBlock] = useState<{
    value: number;
    col: number;
  } | null>(null);
  const [comboCount, setComboCount] = useState(0);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const dropLoopRef = useRef<NodeJS.Timeout | null>(null);

  // 生成随机方块
  const generateRandomBlock = useCallback(() => {
    const value = Math.random() < 0.8 ? 2 : 4; // 80% 概率生成2，20% 概率生成4
    const col = Math.floor(Math.random() * GRID_WIDTH);
    return { value, col };
  }, []);

  // 初始化游戏
  const initializeGame = useCallback(() => {
    setGrid({});
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    setDropSpeed(INITIAL_DROP_SPEED);
    setComboCount(0);
    setNextBlock(generateRandomBlock());
  }, [generateRandomBlock]);

  // 获取网格键
  const getGridKey = (row: number, col: number) => `${row}-${col}`;

  // 获取列中最低的空行
  const getLowestEmptyRow = useCallback(
    (col: number) => {
      for (let row = GRID_HEIGHT - 1; row >= 0; row--) {
        if (!grid[getGridKey(row, col)]) {
          return row;
        }
      }
      return -1; // 列已满
    },
    [grid],
  );

  // 检查游戏是否结束
  const checkGameOver = useCallback((currentGrid: GameGrid) => {
    // 检查顶部是否有方块
    for (let col = 0; col < GRID_WIDTH; col++) {
      if (currentGrid[getGridKey(0, col)]) {
        return true;
      }
    }
    return false;
  }, []);

  // 检查并消除可合并的方块
  const checkAndMergeBlocks = useCallback((currentGrid: GameGrid): GameGrid => {
    const newGrid = { ...currentGrid };
    let merged = false;
    let newScore = 0;

    // 遍历所有方块，查找可合并的
    const blockEntries = Object.entries(newGrid).filter(
      ([_, block]) => block !== null,
    );

    for (let i = 0; i < blockEntries.length; i++) {
      const [key1, block1] = blockEntries[i] as [string, Block];
      if (!block1) continue;

      for (let j = i + 1; j < blockEntries.length; j++) {
        const [key2, block2] = blockEntries[j] as [string, Block];
        if (!block2) continue;

        // 检查是否相邻且相同
        if (
          block1.value === block2.value &&
          Math.abs(block1.row - block2.row) +
            Math.abs(block1.col - block2.col) ===
            1
        ) {
          // 合并方块
          const mergedValue = block1.value * 2;
          const mergedRow = Math.min(block1.row, block2.row);
          const mergedCol =
            block1.col === block2.col
              ? block1.col
              : Math.min(block1.col, block2.col);

          newGrid[key1] = null;
          newGrid[key2] = null;
          newGrid[getGridKey(mergedRow, mergedCol)] = {
            id: `merged-${Date.now()}-${Math.random()}`,
            value: mergedValue,
            row: mergedRow,
            col: mergedCol,
            isNew: true,
          };

          newScore += mergedValue * 10;
          merged = true;
        }
      }
    }

    if (merged) {
      setScore((prev) => prev + newScore);
      setComboCount((prev) => prev + 1);
      // 递归检查是否还有可合并的
      return checkAndMergeBlocks(newGrid);
    }

    return newGrid;
  }, []);

  // 放置方块
  const placeBlock = useCallback(
    (block: { value: number; col: number }) => {
      const row = getLowestEmptyRow(block.col);

      if (row === -1) {
        // 列已满，游戏结束
        setGameOver(true);
        return;
      }

      const newBlock: Block = {
        id: `block-${Date.now()}-${Math.random()}`,
        value: block.value,
        row,
        col: block.col,
        isNew: true,
      };

      setGrid((prevGrid) => {
        const newGrid = { ...prevGrid };
        newGrid[getGridKey(row, block.col)] = newBlock;

        // 检查并合并
        const mergedGrid = checkAndMergeBlocks(newGrid);

        // 检查游戏是否结束
        if (checkGameOver(mergedGrid)) {
          setGameOver(true);
        }

        return mergedGrid;
      });

      // 生成下一个方块
      setNextBlock(generateRandomBlock());
      setComboCount(0);
    },
    [
      getLowestEmptyRow,
      checkAndMergeBlocks,
      checkGameOver,
      generateRandomBlock,
    ],
  );

  // 处理放置方块
  const handlePlaceBlock = useCallback(
    (col: number) => {
      if (!gameStarted || gameOver || !nextBlock) return;
      placeBlock(nextBlock);
    },
    [gameStarted, gameOver, nextBlock, placeBlock],
  );

  // 处理键盘输入
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (!gameStarted && (e.key === " " || e.key === "Enter")) {
        e.preventDefault();
        initializeGame();
        return;
      }

      if (gameOver && (e.key === " " || e.key === "Enter")) {
        e.preventDefault();
        initializeGame();
        return;
      }

      if (e.key === "1") handlePlaceBlock(0);
      if (e.key === "2") handlePlaceBlock(1);
      if (e.key === "3") handlePlaceBlock(2);
    },
    [gameStarted, gameOver, initializeGame, handlePlaceBlock],
  );

  // 监听键盘事件
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  // 自动下落逻辑（可选）
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    // 可以在这里添加自动下落的逻辑
    // 目前是点击放置模式
  }, [gameStarted, gameOver]);

  // 重置游戏
  const resetGame = useCallback(() => {
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    if (dropLoopRef.current) clearInterval(dropLoopRef.current);
    initializeGame();
  }, [initializeGame]);

  // 获取方块颜色
  const getBlockColor = (value: number): string => {
    const colors: { [key: number]: string } = {
      2: "bg-blue-400",
      4: "bg-blue-500",
      8: "bg-blue-600",
      16: "bg-purple-500",
      32: "bg-purple-600",
      64: "bg-pink-500",
      128: "bg-pink-600",
      256: "bg-red-500",
      512: "bg-red-600",
      1024: "bg-orange-500",
      2048: "bg-yellow-500",
    };
    return colors[value] || "bg-gray-500";
  };

  // 获取最高的方块
  const getMaxHeight = (): number => {
    let maxRow = -1;
    Object.values(grid).forEach((block) => {
      if (block && block.row < maxRow) {
        maxRow = block.row;
      }
    });
    return maxRow === -1 ? GRID_HEIGHT : GRID_HEIGHT - maxRow;
  };

  const maxHeight = getMaxHeight();
  const isWarning = maxHeight >= STACK_WARNING_HEIGHT;

  return (
    <div className="mx-auto w-full max-w-md">
      {/* 游戏信息 */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-blue-100 p-4 text-center dark:bg-blue-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">分数</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {score}
          </p>
        </div>
        <div className="rounded-lg bg-purple-100 p-4 text-center dark:bg-purple-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">最高分</p>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {highScore}
          </p>
        </div>
      </div>

      {/* 游戏画布 */}
      <div
        className={`relative mb-6 overflow-hidden rounded-lg border-4 transition-colors ${
          isWarning
            ? "border-red-500 bg-red-50 dark:bg-red-900"
            : "border-gray-700 bg-gray-900"
        }`}
        style={{
          width: GRID_WIDTH * CELL_SIZE,
          height: GRID_HEIGHT * CELL_SIZE,
          margin: "0 auto",
        }}
      >
        {/* 警戒线 */}
        <div
          className="absolute left-0 right-0 border-t-2 border-dashed border-yellow-400 opacity-50"
          style={{
            top: (GRID_HEIGHT - STACK_WARNING_HEIGHT) * CELL_SIZE,
          }}
        />

        {/* 方块 */}
        {Object.entries(grid).map(([key, block]) => {
          if (!block) return null;
          return (
            <div
              key={block.id}
              className={`absolute flex transform items-center justify-center rounded-lg font-bold text-white transition-all ${getBlockColor(
                block.value,
              )} ${block.isNew ? "scale-110" : "scale-100"}`}
              style={{
                left: block.col * CELL_SIZE + 2,
                top: block.row * CELL_SIZE + 2,
                width: CELL_SIZE - 4,
                height: CELL_SIZE - 4,
                fontSize: block.value > 128 ? "20px" : "24px",
              }}
            >
              {block.value}
            </div>
          );
        })}

        {/* 网格线 */}
        <svg
          className="absolute inset-0 h-full w-full"
          style={{ opacity: 0.1 }}
        >
          {Array.from({ length: GRID_WIDTH + 1 }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={i * CELL_SIZE}
              y1={0}
              x2={i * CELL_SIZE}
              y2={GRID_HEIGHT * CELL_SIZE}
              stroke="white"
            />
          ))}
          {Array.from({ length: GRID_HEIGHT + 1 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1={0}
              y1={i * CELL_SIZE}
              x2={GRID_WIDTH * CELL_SIZE}
              y2={i * CELL_SIZE}
              stroke="white"
            />
          ))}
        </svg>
      </div>

      {/* 下一个方块预览 */}
      {nextBlock && gameStarted && !gameOver && (
        <div className="mb-6 rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-800">
          <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
            下一个方块
          </p>
          <div className="flex justify-center">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-lg text-2xl font-bold text-white ${getBlockColor(
                nextBlock.value,
              )}`}
            >
              {nextBlock.value}
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            将放在第 {nextBlock.col + 1} 列
          </p>
        </div>
      )}

      {/* 游戏状态提示 */}
      {!gameStarted && !gameOver && (
        <div className="mb-6 rounded-lg bg-blue-50 p-4 text-center dark:bg-blue-900">
          <p className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            准备好了吗？
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            按{" "}
            <span className="rounded bg-gray-200 px-2 py-1 font-mono dark:bg-gray-700">
              空格
            </span>{" "}
            或{" "}
            <span className="rounded bg-gray-200 px-2 py-1 font-mono dark:bg-gray-700">
              Enter
            </span>{" "}
            开始游戏
          </p>
        </div>
      )}

      {gameOver && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-center dark:bg-red-900">
          <p className="mb-2 text-2xl font-bold text-red-600 dark:text-red-400">
            游戏结束！
          </p>
          <p className="mb-3 text-gray-600 dark:text-gray-400">
            最终分数：<span className="text-lg font-bold">{score}</span>
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            按{" "}
            <span className="rounded bg-gray-200 px-2 py-1 font-mono dark:bg-gray-700">
              空格
            </span>{" "}
            或{" "}
            <span className="rounded bg-gray-200 px-2 py-1 font-mono dark:bg-gray-700">
              Enter
            </span>{" "}
            重新开始
          </p>
        </div>
      )}

      {gameStarted && !gameOver && (
        <div className="mb-6 rounded-lg bg-green-50 p-4 text-center dark:bg-green-900">
          <p className="text-lg font-semibold text-green-600 dark:text-green-400">
            🎮 游戏进行中...
          </p>
        </div>
      )}

      {/* 控制按钮（移动端） */}
      <div className="mb-6">
        <p className="mb-3 text-center text-sm text-gray-600 dark:text-gray-400">
          点击放置方块
        </p>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 3 }).map((_, col) => (
            <button
              key={col}
              onClick={() => handlePlaceBlock(col)}
              disabled={!gameStarted || gameOver}
              className={`transform rounded-lg px-3 py-4 font-bold text-white transition-all active:scale-95 ${
                gameStarted && !gameOver
                  ? "cursor-pointer bg-blue-500 hover:bg-blue-600"
                  : "cursor-not-allowed bg-gray-400 opacity-50"
              }`}
            >
              第 {col + 1} 列
            </button>
          ))}
        </div>
      </div>

      {/* 游戏规则 */}
      <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
        <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
          📖 游戏规则
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>✅ 点击下方按钮选择列，放置方块</li>
          <li>✅ 相同数字的方块相邻时会自动合并</li>
          <li>✅ 合并后的方块数值翻倍，获得分数</li>
          <li>✅ 黄色虚线是警戒线，超过则游戏结束</li>
          <li>✅ 合并越多方块，分数越高</li>
          <li>✅ 挑战自己的最高分！</li>
        </ul>
      </div>

      {/* 重置按钮 */}
      <div className="mt-6 text-center">
        <button
          onClick={resetGame}
          className="rounded-lg bg-gray-500 px-6 py-2 font-bold text-white transition-colors hover:bg-gray-600"
        >
          重置游戏
        </button>
      </div>
    </div>
  );
}
