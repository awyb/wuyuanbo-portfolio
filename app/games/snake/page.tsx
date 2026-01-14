import SnakeGame from "@/components/games/SnakeGame";

export const metadata = {
  title: "贪吃蛇游戏 - 吴元波",
  description: "一个有趣的贪吃蛇游戏，支持键盘和触摸控制",
};

export default function SnakePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        {/* 标题 */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold text-white">🐍 贪吃蛇游戏</h1>
          <p className="text-xl text-gray-400">
            一个经典的贪吃蛇游戏，考验你的反应速度和策略能力
          </p>
        </div>

        {/* 游戏组件 */}
        <div className="rounded-xl bg-gray-800 p-8 shadow-2xl">
          <SnakeGame />
        </div>

        {/* 底部提示 */}
        <div className="mt-12 text-center text-gray-400">
          <p>💡 提示：在电脑上使用方向键获得最佳游戏体验</p>
        </div>
      </div>
    </div>
  );
}
