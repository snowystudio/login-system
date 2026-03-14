#!/bin/bash
# 验证 GitHub 配置
# 用法：./scripts/verify-setup.sh

set -e

REPO="snowystudio/login-system"

echo "🔍 验证 GitHub 配置..."
echo ""

# 检查仓库
echo "📦 检查仓库..."
gh repo view $REPO --json name,url,visibility --jq '"仓库：\(.name) - \(.visibility) - \(.url)"'

# 检查分支
echo ""
echo "🌿 检查分支..."
gh repo view $REPO --json defaultBranchRef --jq '"默认分支：\(.defaultBranchRef.name)"'

# 检查标签
echo ""
echo "🏷️  检查标签..."
gh label list --repo $REPO --limit 20 --json name,color,description --jq '.[] | "[\(.name)](#\(.color)) - \(.description)"' | head -10

# 检查 CI/CD
echo ""
echo "⚙️  检查 CI/CD 工作流..."
gh workflow list --repo $REPO --json name,state --jq '.[] | "\(.name) - \(.state)"'

# 检查 CODEOWNERS
echo ""
echo "👤 检查 CODEOWNERS..."
if gh api repos/$REPO/contents/.github/CODEOWNERS --jq '.download_url' > /dev/null 2>&1; then
  echo "✅ CODEOWNERS 文件存在"
else
  echo "❌ CODEOWNERS 文件不存在"
fi

# 检查 Actions 状态
echo ""
echo "🚀 检查 Actions 状态..."
if gh api repos/$REPO/actions/permissions --jq '.enabled' 2>/dev/null | grep -q "true"; then
  echo "✅ Actions 已启用"
else
  echo "⚠️  Actions 可能需要手动启用"
fi

# 检查 Secrets（只能检查是否存在，不能读取值）
echo ""
echo "🔐 检查 Secrets..."
echo "需要手动验证：https://github.com/$REPO/settings/secrets/actions"

echo ""
echo "✅ 验证完成！"
echo ""
echo "📋 待办事项："
echo "1. 配置 Secrets: https://github.com/$REPO/settings/secrets/actions"
echo "2. 配置分支保护：https://github.com/$REPO/settings/rules"
echo "3. 创建 Projects 看板：https://github.com/$REPO/projects"
