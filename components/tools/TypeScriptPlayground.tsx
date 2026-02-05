'use client'
import React, { useState, useRef } from 'react'
import Editor from '@monaco-editor/react'
import * as ts from 'typescript'

export default function TypeScriptPlayground() {
  const [code, setCode] = useState(`// 在这里输入 TypeScript 代码
interface User {
  name: string;
  age: number;
  greet(): string;
}

class Person implements User {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  greet(): string {
    return \`Hello, I'm \${this.name}, \${this.age} years old.\`;
  }
}

const user = new Person("张三", 25);
console.log(user.greet());

// 计算数组示例
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Original:", numbers);
console.log("Doubled:", doubled);

// 泛型函数示例
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

console.log("First element:", first(numbers));`)
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const outputRef = useRef<HTMLDivElement>(null)

  // 编译并执行 TypeScript 代码
  const runCode = () => {
    setIsLoading(true)
    setError('')
    setOutput('')

    try {
      // 编译 TypeScript 为 JavaScript
      const jsCode = ts.transpileModule(code, {
        compilerOptions: {
          target: ts.ScriptTarget.ES2020,
          module: ts.ModuleKind.CommonJS,
          strict: true,
        },
      }).outputText

      // 捕获 console.log 输出
      const logs: string[] = []
      const originalConsoleLog = console.log
      console.log = (...args: unknown[]) => {
        logs.push(
          args
            .map(arg => {
              if (typeof arg === 'object') {
                try {
                  return JSON.stringify(arg, null, 2)
                } catch {
                  return String(arg)
                }
              }
              return String(arg)
            })
            .join(' '),
        )
        originalConsoleLog(...args)
      }

      try {
        // 执行编译后的 JavaScript 代码
        // 使用 Function 构造器而不是 eval，更安全
        const execute = new Function(jsCode)
        execute()

        // 显示输出
        if (logs.length > 0) {
          setOutput(logs.join('\n'))
        } else {
          setOutput('代码执行成功，但没有输出。请使用 console.log() 来显示结果。')
        }
      } catch (err: unknown) {
        setError(`执行错误: ${err instanceof Error ? err.message : String(err)}`)
      } finally {
        // 恢复 console.log
        console.log = originalConsoleLog
      }
    } catch (err: unknown) {
      setError(`编译错误: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsLoading(false)
    }
  }

  // 清空代码和输出
  const clearAll = () => {
    setCode('')
    setOutput('')
    setError('')
  }

  // 加载示例代码
  const loadExample = (exampleType: string) => {
    const examples: Record<string, string> = {
      basic: `// 基础类型示例
const message: string = "Hello, TypeScript!";
const count: number = 42;
const isActive: boolean = true;
const nothing: null = null;

console.log("Message:", message);
console.log("Count:", count);
console.log("Active:", isActive);`,

      interface: `// 接口示例
interface Product {
  id: number;
  name: string;
  price: number;
  category?: string;
}

const product: Product = {
  id: 1,
  name: "笔记本电脑",
  price: 5999,
  category: "电子产品"
};

console.log("Product:", product);
console.log("Product Name:", product.name);`,

      class: `// 类和继承示例
class Animal {
  protected name: string;
  
  constructor(name: string) {
    this.name = name;
  }
  
  move(distance: number = 0): void {
    console.log(\`\${this.name} moved \${distance}m.\`);
  }
}

class Dog extends Animal {
  constructor(name: string) {
    super(name);
  }
  
  bark(): void {
    console.log(\`\${this.name} barks!\`);
  }
}

const dog = new Dog("旺财");
dog.bark();
dog.move(10);`,

      generic: `// 泛型示例
function identity<T>(arg: T): T {
  return arg;
}

console.log(identity<string>("Hello"));
console.log(identity<number>(123));

interface Box<T> {
  contents: T;
}

const stringBox: Box<string> = { contents: "TypeScript" };
const numberBox: Box<number> = { contents: 2024 };

console.log(stringBox.contents);
console.log(numberBox.contents);`,

      advanced: `// 高级类型示例
type Status = 'pending' | 'success' | 'error';

interface ApiResponse<T> {
  status: Status;
  data?: T;
  error?: string;
}

function handleResponse<T>(response: ApiResponse<T>): void {
  switch (response.status) {
    case 'success':
      console.log("Success:", response.data);
      break;
    case 'error':
      console.log("Error:", response.error);
      break;
    default:
      console.log("Status:", response.status);
  }
}

const successResponse: ApiResponse<string[]> = {
  status: 'success',
  data: ['item1', 'item2']
};

handleResponse(successResponse);`,
    }

    setCode(examples[exampleType] || examples.basic)
    setOutput('')
    setError('')
  }

  // 复制代码
  const copyCode = () => {
    navigator.clipboard.writeText(code)
  }

  // 复制输出
  const copyOutput = () => {
    navigator.clipboard.writeText(output)
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4">
      {/* 标题 */}
      <div className="text-center">
        <h1 className="bg-linear-to-r mb-3 from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-5xl font-black text-transparent drop-shadow-lg">
          💻 TypeScript 在线运行器
        </h1>
        <p className="text-xl font-medium text-gray-700 dark:text-gray-300">
          编写、编译并运行 TypeScript 代码，实时查看输出结果
        </p>
        <p className="mt-2 text-sm font-normal text-gray-500 dark:text-gray-400">
          支持完整的 TypeScript 语法，包含多种示例代码快速上手
        </p>
      </div>

      {/* 工具栏 */}
      <div className="bg-linear-to-br rounded-xl from-blue-50 to-cyan-50 p-6 shadow-lg dark:from-blue-900/20 dark:to-cyan-900/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* 示例代码 */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">📚 加载示例:</span>
            <button
              onClick={() => loadExample('basic')}
              className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-gray-700 shadow-sm transition-all hover:scale-105 hover:bg-blue-50 hover:shadow-md dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              🎯 基础类型
            </button>
            <button
              onClick={() => loadExample('interface')}
              className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-gray-700 shadow-sm transition-all hover:scale-105 hover:bg-purple-50 hover:shadow-md dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              📦 接口
            </button>
            <button
              onClick={() => loadExample('class')}
              className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-gray-700 shadow-sm transition-all hover:scale-105 hover:bg-green-50 hover:shadow-md dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              🏗️ 类
            </button>
            <button
              onClick={() => loadExample('generic')}
              className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-gray-700 shadow-sm transition-all hover:scale-105 hover:bg-orange-50 hover:shadow-md dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              🔧 泛型
            </button>
            <button
              onClick={() => loadExample('advanced')}
              className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-gray-700 shadow-sm transition-all hover:scale-105 hover:bg-pink-50 hover:shadow-md dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              🚀 高级类型
            </button>
          </div>

          {/* 操作按钮 */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={runCode}
              disabled={isLoading}
              className="bg-linear-to-r rounded-lg from-green-500 to-emerald-500 px-8 py-3 text-base font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoading ? '⏳ 运行中...' : '▶️ 运行代码'}
            </button>
            <button
              onClick={clearAll}
              className="rounded-lg bg-red-500 px-5 py-3 text-base font-bold text-white shadow-md transition-all hover:bg-red-600 hover:shadow-lg"
            >
              🗑️ 清空
            </button>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 代码编辑器 */}
        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-2xl font-bold text-transparent">
              📝 TypeScript 代码
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {code.split('\n').length} 行
              </span>
              <button
                onClick={copyCode}
                className="rounded-lg bg-gray-500 px-3 py-1 text-sm font-semibold text-white transition-all hover:bg-gray-600"
              >
                📋 复制代码
              </button>
            </div>
          </div>
          <div className="rounded-lg border-2 border-gray-300 dark:border-gray-600">
            <Editor
              height="500px"
              defaultLanguage="typescript"
              value={code}
              onChange={(value: string | undefined) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 16,
                lineHeight: 1.8,
                fontFamily: "'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace",
                fontLigatures: true,
                tabSize: 2,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 16, bottom: 16 },
              }}
            />
          </div>
        </div>

        {/* 输出区域 */}
        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-2xl font-bold text-transparent">
              📤 输出结果
            </h3>
            {output && (
              <button
                onClick={copyOutput}
                className="bg-linear-to-r rounded-lg from-green-500 to-emerald-500 px-4 py-2 text-sm font-bold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
              >
                📋 复制输出
              </button>
            )}
          </div>
          <div
            ref={outputRef}
            className="h-125 bg-linear-to-br relative overflow-auto rounded-xl border-2 border-gray-300 from-gray-900 to-gray-800 p-6 shadow-inner dark:border-gray-600"
            style={{
              fontFamily: '"Fira Code", "Consolas", "Monaco", "Courier New", monospace',
              lineHeight: '1.8',
              letterSpacing: '0.02em',
            }}
          >
            {error ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-red-400">
                  <span className="text-2xl">❌</span>
                  <span className="text-lg font-bold">错误</span>
                </div>
                <pre className="whitespace-pre-wrap rounded-lg bg-red-950/30 p-4 text-base font-medium text-red-300 backdrop-blur-sm">
                  {error}
                </pre>
              </div>
            ) : output ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-green-400">
                  <span className="text-2xl">✅</span>
                  <span className="text-lg font-bold">执行成功</span>
                </div>
                <pre className="whitespace-pre-wrap rounded-lg bg-green-950/30 p-4 text-base font-medium text-green-300 backdrop-blur-sm">
                  {output}
                </pre>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-4">
                <div className="text-6xl">🎯</div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-400">准备就绪</p>
                  <p className="text-sm text-gray-500">点击"运行代码"按钮查看输出结果</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 功能说明 */}
      <div className="rounded-xl bg-gray-50 p-6 shadow-md dark:bg-gray-800">
        <h3 className="bg-linear-to-r mb-4 from-purple-600 to-pink-600 bg-clip-text text-2xl font-bold text-transparent">
          📖 功能说明
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <h4 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">✨ 主要功能</h4>
            <ul className="space-y-2 text-base text-gray-700 dark:text-gray-300">
              <li>• 实时编译 TypeScript 为 JavaScript</li>
              <li>• 安全执行代码并捕获输出</li>
              <li>• 支持完整的 TypeScript 语法</li>
              <li>• 显示详细的错误信息</li>
              <li>• 多个示例代码快速入门</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">💡 使用提示</h4>
            <ul className="space-y-2 text-base text-gray-700 dark:text-gray-300">
              <li>• 使用 console.log() 输出结果</li>
              <li>• 支持所有 ES2020+ 特性</li>
              <li>• 代码在浏览器沙箱中执行</li>
              <li>• 推荐使用示例代码开始学习</li>
              <li>• 可以复制结果到剪贴板</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 支持的特性 */}
      <div className="rounded-xl bg-blue-50 p-6 shadow-md dark:bg-blue-900/20">
        <h3 className="bg-linear-to-r mb-4 from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-2xl font-bold text-transparent">
          🎯 支持的 TypeScript 特性
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
          {[
            '基础类型',
            '接口',
            '类和继承',
            '泛型',
            '枚举',
            '类型别名',
            '联合类型',
            '交叉类型',
            '字面量类型',
            '可选链',
            '空值合并',
            '装饰器',
          ].map(feature => (
            <div
              key={feature}
              className="rounded-lg bg-white px-4 py-3 text-center text-base font-semibold text-gray-700 shadow-md transition-all hover:scale-105 hover:shadow-lg dark:bg-gray-800 dark:text-gray-300"
            >
              {feature}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
