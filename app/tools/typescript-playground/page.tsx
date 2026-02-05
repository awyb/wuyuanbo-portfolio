import TypeScriptPlayground from '@/components/tools/TypeScriptPlayground'

export const metadata = {
  title: 'TypeScript 在线运行器 - 吴元波',
  description: '编写、编译并运行 TypeScript 代码，实时查看输出结果',
}

export default function TypeScriptPlaygroundPage() {
  return (
    <div className="min-h-screen bg-white py-20 dark:bg-gray-900">
      <TypeScriptPlayground />
    </div>
  )
}
