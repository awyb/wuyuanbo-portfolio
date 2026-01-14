import Link from "next/link";
import { tools } from "@/data/portfolio";

export const metadata = {
  title: "游戏 - 吴元波",
  description: "有趣的小游戏",
};

export default function GamesPage() {
  const games = tools.filter((tool) => tool.category === "game");

  return (
    <div className="min-h-screen bg-white py-20 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-4 text-5xl font-bold text-gray-900 dark:text-white">
          🎮 小游戏
        </h1>
        <p className="mb-12 text-xl text-gray-600 dark:text-gray-400">
          一些有趣的小游戏，来放松一下吧！
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <Link
              key={game.id}
              href={game.link}
              className="rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 p-8 text-center transition-shadow hover:shadow-xl dark:from-gray-800 dark:to-gray-900"
            >
              <div className="mb-4 text-6xl">{game.icon}</div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                {game.title}
              </h2>
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                {game.description}
              </p>
              <span className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                开始游戏 →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
