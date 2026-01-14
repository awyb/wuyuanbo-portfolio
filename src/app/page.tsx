// src/app/page.tsx
export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center max-w-2xl mx-auto px-6">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          你好，我是
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mt-2">
            吴元波
          </span>
        </h1>

        <p className="text-xl text-gray-600 mb-10">
          前端开发专家，专注于构建现代、高性能的Web应用。
          热爱创造优秀的用户体验。
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/projects"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            查看我的项目
          </a>
          <a
            href="/contact"
            className="px-8 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg font-semibold hover:border-blue-500 transition-colors"
          >
            联系我
          </a>
        </div>

        <div className="mt-16">
          <p className="text-gray-500">网站正在建设中...</p>
          <p className="text-sm text-gray-400 mt-2">更多内容即将上线</p>
        </div>
      </div>
    </div>
  )
}