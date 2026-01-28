import GomokuGame from '@/components/games/GomokuGame'

export const metadata = {
  title: '五子棋 - 吴元波',
  description: '经典五子棋游戏，支持双人对战和AI对战',
}

export default function GomokuPage() {
  return <GomokuGame />
}
