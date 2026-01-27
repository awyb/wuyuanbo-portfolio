import JsonFormatter from '@/components/tools/JsonFormatter'

export const metadata = {
  title: 'JSON 格式化工具 | 数据处理',
  description: '快速格式化、压缩和验证 JSON 数据',
}

export default function JsonFormatterPage() {
  return (
    <div className="bg-linear-to-br min-h-screen from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <JsonFormatter />
      </div>
    </div>
  )
}
