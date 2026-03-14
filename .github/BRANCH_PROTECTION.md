# 分支保护配置指南

## 需要手动配置的 GitHub 设置

以下设置需要在 GitHub 网页界面手动配置：

### 1. 分支保护规则

访问：`Settings → Branches → Add branch protection rule`

**规则名称：** `main`

**配置项：**
- [x] Require a pull request before merging
  - [x] Require approvals (1)
  - [x] Dismiss stale pull request approvals when new commits are pushed
- [x] Require status checks to pass before merging
  - [x] Require branches to be up to date before merging
  - 选择状态检查：
    - [x] Backend CI / test (ubuntu-latest)
    - [x] Backend CI / lint (ubuntu-latest)
    - [x] Frontend CI / test (ubuntu-latest)
    - [x] Frontend CI / lint (ubuntu-latest)
- [x] Require conversation resolution before merging
- [x] Include administrators (推荐启用，即使是管理员也需要 PR)

### 2. 标签管理

访问：`Settings → Labels → New label`

创建以下标签：

| 名称 | 颜色 | 描述 |
|------|------|------|
| `bug` | #d73a4a | 问题或错误 |
| `enhancement` | #a2eeef | 新功能请求 |
| `task` | #0075ca | 开发任务 |
| `critical` | #b60205 | 紧急问题 |
| `high-priority` | #d93f0b | 高优先级 |
| `documentation` | #0075ca | 文档改进 |
| `good first issue` | #7057ff | 适合新手 |
| `help wanted` | #008672 | 需要帮助 |

### 3. GitHub Projects 看板

访问：`Projects → New project → Board`

**列配置：**
```
Backlog → Todo → In Progress → Review → Done
```

**自动化规则：**
- 当 issue 被分配时 → 移动到 In Progress
- 当 PR 创建时 → 移动到 Review
- 当 PR 合并时 → 移动到 Done

### 4. GitHub Secrets

访问：`Settings → Secrets and variables → Actions`

**仓库 Secrets：**
```
JWT_SECRET=<随机生成的 32 字符以上字符串>
DB_PASSWORD=<数据库密码>
GITHUB_CLIENT_ID=<OAuth App Client ID>
GITHUB_CLIENT_SECRET=<OAuth App Client Secret>
```

**生成 JWT Secret:**
```bash
openssl rand -base64 32
```

### 5. 部署配置（可选）

如果使用 Vercel/Railway 等平台：

1. 连接 GitHub 仓库
2. 配置构建命令：
   - Backend: `cd backend && npm install && npm run build`
   - Frontend: `cd frontend && npm install && npm run build`
3. 配置环境变量（同上）

---

## 配置完成检查清单

- [ ] 分支保护规则已启用
- [ ] 标签已创建
- [ ] Projects 看板已创建
- [ ] Secrets 已配置
- [ ] CODEOWNERS 已生效（提交后检查）
