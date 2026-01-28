import QRCodeGenerator from '@/components/tools/QRCodeGenerator'

export const metadata = {
  title: '二维码生成器 - 吴元波',
  description: '快速生成二维码，支持文本、网址等多种内容',
}

export default function QRCodeGeneratorPage() {
  return <QRCodeGenerator />
}
