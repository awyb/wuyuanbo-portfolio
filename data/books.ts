export interface Book {
  id: string
  title: string
  author: string
  description: string
  category: string
  tags: string[]
  cover: string
  pdfUrl: string
  fileSize: string
  pages: number
  publishYear: number
  language: string
}

export const books: Book[] = [
  {
    id: 'programmer-algorithm-puzzles',
    title: '程序员的算法趣题',
    author: '增井敏克',
    description:
      '本书通过有趣的谜题和游戏形式，帮助程序员轻松掌握算法知识。包含大量实战练习，适合想要提升算法能力的开发者。',
    category: '工具',
    tags: ['算法', '编程基础', '面试'],
    cover: '/images/books/programmer-algorithm-puzzles.svg',
    pdfUrl: '/books/程序员的算法趣题-2017-中文版.pdf',
    fileSize: '7.7 MB',
    pages: 318,
    publishYear: 2017,
    language: '中文',
  },
  {
    id: 'frontend-architecture-design',
    title: '前端架构设计',
    author: 'Micah Godbolt',
    description:
      '深入探讨前端架构设计的原则和最佳实践，涵盖模块化设计、代码组织、性能优化等关键主题。',
    category: '前端开发',
    tags: ['前端架构', '设计模式', '性能优化'],
    cover: '/images/books/frontend-architecture-design.svg',
    pdfUrl: '/books/前端架构设计-2017-中文版.pdf',
    fileSize: '11.2 MB',
    pages: 170,
    publishYear: 2017,
    language: '中文',
  },
  {
    id: 'ai-modern-approach-4th',
    title: '人工智能现代方法（第4版）',
    author: 'Stuart Russell, Peter Norvig',
    description:
      '人工智能领域的经典教材，全面介绍AI的理论基础和现代技术。第4版涵盖了深度学习、强化学习等最新进展。',
    category: '工具',
    tags: ['人工智能', '机器学习', '深度学习'],
    cover: '/images/books/ai-modern-approach-4th.svg',
    pdfUrl: '/books/人工智能现代方法（第4版）-2022-中文版.pdf',
    fileSize: '53.3 MB',
    pages: 1995,
    publishYear: 2022,
    language: '中文',
  },
  {
    id: 'deep-learning-nlp',
    title: '深度学习进阶：自然语言处理',
    author: '斋藤康毅',
    description:
      '深入讲解自然语言处理领域的深度学习技术，涵盖Word2Vec、Seq2Seq、Attention、Transformer等核心模型。',
    category: '工具',
    tags: ['深度学习', 'NLP', '自然语言处理', '神经网络'],
    cover: '/images/books/deep-learning-nlp.svg',
    pdfUrl: '/books/深度学习进阶：自然语言处理-2020-中文版.pdf',
    fileSize: '8.3 MB',
    pages: 427,
    publishYear: 2020,
    language: '中文',
  },
  {
    id: 'rust-in-depth',
    title: '深入浅出Rust',
    author: '张建飞',
    description:
      '全面介绍Rust编程语言的核心概念和高级特性，帮助开发者掌握内存安全、并发编程等关键技术。',
    category: '后端开发',
    tags: ['Rust', '系统编程', '内存安全'],
    cover: '/images/books/rust-in-depth.svg',
    pdfUrl: '/books/深入浅出Rust-2018-中文版.pdf',
    fileSize: '3.3 MB',
    pages: 578,
    publishYear: 2018,
    language: '中文',
  },
  {
    id: 'react-tech-stack',
    title: '深入React技术栈',
    author: '陈屹',
    description:
      '系统讲解React生态系统，包括React核心、Redux、React Router等，帮助开发者构建复杂的前端应用。',
    category: '前端开发',
    tags: ['React', 'JavaScript', '前端框架', 'Redux'],
    cover: '/images/books/react-tech-stack.svg',
    pdfUrl: '/books/深入React技术栈-2016-中文版.pdf',
    fileSize: '9.6 MB',
    pages: 366,
    publishYear: 2016,
    language: '中文',
  },
  {
    id: 'responsive-web-design',
    title: '响应式Web设计 HTML5和CSS3实战(第2版)',
    author: 'Ben Frain',
    description:
      '全面介绍响应式Web设计的理论与实践，涵盖HTML5和CSS3的最新特性，帮助开发者构建跨设备的现代网站。',
    category: '前端开发',
    tags: ['HTML5', 'CSS3', '响应式设计', 'Web设计'],
    cover: '/images/books/responsive-web-design.svg',
    pdfUrl: '/books/响应式Web设计 HTML5和CSS3实战(第2版)-2017-中文版.pdf',
    fileSize: '11.6 MB',
    pages: 231,
    publishYear: 2017,
    language: '中文',
  },
  {
    id: 'css-refactoring',
    title: 'CSS重构：样式表性能调优',
    author: "O'Reilly",
    description:
      '专注于CSS代码质量和性能优化，提供实用的重构技巧和最佳实践，帮助开发者编写高效的CSS代码。',
    category: '前端开发',
    tags: ['CSS', '性能优化', '代码重构', 'Web开发'],
    cover: '/images/books/css-refactoring.svg',
    pdfUrl: '/books/CSS重构：样式表性能调优-2017-中文版.pdf',
    fileSize: '11.1 MB',
    pages: 146,
    publishYear: 2017,
    language: '中文',
  },
  {
    id: 'deepseek-mastery',
    title: 'DeepSeek 从入门到精通',
    author: 'DeepSeek团队',
    description:
      '全面介绍DeepSeek AI模型的使用方法和最佳实践，涵盖API调用、Prompt工程、应用开发等内容。',
    category: '工具',
    tags: ['DeepSeek', 'AI', '大语言模型', 'Prompt工程'],
    cover: '/images/books/deepseek-mastery.svg',
    pdfUrl: '/books/DeepSeek 从入门到精通-2025-中文版.pdf',
    fileSize: '5.5 MB',
    pages: 104,
    publishYear: 2025,
    language: '中文',
  },
  {
    id: 'javascript-design-patterns',
    title: 'JavaScript设计模式与开发实践',
    author: '曾探',
    description:
      '系统讲解JavaScript中的设计模式，结合实际案例展示如何在前端开发中应用设计模式提升代码质量。',
    category: '前端开发',
    tags: ['JavaScript', '设计模式', '前端开发', '编程'],
    cover: '/images/books/javascript-design-patterns.svg',
    pdfUrl: '/books/JavaScript设计模式与开发实践-2015-中文版.pdf',
    fileSize: '8.1 MB',
    pages: 317,
    publishYear: 2015,
    language: '中文',
  },
  {
    id: 'python-web-scraping',
    title: 'Python网络数据采集',
    author: 'Ryan Mitchell',
    description:
      '介绍使用Python进行网络数据采集的技术，涵盖爬虫基础、数据解析、异步采集等实用技能。',
    category: '后端开发',
    tags: ['Python', '爬虫', '数据采集', 'Web开发'],
    cover: '/images/books/python-web-scraping.svg',
    pdfUrl: '/books/Python网络数据采集-2016-中文版.pdf',
    fileSize: '16.7 MB',
    pages: 222,
    publishYear: 2016,
    language: '中文',
  },
  {
    id: 'react-quick-start',
    title: 'React快速上手开发',
    author: 'Azat Mardan',
    description:
      '本书适合有一定JavaScript基础的开发者，通过实际项目案例快速掌握React开发技能。涵盖React核心概念、组件化开发、状态管理等重要内容。',
    category: '前端开发',
    tags: ['React', 'JavaScript', '前端框架'],
    cover: '/images/books/react-quick-start.svg',
    pdfUrl: '/books/React快速上手开发-2017-中文版.pdf',
    fileSize: '9.2 MB',
    pages: 206,
    publishYear: 2017,
    language: '中文',
  },
  {
    id: 'web-security-guide',
    title: 'Web 安全开发指南',
    author: '各种安全专家',
    description:
      '全面介绍Web应用安全开发的最佳实践，涵盖XSS、CSRF、SQL注入等常见安全漏洞的防护方法。',
    category: '工具',
    tags: ['Web安全', '网络安全', '安全开发', 'Web开发'],
    cover: '/images/books/web-security-guide.svg',
    pdfUrl: '/books/Web 安全开发指南-2017-中文版.pdf',
    fileSize: '10.6 MB',
    pages: 278,
    publishYear: 2017,
    language: '中文',
  },
  {
    id: 'web-dev-guide',
    title: 'Web开发权威指南',
    author: 'Mozilla',
    description:
      'Mozilla官方出品，全面介绍Web开发的核心技术，包括HTML、CSS、JavaScript等基础知识。',
    category: '前端开发',
    tags: ['Web开发', 'HTML', 'CSS', 'JavaScript', '前端基础'],
    cover: '/images/books/web-dev-guide.svg',
    pdfUrl: '/books/Web开发权威指南-2017-中文版.pdf',
    fileSize: '30.1 MB',
    pages: 431,
    publishYear: 2017,
    language: '中文',
  },
  {
    id: 'web-performance-guide',
    title: 'Web性能权威指南',
    author: 'Ilya Grigorik',
    description:
      '深入探讨Web性能优化的各个方面，涵盖网络协议、资源加载、渲染优化等关键技术，帮助开发者构建高性能的Web应用。',
    category: '前端开发',
    tags: ['性能优化', 'Web性能', 'HTTP', '浏览器'],
    cover: '/images/books/web-performance-guide.svg',
    pdfUrl: '/books/Web性能权威指南-2014-中文版.pdf',
    fileSize: '18.9 MB',
    pages: 331,
    publishYear: 2014,
    language: '中文',
  },
]

export const bookCategories = ['全部', '前端开发', '后端开发', '数据库', '工具']
