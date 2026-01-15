"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
// --- 游戏常量 ---
const GRID_SIZE = 25; // 40x40 的网格
const INITIAL_SPEED = 200; // 初始速度
const MIN_SPEED = 50; // 最快速度
// --- 类型定义 ---
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
interface Position {
  x: number;
  y: number;
}
export default function SnakeGame() {
  // --- 渲染状态 ---
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  // --- 游戏流程状态 ---
  const [gameStatus, setGameStatus] = useState<"IDLE" | "PLAYING" | "GAMEOVER">(
    "IDLE",
  );
  // --- 逻辑状态 Ref ---
  const gameStateRef = useRef({
    snake: [{ x: 10, y: 10 }],
    direction: "RIGHT" as Direction,
    nextDirection: "RIGHT" as Direction,
    food: { x: 15, y: 15 },
    score: 0,
    lastRenderTime: 0,
    speed: INITIAL_SPEED,
  });
  const requestRef = useRef<number | NodeJS.Timeout>(0);
  // --- 核心逻辑：生成食物 ---
  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    let isValid = false;
    while (!isValid) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      isValid = !currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y,
      );
    }
    return newFood!;
  }, []);
  // --- 核心逻辑：重置游戏 ---
  const resetGame = useCallback(() => {
    const initialSnake = [{ x: 10, y: 10 }];
    const initialFood = generateFood(initialSnake);
    gameStateRef.current = {
      snake: initialSnake,
      direction: "RIGHT",
      nextDirection: "RIGHT",
      food: initialFood,
      score: 0,
      lastRenderTime: 0,
      speed: INITIAL_SPEED,
    };
    setSnake(initialSnake);
    setFood(initialFood);
    setScore(0);
    setGameStatus("PLAYING");
  }, [generateFood]);
  // --- 核心逻辑：游戏循环 (Ref 方式解决循环依赖) ---
  // 我们把 gameLoop 函数本身存在 ref 里，这样函数内部就可以调用 requestRef.current(gameLoopRef.current)
  const gameLoopRef = useRef<(time: number) => void>(() => {});
  useEffect(() => {
    gameLoopRef.current = (time: number) => {
      if (gameStatus !== "PLAYING") return;
      const { lastRenderTime, speed, nextDirection } = gameStateRef.current;
      // 控制渲染速度
      if (time - lastRenderTime < speed) {
        requestRef.current = requestAnimationFrame(gameLoopRef.current!);
        return;
      }
      // 更新方向
      gameStateRef.current.direction = nextDirection;
      const { snake, direction, food } = gameStateRef.current;
      const head = snake[0];
      const newHead: Position = { ...head };
      switch (direction) {
        case "UP":
          newHead.y -= 1;
          break;
        case "DOWN":
          newHead.y += 1;
          break;
        case "LEFT":
          newHead.x -= 1;
          break;
        case "RIGHT":
          newHead.x += 1;
          break;
      }
      // 碰撞检测 (墙壁)
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameStatus("GAMEOVER");
        setHighScore((prev) => Math.max(prev, gameStateRef.current.score));
        return;
      }
      // 碰撞检测 (自身)
      if (snake.some((s) => s.x === newHead.x && s.y === newHead.y)) {
        setGameStatus("GAMEOVER");
        setHighScore((prev) => Math.max(prev, gameStateRef.current.score));
        return;
      }
      const newSnake = [newHead, ...snake];
      // 吃食物逻辑
      if (newHead.x === food.x && newHead.y === food.y) {
        gameStateRef.current.score += 10;
        setScore(gameStateRef.current.score);
        // 加速
        const newSpeed = Math.max(
          MIN_SPEED,
          INITIAL_SPEED - Math.floor(gameStateRef.current.score / 50) * 10,
        );
        gameStateRef.current.speed = newSpeed;
        // 生成新食物
        const newFoodPos = generateFood(newSnake);
        gameStateRef.current.food = newFoodPos;
        setFood(newFoodPos);
      } else {
        // 没吃到，移除尾部
        newSnake.pop();
      }
      gameStateRef.current.snake = newSnake;
      gameStateRef.current.lastRenderTime = time;
      setSnake(newSnake);
      // 继续下一帧
      requestRef.current = requestAnimationFrame(gameLoopRef.current!);
    };
  }, [gameStatus, generateFood]);

  // --- 生命周期：启动/停止循环 ---
  useEffect(() => {
    if (gameStatus === "PLAYING") {
      // 确保 ref 已经赋值
      if (gameLoopRef.current) {
        requestRef.current = requestAnimationFrame(gameLoopRef.current);
      }
    } else {
      if (requestRef.current)
        cancelAnimationFrame(requestRef.current as number);
    }
    return () => {
      if (requestRef.current)
        cancelAnimationFrame(requestRef.current as number);
    };
  }, [gameStatus]);
  // --- 输入处理 (WASD) ---
  const handleInput = useCallback(
    (e: KeyboardEvent) => {
      const { direction } = gameStateRef.current;
      if (gameStatus === "IDLE" || gameStatus === "GAMEOVER") {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          resetGame();
        }
        return;
      }
      const key = e.key.toLowerCase();
      switch (key) {
        case "w":
        case "arrowup":
          if (direction !== "DOWN") gameStateRef.current.nextDirection = "UP";
          break;
        case "s":
        case "arrowdown":
          if (direction !== "UP") gameStateRef.current.nextDirection = "DOWN";
          break;
        case "a":
        case "arrowleft":
          if (direction !== "RIGHT")
            gameStateRef.current.nextDirection = "LEFT";
          break;
        case "d":
        case "arrowright":
          if (direction !== "LEFT")
            gameStateRef.current.nextDirection = "RIGHT";
          break;
      }
    },
    [gameStatus, resetGame],
  );
  useEffect(() => {
    window.addEventListener("keydown", handleInput);
    return () => window.removeEventListener("keydown", handleInput);
  }, [handleInput]);
  // --- 点击控制 ---
  const handleDirectionClick = (newDir: Direction) => {
    if (gameStatus !== "PLAYING") return;
    const { direction } = gameStateRef.current;
    if (direction === "UP" && newDir === "DOWN") return;
    if (direction === "DOWN" && newDir === "UP") return;
    if (direction === "LEFT" && newDir === "RIGHT") return;
    if (direction === "RIGHT" && newDir === "LEFT") return;
    gameStateRef.current.nextDirection = newDir;
  };
  const getPosStyle = (pos: Position) => ({
    left: `${(pos.x / GRID_SIZE) * 100}%`,
    top: `${(pos.y / GRID_SIZE) * 100}%`,
    width: `${100 / GRID_SIZE}%`,
    height: `${100 / GRID_SIZE}%`,
  });
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col px-4">
      {/* 顶部数据栏 */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-blue-100 p-3 text-center backdrop-blur-sm dark:bg-blue-900/50">
          <p className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-300">
            Score
          </p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-200">
            {score}
          </p>
        </div>
        <div className="rounded-xl bg-purple-100 p-3 text-center backdrop-blur-sm dark:bg-purple-900/50">
          <p className="text-xs font-semibold uppercase text-purple-600 dark:text-purple-300">
            Length
          </p>
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-200">
            {snake.length}
          </p>
        </div>
        <div className="rounded-xl bg-green-100 p-3 text-center backdrop-blur-sm dark:bg-green-900/50">
          <p className="text-xs font-semibold uppercase text-green-600 dark:text-green-300">
            High Score
          </p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-200">
            {highScore}
          </p>
        </div>
      </div>
      {/* 游戏主容器 */}
      <div className="relative w-full">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl border-4 border-gray-700 bg-gray-900 shadow-2xl">
          {/* 背景网格 */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-20">
            <defs>
              <pattern
                id="gridPattern"
                width={`${100 / GRID_SIZE}%`}
                height={`${100 / GRID_SIZE}%`}
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 100 0 L 0 0 0 100"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#gridPattern)" />
          </svg>
          {/* 蛇身 */}
          {snake.map((segment, index) => (
            <div
              key={`snake-${index}-${segment.x}-${segment.y}`}
              className={`absolute rounded-md border border-green-400/30 transition-transform duration-100 ease-linear ${
                index === 0
                  ? "bg-linear-to-br z-10 from-green-300 to-green-500 shadow-[0_0_10px_rgba(74,222,128,0.6)]"
                  : "bg-linear-to-br z-0 from-green-500 to-green-700"
              }`}
              style={{
                ...getPosStyle(segment),
                transform: index === 0 ? "scale(1.1)" : "scale(0.95)",
                transformOrigin: "center",
              }}
            >
              {index === 0 && (
                <div className="flex h-full w-full items-center justify-center text-[0.6em] md:text-[0.8em]">
                  👀
                </div>
              )}
            </div>
          ))}
          {/* 食物 */}
          <div
            className="absolute z-20 animate-bounce rounded-full shadow-[0_0_15px_rgba(248,113,113,0.8)]"
            style={{
              ...getPosStyle(food),
              transform: "scale(0.8)",
              transformOrigin: "center",
            }}
          >
            <div className="bg-linear-to-br flex h-full w-full items-center justify-center rounded-full from-red-400 to-red-600">
              <span className="text-[0.5em] md:text-xs">🍎</span>
            </div>
          </div>
          {/* 状态遮罩 */}
          {(gameStatus === "IDLE" || gameStatus === "GAMEOVER") && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
              {gameStatus === "GAMEOVER" && (
                <h2 className="mb-2 text-4xl font-black text-red-500 drop-shadow-md">
                  游戏结束
                </h2>
              )}
              {gameStatus === "IDLE" && (
                <h2 className="mb-2 text-4xl font-black text-white drop-shadow-md">
                  贪吃蛇
                </h2>
              )}
              <p className="mb-6 text-lg text-gray-200">
                得分:{" "}
                <span className="font-mono font-bold text-yellow-400">
                  {score}
                </span>
              </p>
              <button
                onClick={resetGame}
                className="bg-linear-to-r group relative inline-flex items-center justify-center rounded-lg from-blue-500 to-purple-600 px-8 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
              >
                {gameStatus === "IDLE" ? "开始游戏" : "再来一局"}
                <span className="ml-2 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </button>
              <p className="mt-4 text-xs text-gray-400">按 WASD 或方向键开始</p>
            </div>
          )}
        </div>
      </div>
      {/* WASD 移动端控制器布局 */}
      <div className="mb-8 mt-6 sm:mb-0">
        <div className="max-w-50 mx-auto grid grid-cols-3 gap-2">
          <div />
          {/* W 键 */}
          <button
            onClick={() => handleDirectionClick("UP")}
            className="flex aspect-square items-center justify-center rounded-lg bg-gray-700 text-2xl font-bold text-white shadow-md ring-1 ring-white/10 transition-all active:scale-95 active:bg-blue-600"
          >
            W
          </button>
          <div />
          {/* A 键 */}
          <button
            onClick={() => handleDirectionClick("LEFT")}
            className="flex aspect-square items-center justify-center rounded-lg bg-gray-700 text-2xl font-bold text-white shadow-md ring-1 ring-white/10 transition-all active:scale-95 active:bg-blue-600"
          >
            A
          </button>
          {/* S 键 */}
          <button
            onClick={() => handleDirectionClick("DOWN")}
            className="flex aspect-square items-center justify-center rounded-lg bg-gray-700 text-2xl font-bold text-white shadow-md ring-1 ring-white/10 transition-all active:scale-95 active:bg-blue-600"
          >
            S
          </button>
          {/* D 键 */}
          <button
            onClick={() => handleDirectionClick("RIGHT")}
            className="flex aspect-square items-center justify-center rounded-lg bg-gray-700 text-2xl font-bold text-white shadow-md ring-1 ring-white/10 transition-all active:scale-95 active:bg-blue-600"
          >
            D
          </button>
        </div>
        <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
          支持 WASD 键盘控制
        </p>
      </div>
    </div>
  );
}
