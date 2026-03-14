# GitHub 标签配置指南

## 正确位置

GitHub 改版后，标签管理不在 Settings 中了。

### 方法 1: 通过 Issues 页面（推荐）

1. 访问：https://github.com/snowystudio/login-system/issues
2. 右侧边栏找到 **Labels**
3. 点击 **Labels** 进入管理页面
4. 点击右上角 **New label** 创建标签

### 方法 2: 直接 URL

访问：https://github.com/snowystudio/login-system/labels

---

## 需要创建的标签

| 名称 | 颜色 | 描述 |
|------|------|------|
| `bug` | `#d73a4a` | Something isn't working |
| `enhancement` | `#a2eeef` | New feature or request |
| `task` | `#0075ca` | Development task |
| `critical` | `#b60205` | Critical priority |
| `high-priority` | `#d93f0b` | High priority |
| `documentation` | `#0075ca` | Improvements or additions to documentation |
| `good first issue` | `#7057ff` | Good for newcomers |
| `help wanted` | `#008672` | Extra attention is needed |

---

## 快速创建命令（使用 GitHub CLI）

如果已安装 gh CLI，可以批量创建：

```bash
cd /home/cheney/.openclaw/workspace/teams/default-team/projects/login-system

# 创建标签
gh label create bug --color d73a4a --description "Something isn't working"
gh label create enhancement --color a2eeef --description "New feature or request"
gh label create task --color 0075ca --description "Development task"
gh label create critical --color b60205 --description "Critical priority"
gh label create high-priority --color d93f0b --description "High priority"
gh label create documentation --color 0075ca --description "Improvements or additions to documentation"
gh label create good-first-issue --color 7057ff --description "Good for newcomers"
gh label create help-wanted --color 008672 --description "Extra attention is needed"
```

---

## 验证标签

创建完成后，访问 https://github.com/snowystudio/login-system/labels 确认所有标签已创建。
