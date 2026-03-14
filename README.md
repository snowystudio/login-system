# Login System - 用户登录系统

全栈用户登录系统，支持邮箱密码登录和 GitHub OAuth 登录。

## 技术栈

### 后端
- **框架:** NestJS (TypeScript)
- **数据库:** PostgreSQL
- **ORM:** Prisma
- **认证:** JWT + bcrypt

### 前端
- **框架:** React (TypeScript)
- **UI 库:** Ant Design
- **状态管理:** Zustand

## 快速开始

### 后端

```bash
cd backend
npm install
cp .env.example .env
# 配置数据库连接
npx prisma migrate dev
npm run start:dev
```

### 前端

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## 功能特性

- ✅ 用户注册/登录
- ✅ JWT 认证
- ✅ 密码加密存储 (bcrypt)
- ✅ 速率限制防护
- ✅ Token 自动刷新
- ⏳ GitHub OAuth 登录 (待实现)
- ⏳ 忘记密码 (待实现)

## 项目结构

```
login-system/
├── backend/           # NestJS 后端
│   ├── src/
│   │   ├── auth/      # 认证模块
│   │   ├── users/     # 用户模块
│   │   └── ...
│   └── prisma/        # 数据库 Schema
├── frontend/          # React 前端
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── store/
│       └── api/
└── tests/             # 测试用例
```

## 安全特性

- 密码加密存储 (bcrypt cost=12)
- JWT Token 2 小时过期
- 登录接口速率限制 (5 次/分钟)
- 统一错误信息（不泄露账号是否存在）
- CSRF 防护

## 测试

```bash
# 后端测试
cd backend
npm run test

# 前端测试
cd frontend
npm run test
```

## 部署

### Docker

```bash
docker-compose up -d
```

### 环境变量

见 `.env.example` 文件。

## 开发团队

- Product Owner: Product Owner Agent
- Tech Lead: Tech Lead Agent
- Backend: Backend Dev Agent
- Frontend: Frontend Dev Agent
- QA: QA Engineer Agent

---

_由多代理协作开发 | 最后更新：2026-03-14_
