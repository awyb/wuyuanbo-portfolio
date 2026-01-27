#!/bin/bash

# 数据插入测试脚本
# 用于测试数据库插入 API

BASE_URL="http://localhost:3000"

echo "🚀 开始测试数据插入..."
echo ""

# 测试 1: 插入项目数据
echo "📝 测试 1: 插入项目数据"
curl -X POST "$BASE_URL/api/insert-data" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "project",
    "data": {
      "title": "测试项目",
      "description": "这是一个测试项目描述",
      "image": "/images/test-project.jpg",
      "tags": ["React", "TypeScript", "Next.js"],
      "link": "https://example.com",
      "github": "https://github.com/example/test-project"
    }
  }'
echo -e "\n"
echo "--------------------------"
echo ""

# 测试 2: 插入技能数据
echo "📝 测试 2: 插入技能数据"
curl -X POST "$BASE_URL/api/insert-data" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "skill",
    "data": {
      "category": "测试技能分类",
      "items": ["技能1", "技能2", "技能3"]
    }
  }'
echo -e "\n"
echo "--------------------------"
echo ""

# 测试 3: 插入博客数据
echo "📝 测试 3: 插入博客数据"
curl -X POST "$BASE_URL/api/insert-data" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "blog",
    "data": {
      "title": "测试博客文章",
      "description": "这是一篇测试博客文章的描述",
      "content": "这是博客文章的完整内容...",
      "date": "2024-01-26",
      "category": "技术",
      "tags": ["测试", "博客", "数据库"],
      "slug": "test-blog-post"
    }
  }'
echo -e "\n"
echo "--------------------------"
echo ""

echo "✅ 所有测试完成！"
echo ""
echo "💡 提示: 访问 $BASE_URL/api/test-db 查看插入的数据"
