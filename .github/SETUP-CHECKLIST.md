# GitHub 配置检查清单

## ✅ 已自动完成

- [x] 仓库创建（Public）
- [x] 初始代码推送
- [x] CI/CD 工作流配置
- [x] Docker 配置
- [x] Issue 模板（3 个）
- [x] PR 模板
- [x] CODEOWNERS
- [x] 标签（8 个）
- [x] 贡献指南
- [x] 部署指南

---

## ⚠️ 需要手动配置（网页界面）

### 1. GitHub Secrets（必需）

**访问：** https://github.com/snowystudio/login-system/settings/secrets/actions

**添加以下 Secrets：**

| 名称 | 值 | 说明 |
|------|-----|------|
| `JWT_SECRET` | `e/t7H+GUpXu/CyAan2MZX8dMWrppR1V5RY2D6grgeHM=` | 已生成，直接复制 |
| `DB_PASSWORD` | `<你的强密码>` | 数据库密码 |
| `GITHUB_CLIENT_ID` | `<你的 Client ID>` | OAuth App（可选） |
| `GITHUB_CLIENT_SECRET` | `<你的 Client Secret>` | OAuth App（可选） |

**步骤：**
1. 点击 **New repository secret**
2. 输入 Name 和 Value
3. 点击 **Add secret**
4. 重复直到全部添加完成

---

### 2. 分支保护规则（必需）

**访问：** https://github.com/snowystudio/login-system/settings/rules

**步骤：**
1. 点击 **Add branch protection rule** 或 **Add rule**
2. Branch name pattern: `main`
3. 启用以下选项：

**Require a pull request before merging**
- [x] Require approvals
- [x] Number of required approvals: `1`
- [x] Dismiss stale pull request approvals when new commits are pushed

**Require status checks to pass before merging**
- [x] Require branches to be up to date before merging
- [x] 选择状态检查：
  - Backend CI / test (ubuntu-latest)
  - Backend CI / lint (ubuntu-latest)
  - Frontend CI / test (ubuntu-latest)
  - Frontend CI / lint (ubuntu-latest)

**General**
- [x] Require conversation resolution before merging
- [x] Include administrators（推荐启用）

4. 点击 **Create** 或 **Save changes**

---

### 3. GitHub Projects 看板（推荐）

**访问：** https://github.com/snowystudio/login-system/projects

**步骤：**
1. 点击 **New project** 或 **Link a project**
2. 选择 **Board** 模板
3. 项目名称：`Login System`
4. 点击 **Create**

**配置列：**
```
Backlog → Todo → In Progress → Review → Done
```

**自动化规则（可选）：**
- 当 issue 被分配时 → 移动到 In Progress
- 当 PR 创建时 → 移动到 Review
- 当 PR 合并时 → 移动到 Done

---

### 4. 启用 GitHub Actions（可能需要）

**访问：** https://github.com/snowystudio/login-system/actions

如果看到提示 "Actions are not enabled for this repository"：
1. 点击 **Enable Actions**
2. 选择 **Allow all actions and reusable workflows**
3. 点击 **Save**

---

## ✅ 验证配置

### 验证 CI/CD

1. 访问 https://github.com/snowystudio/login-system/actions
2. 应该看到 Backend CI 和 Frontend CI 工作流
3. 最近一次运行应该是绿色 ✅

### 验证标签

1. 访问 https://github.com/snowystudio/login-system/labels
2. 确认以下标签存在：
   - bug (#d73a4a)
   - enhancement (#a2eeef)
   - task (#0075ca)
   - critical (#b60205)
   - high-priority (#d93f0b)
   - documentation (#0075ca)
   - good-first-issue (#7057ff)
   - help-wanted (#008672)

### 验证 CODEOWNERS

1. 访问 https://github.com/snowystudio/login-system/settings/codes
2. 确认 `.github/CODEOWNERS` 文件已生效
3. 应该显示 `* @snowystudio`

---

## 🚀 配置完成后

1. **本地测试：**
   ```bash
   cd /home/cheney/.openclaw/workspace/teams/default-team/projects/login-system
   docker-compose up -d
   ```

2. **创建第一个 Issue：**
   - 访问 https://github.com/snowystudio/login-system/issues/new/choose
   - 选择模板创建 Issue

3. **开始开发：**
   - 创建分支：`git checkout -b feature/your-feature`
   - 开发并提交
   - 推送并创建 PR

---

## 📞 需要帮助？

- 查看 `CONTRIBUTING.md` - 贡献指南
- 查看 `SETUP.md` - 部署指南
- 提 Issue - 我们会帮助你

---

_最后更新：2026-03-14_
