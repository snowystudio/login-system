# 贡献指南

感谢你对这个项目的兴趣！以下是参与贡献的指南。

## 开发环境设置

### 1. Fork 并克隆

```bash
git clone https://github.com/YOUR_USERNAME/login-system.git
cd login-system
```

### 2. 安装依赖

```bash
# 后端
cd backend
npm install

# 前端
cd frontend
npm install
```

### 3. 配置环境变量

```bash
# 后端
cp backend/.env.example backend/.env

# 前端
cp frontend/.env.example frontend/.env
```

### 4. 启动开发环境

```bash
# 后端
cd backend
npm run start:dev

# 前端（新终端）
cd frontend
npm run dev
```

## 提交流程

### 1. 创建分支

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/issue-number
```

### 2. 开发并提交

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
git commit -m "feat: 添加用户注册功能"
git commit -m "fix: 修复登录错误提示"
git commit -m "docs: 更新 README"
```

### 3. 推送并创建 PR

```bash
git push origin feature/your-feature-name
```

然后在 GitHub 上创建 Pull Request。

## PR 要求

- [ ] 关联 Issue（如有）
- [ ] 通过所有 CI 检查
- [ ] 代码审查通过
- [ ] 测试覆盖（如适用）

## 代码规范

### 后端 (NestJS)

- 使用 TypeScript 严格模式
- 遵循 NestJS 最佳实践
- 添加必要的注释

### 前端 (React)

- 使用 TypeScript 严格模式
- 组件使用函数式写法
- 遵循 React Hooks 规范

## 问题报告

请使用 GitHub Issues 报告问题：

- Bug 报告：使用 Bug Report 模板
- 功能请求：使用 Feature Request 模板

## 发布流程

1. 更新版本号
2. 更新 CHANGELOG
3. 创建 Release
4. 自动部署

---

有任何问题，欢迎在 Issues 中提问！
