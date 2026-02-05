import Sudoku from '@/components/games/Sudoku'

export const metadata = {
  title: '数独游戏 | 经典益智游戏',
  description: '经典的数独游戏，锻炼逻辑思维能力',
}

export default function SudokuPage() {
  return (
    <div className="bg-linear-to-br min-h-screen from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <Sudoku />
      </div>
    </div>
  )
}
