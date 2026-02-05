# TypeScript 类型系统深度解析

TypeScript 的类型系统是其最强大的特性之一。深入理解类型系统可以帮助你写出更安全、更易维护的代码。

## 基础类型

TypeScript 提供了丰富的基础类型：

```typescript
// 原始类型
let name: string = '张三'
let age: number = 25
let isStudent: boolean = true

// 数组类型
let numbers: number[] = [1, 2, 3]
let strings: Array<string> = ['a', 'b', 'c']

// 元组类型
let person: [string, number] = ['张三', 25]
```

## 类型推断

TypeScript 能够根据上下文自动推断类型：

```typescript
let x = 3 // 推断为 number
let y = [0, 1, null] // 推断为 (number | null)[]
```

## 联合类型和交叉类型

### 联合类型

```typescript
type Status = 'success' | 'error' | 'pending'

function handleStatus(status: Status) {
  switch (status) {
    case 'success':
      console.log('操作成功')
      break
    case 'error':
      console.log('操作失败')
      break
    case 'pending':
      console.log('处理中')
      break
  }
}
```

### 交叉类型

```typescript
type Person = {
  name: string
}

type Employee = {
  id: number
}

type PersonEmployee = Person & Employee

const employee: PersonEmployee = {
  name: '张三',
  id: 123,
}
```

## 类型守卫

类型守卫可以在运行时检查类型：

```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function process(value: unknown) {
  if (isString(value)) {
    console.log(value.toUpperCase()) // TypeScript 知道这里是 string
  }
}
```

## 泛型

泛型允许你创建可重用的组件：

```typescript
function identity<T>(arg: T): T {
  return arg
}

const result = identity<string>('hello')

// 泛型约束
interface Lengthwise {
  length: number
}

function logLength<T extends Lengthwise>(arg: T): void {
  console.log(arg.length)
}
```

## 条件类型

条件类型基于条件关系选择类型：

```typescript
type NonNullable<T> = T extends null | undefined ? never : T

type Result = NonNullable<string | null> // Result 是 string
```

## 映射类型

映射类型基于旧类型创建新类型：

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}

type Partial<T> = {
  [P in keyof T]?: T[P]
}

interface User {
  id: number
  name: string
  email: string
}

type ReadonlyUser = Readonly<User>
type PartialUser = Partial<User>
```

## 实用类型

TypeScript 提供了许多内置的实用类型：

```typescript
// Pick - 选择特定属性
type UserPreview = Pick<User, 'name' | 'email'>

// Omit - 排除特定属性
type CreateUser = Omit<User, 'id'>

// Record - 创建对象类型
type UserMap = Record<string, User>

// Exclude - 从联合类型中排除
type StatusWithoutPending = Exclude<Status, 'pending'>
```

## 类型断言

类型断言告诉编译器你知道自己在做什么：

```typescript
const value: unknown = 'hello'

// 方式 1
const str1 = value as string

// 方式 2
const str2 = <string>value
```

## 类型体操

高级类型操作：

```typescript
// 提取函数返回类型
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never

// 提取函数参数类型
type Parameters<T> = T extends (...args: infer P) => any ? P : never

// 深度只读
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}
```

## 最佳实践

1. **避免使用 any** - 尽量使用 unknown 或具体类型
2. **使用类型别名** - 对于复杂类型使用 type 关键字
3. **合理使用泛型** - 不要过度使用
4. **优先使用接口** - 对于对象类型
5. **使用类型守卫** - 提高类型安全性

## 总结

TypeScript 的类型系统非常强大，掌握它可以帮助你：

- 在编译时发现错误
- 提高代码可读性
- 改善开发体验
- 构建更可靠的应用

通过持续学习和实践，你将能够充分利用 TypeScript 的类型系统来构建高质量的代码。
