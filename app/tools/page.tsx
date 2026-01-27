import Link from 'next/link'
import { tools } from '@/data/portfolio'

export const metadata = {
  title: '工具 - 吴元波',
  description: '我开发的实用工具',
}

export default function ToolsPage() {
  const toolsList = tools.filter(tool => tool.category === 'tool')

  return (
    <div className="min-h-screen bg-white py-20 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-4 text-5xl font-bold text-gray-900 dark:text-white">🛠️ 实用工具</h1>
        <p className="mb-12 text-xl text-gray-600 dark:text-gray-400">
          一些实用的工具，提高工作效率。
        </p>

        {/* Tools Section */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {toolsList.map(tool => (
            <Link
              key={tool.id}
              href={tool.link}
              className="bg-linear-to-br flex flex-col items-center rounded-lg from-gray-50 to-gray-100 p-8 text-center transition-shadow hover:shadow-xl dark:from-gray-800 dark:to-gray-900"
            >
              <div className="mb-4 text-6xl">{tool.icon}</div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                {tool.title}
              </h2>
              <p className="mb-4 grow text-gray-600 dark:text-gray-400">{tool.description}</p>
              <span className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                使用工具 →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
