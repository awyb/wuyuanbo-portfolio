"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

// 游戏常量
const GRID_WIDTH = 3; // 3列
const GRID_HEIGHT = 12; // 12行
const CELL_SIZE = 60;
const STACK_WARNING_HEIGHT = 8; // 警戒线高度

// 方块类型
interface Block {
  id: string;
  value: number;
  row: number;
  col: number;
}

export default function NumberStack() {
  // 游戏状态
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [nextBlock, setNextBlock] = useState<{
    value: number;
    col: number;
  } | null>(null);

  // 生成随机方块
  const generateRandomBlock = useCallback(() => {
    const value = Math.random() < 0.8 ? 2 : 4;
    const col = Math.floor(Math.random() * GRID_WIDTH);
    return { value, col };
  }, []);

  // 初始化游戏
  const initializeGame = useCallback(() => {
    setBlocks([]);
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    setNextBlock(generateRandomBlock());
  }, [generateRandomBlock]);

  // 获取列中最低的行
  const getLowestRow = useCallback(
    (col: number, currentBlocks: Block[]): number => {
      let maxRow = GRID_HEIGHT - 1;
      for (const block of currentBlocks) {
        if (block.col === col && block.row < maxRow) {
          maxRow = block.row - 1;
        }
      }
      return maxRow;
    },
    [],
  );

  // 检查并合并方块
  const checkAndMergeBlocks = useCallback((currentBlocks: Block[]): Block[] => {
    let newBlocks = [...currentBlocks];
    let merged = true;
    let scoreGain = 0;

    while (merged) {
      merged = false;

      for (let i = 0; i < newBlocks.length; i++) {
        for (let j = i + 1; j < newBlocks.length; j++) {
          const block1 = newBlocks[i];
          const block2 = newBlocks[j];

          // 检查是否相邻且相同
          if (
            block1.value === block2.value &&
            block1.col === block2.col &&
            Math.abs(block1.row - block2.row) === 1
          ) {
            // 合并
            const mergedRow = Math.min(block1.row, block2.row);
            const mergedValue = block1.value * 2;
            scoreGain += mergedValue * 10;

            // 移除旧方块，添加新方块
            newBlocks = newBlocks.filter((_, idx) => idx !== i && idx !== j);
            newBlocks.push({
              id: `merged-${Date.now()}-${Math.random()}`,
              value: mergedValue,
              row: mergedRow,
              col: block1.col,
            });

            merged = true;
            break;
          }
        }
        if (merged) break;
      }
    }

    if (scoreGain > 0) {
      setScore((prev) => {
        const newScore = prev + scoreGain;
        setHighScore((prevHigh) => Math.max(prevHigh, newScore));
        return newScore;
      });
    }

    return newBlocks;
  }, []);

  // 放置方块
  const placeBlock = useCallback(
    (col: number) => {
      if (!gameStarted || gameOver || !nextBlock) return;

      const lowestRow = getLowestRow(col, blocks);

      if (lowestRow < 0) {
        // 列已满
        setGameOver(true);
        return;
      }

      const newBlock: Block = {
        id: `block-${Date.now()}-${Math.random()}`,
        value: nextBlock.value,
        row: lowestRow,
        col: col,
      };

      const newBlocks = [...blocks, newBlock];
      const mergedBlocks = checkAndMergeBlocks(newBlocks);

      // 检查是否超过警戒线
      const maxHeight = mergedBlocks.reduce(
        (max, block) => Math.min(max, block.row),
        GRID_HEIGHT,
      );
      if (maxHeight < 0) {
        setGameOver(true);
        return;
      }

      setBlocks(mergedBlocks);
      setNextBlock(generateRandomBlock());
    },
    [
      gameStarted,
      gameOver,
      nextBlock,
      blocks,
      getLowestRow,
      checkAndMergeBlocks,
      generateRandomBlock,
    ],
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

      if (e.key === "1") {
        e.preventDefault();
        placeBlock(0);
      }
      if (e.key === "2") {
        e.preventDefault();
        placeBlock(1);
      }
      if (e.key === "3") {
        e.preventDefault();
        placeBlock(2);
      }
    },
    [gameStarted, gameOver, initializeGame, placeBlock],
  );

  // 监听键盘事件
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  // 重置游戏
  const resetGame = useCallback(() => {
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

  // 获取最高的方块（最小行号）
  const getMinRow = (): number => {
    if (blocks.length === 0) return GRID_HEIGHT;
    return Math.min(...blocks.map((b) => b.row));
  };

  const minRow = getMinRow();
  const isWarning = minRow <= GRID_HEIGHT - STACK_WARNING_HEIGHT;

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
        {blocks.map((block) => (
          <div
            key={block.id}
            className={`absolute flex items-center justify-center rounded-lg font-bold text-white transition-all ${getBlockColor(
              block.value,
            )}`}
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
        ))}

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
              onClick={() => placeBlock(col)}
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
