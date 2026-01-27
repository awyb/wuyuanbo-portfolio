import FortuneTelling from '@/components/tools/FortuneTelling'

export const metadata = {
  title: '求签占卜 | 命运指引',
  description: '传统求签占卜，探寻命运指引，解读人生运势',
}

export default function FortunePage() {
  return (
    <div className="bg-linear-to-br min-h-screen from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <FortuneTelling />
      </div>
    </div>
  )
}
