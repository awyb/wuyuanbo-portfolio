import ColorPicker from '@/components/tools/ColorPicker'

export const metadata = {
  title: '颜色选择器工具 | 颜色转换',
  description: '专业的颜色选择和转换工具，支持 HEX、RGB、HSL 格式互转',
}

export default function ColorPickerPage() {
  return (
    <div className="bg-linear-to-br min-h-screen from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <ColorPicker />
      </div>
    </div>
  )
}
