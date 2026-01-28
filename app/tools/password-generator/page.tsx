import PasswordGenerator from '@/components/tools/PasswordGenerator'

export const metadata = {
  title: '密码生成器 - 吴元波',
  description: '生成安全的随机密码，支持自定义字符类型和长度',
}

export default function PasswordGeneratorPage() {
  return <PasswordGenerator />
}
