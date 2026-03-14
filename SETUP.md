# 快速部署指南

## 本地开发

```bash
# 克隆仓库
git clone https://github.com/snowystudio/login-system.git
cd login-system

# 后端
cd backend
cp .env.example .env
# 编辑 .env 配置数据库连接
npm install
npx prisma migrate dev
npm run start:dev

# 前端（新终端）
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Docker 部署

```bash
# 复制环境变量
cp .env.example .env
# 编辑 .env 配置密码和密钥

# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

访问：http://localhost

## 生产部署

### 环境变量

确保设置以下环境变量：

```bash
# 必需
JWT_SECRET=<随机 32 字符以上>
DB_PASSWORD=<强密码>
DATABASE_URL=postgresql://postgres:${DB_PASSWORD}@db:5432/login_system

# GitHub OAuth（可选）
GITHUB_CLIENT_ID=<your-client-id>
GITHUB_CLIENT_SECRET=<your-client-secret>
```

### 生成 JWT Secret

```bash
openssl rand -base64 32
```

### 注册 GitHub OAuth

1. 访问 https://github.com/settings/developers
2. New OAuth App
3. 配置：
   - Application name: Login System
   - Homepage URL: https://your-domain.com
   - Authorization callback URL: https://your-domain.com/api/auth/github/callback
4. 复制 Client ID 和 Client Secret 到环境变量

### 分支保护

启用分支保护后，所有代码需要通过 PR 合并：

1. Settings → Branches → Add branch protection rule
2. 规则：`main`
3. 启用：Require PR、Require status checks、Require approvals

详见 `.github/BRANCH_PROTECTION.md`

## CI/CD

GitHub Actions 已配置：

- **Backend CI**: 推送时自动测试和构建
- **Frontend CI**: 推送时自动测试和构建
- **Docker Build**: 推送时自动构建镜像

查看状态：https://github.com/snowystudio/login-system/actions

---

有问题？提 Issue 或查看 CONTRIBUTING.md
