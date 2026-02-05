import Parkour from '@/components/games/Parkour'

export const metadata = {
  title: '跑酷游戏 | 趣味跳跃游戏',
  description: '刺激的跑酷游戏，躲避障碍物，挑战最高分',
}

export default function ParkourPage() {
  return (
    <div className="bg-linear-to-br min-h-screen from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <Parkour />
      </div>
    </div>
  )
}
