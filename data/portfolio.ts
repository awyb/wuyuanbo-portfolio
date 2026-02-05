import { Project, Skill, BlogPost, Tool, SocialLink } from '@/types'

// 个人信息
export const personalInfo = {
  name: '吴元波',
  title: '全栈开发工程师',
  bio: '热爱编程和开源，专注于构建高质量的 Web 应用程序',
  email: 'wyuanbo0210@qq.com',
  location: '中国',
  avatar: '/images/avatar.jpg',
}

// 社交媒体链接
export const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/awyb',
    icon: 'github',
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com',
    icon: 'twitter',
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com',
    icon: 'linkedin',
  },
  {
    name: 'Email',
    url: 'mailto:wyuanbo0210@qq.com',
    icon: 'mail',
  },
]

// 项目列表
export const projects: Project[] = [
  {
    id: '1',
    title: '个人作品集网站',
    description: '使用 Next.js 和 Tailwind CSS 构建的现代化个人作品集网站',
    image: '/images/project1.jpg',
    tags: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript'],
    link: '#',
    github: 'https://github.com',
  },
  {
    id: '2',
    title: 'React 组件库',
    description: '可复用的 React 组件库，包含常用的 UI 组件',
    image: '/images/project2.jpg',
    tags: ['React', 'TypeScript', 'Storybook'],
    link: '#',
    github: 'https://github.com',
  },
  {
    id: '3',
    title: '任务管理应用',
    description: '功能完整的任务管理应用，支持实时同步',
    image: '/images/project3.jpg',
    tags: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
    link: '#',
    github: 'https://github.com',
  },
]

// 技能列表
export const skills: Skill[] = [
  {
    category: '前端技术',
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vue.js', 'HTML/CSS'],
  },
  {
    category: '后端技术',
    items: ['Node.js', 'Python', 'Express', 'FastAPI', 'MongoDB', 'PostgreSQL'],
  },
  {
    category: '工具与平台',
    items: ['Git', 'Docker', 'AWS', 'Vercel', 'GitHub', 'VS Code'],
  },
  {
    category: '其他技能',
    items: ['REST API', 'GraphQL', 'WebSocket', '性能优化', '单元测试'],
  },
]

// 博客文章列表
export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Next.js 13 App Router 完全指南',
    description: '深入了解 Next.js 13 的新特性和 App Router 的使用方法',
    date: '2024-01-10',
    category: 'Next.js',
    tags: ['Next.js', 'React', 'Web Development'],
    slug: 'nextjs-13-app-router-guide',
  },
  {
    id: '2',
    title: 'Tailwind CSS 最佳实践',
    description: '分享在项目中使用 Tailwind CSS 的最佳实践和技巧',
    date: '2024-01-05',
    category: 'CSS',
    tags: ['Tailwind CSS', 'CSS', 'Web Design'],
    slug: 'tailwind-css-best-practices',
  },
  {
    id: '3',
    title: 'TypeScript 类型系统深度解析',
    description: '详细讲解 TypeScript 的类型系统和高级用法',
    date: '2024-01-01',
    category: 'TypeScript',
    tags: ['TypeScript', 'JavaScript', 'Programming'],
    slug: 'typescript-type-system-deep-dive',
  },
]

// 工具和游戏列表
export const tools: Tool[] = [
  {
    id: '1',
    title: 'JSON 格式化工具',
    description: '快速格式化和验证 JSON 数据',
    icon: '📋',
    link: '/tools/json-formatter',
    category: 'tool',
  },
  {
    id: '2',
    title: '颜色选择器',
    description: '方便的颜色选择和转换工具',
    icon: '🎨',
    link: '/tools/color-picker',
    category: 'tool',
  },
  {
    id: '3',
    title: '贪吃蛇游戏',
    description: '经典的贪吃蛇游戏',
    icon: '🐍',
    link: '/games/snake',
    category: 'game',
  },
  {
    id: '5',
    title: '井字棋游戏',
    description: '与 AI 对战的井字棋游戏',
    icon: '⭕',
    link: '/games/tic-tac-toe',
    category: 'game',
  },
  {
    id: '6',
    title: '俄罗斯方块',
    description: '经典的俄罗斯方块游戏',
    icon: '🧩',
    link: '/games/tetris',
    category: 'game',
  },
  {
    id: '7',
    title: '双色球',
    description: '双色球模拟器，支持随机选号和多次开奖模拟',
    icon: '🎱',
    link: '/games/lottery',
    category: 'game',
  },
  {
    id: '8',
    title: '五子棋',
    description: '经典五子棋游戏，支持双人对战和AI对战',
    icon: '⚫',
    link: '/games/gomoku',
    category: 'game',
  },
  {
    id: '9',
    title: '求签占卜',
    description: '传统求签占卜游戏，探寻命运指引，解读人生运势',
    icon: '🎋',
    link: '/games/fortune',
    category: 'game',
  },
  {
    id: '10',
    title: '数独游戏',
    description: '经典数独游戏，锻炼逻辑思维能力',
    icon: '🔢',
    link: '/games/sudoku',
    category: 'game',
  },
  {
    id: '11',
    title: '跑酷游戏',
    description: '刺激的跑酷游戏，躲避障碍物，挑战最高分',
    icon: '🏃',
    link: '/games/parkour',
    category: 'game',
  },
  {
    id: '12',
    title: '密码生成器',
    description: '生成安全的随机密码，支持自定义字符类型',
    icon: '🔐',
    link: '/tools/password-generator',
    category: 'tool',
  },
  {
    id: '13',
    title: '二维码生成器',
    description: '快速生成二维码，支持文本、网址等多种内容',
    icon: '📱',
    link: '/tools/qr-code-generator',
    category: 'tool',
  },
  {
    id: '14',
    title: '正则表达式测试器',
    description: '实时测试正则表达式，查看匹配结果和捕获组',
    icon: '🔍',
    link: '/tools/regex-tester',
    category: 'tool',
  },
  {
    id: '15',
    title: 'Base64 编码解码',
    description: '快速进行 Base64 编码和解码，支持中文',
    icon: '🔢',
    link: '/tools/base64-converter',
    category: 'tool',
  },
  {
    id: '16',
    title: 'TypeScript 在线运行器',
    description: '编写、编译并运行 TypeScript 代码，实时查看输出结果',
    icon: '💻',
    link: '/tools/typescript-playground',
    category: 'tool',
  },
]
