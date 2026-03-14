#!/bin/bash
# 快速配置脚本 - 自动化可以自动化的部分
# 用法：./scripts/quick-setup.sh

set -e

REPO="snowystudio/login-system"

echo "🚀 开始快速配置..."
echo ""

# 1. 启用 Actions（如果需要）
echo "📦 检查 Actions 状态..."
if ! gh api repos/$REPO/actions/permissions --jq '.enabled' 2>/dev/null | grep -q "true"; then
  echo "⚠️  Actions 未启用，需要手动启用："
  echo "   https://github.com/$REPO/actions"
else
  echo "✅ Actions 已启用"
fi

# 2. 验证标签
echo ""
echo "🏷️  验证标签..."
LABELS=("bug" "enhancement" "task" "critical" "high-priority" "documentation" "good-first-issue" "help-wanted")
for label in "${LABELS[@]}"; do
  if gh label view $label --repo $REPO > /dev/null 2>&1; then
    echo "✅ $label"
  else
    echo "❌ $label (缺失)"
  fi
done

# 3. 验证工作流
echo ""
echo "⚙️  验证工作流..."
gh workflow list --repo $REPO

# 4. 创建示例 Issue（可选）
echo ""
read -p "是否创建示例 Issue 测试配置？(y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "📝 创建示例 Issue..."
  gh issue create \
    --repo $REPO \
    --title "[Task] TASK-20260314-001 用户登录功能" \
    --body "这是从本地任务同步的示例 Issue。

## 描述
实现用户登录功能，支持邮箱密码登录和 GitHub OAuth 登录。

## 验收标准
- [ ] 注册/登录接口
- [ ] JWT 认证
- [ ] 前端登录页面
- [ ] 测试通过

---
_由 OpenClaw 多代理协作创建_" \
    --label "task,high-priority"
  echo "✅ 示例 Issue 已创建"
fi

# 5. 输出待办事项
echo ""
echo "📋 待办事项（需要网页配置）："
echo ""
echo "1️⃣  配置 Secrets："
echo "   https://github.com/$REPO/settings/secrets/actions"
echo "   - JWT_SECRET: e/t7H+GUpXu/CyAan2MZX8dMWrppR1V5RY2D6grgeHM="
echo "   - DB_PASSWORD: <你的密码>"
echo "   - GITHUB_CLIENT_ID: <可选>"
echo "   - GITHUB_CLIENT_SECRET: <可选>"
echo ""
echo "2️⃣  配置分支保护："
echo "   https://github.com/$REPO/settings/rules"
echo "   - 添加规则：main"
echo "   - 启用：Require PR, Require approvals, Require status checks"
echo ""
echo "3️⃣  创建 Projects 看板："
echo "   https://github.com/$REPO/projects"
echo "   - 新建 Board: Login System"
echo ""

echo "✅ 快速配置完成！"
