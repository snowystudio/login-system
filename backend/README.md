# 登录系统后端

基于 NestJS + Prisma + PostgreSQL 的用户认证系统。

## 技术栈

- **框架**: NestJS (TypeScript)
- **数据库**: PostgreSQL
- **ORM**: Prisma
- **认证**: JWT (HS256)
- **密码加密**: bcrypt (cost=12)

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，配置数据库连接和 JWT 密钥
```

### 3. 启动数据库

确保 PostgreSQL 运行，并创建数据库：

```bash
createdb login_system
```

### 4. 生成 Prisma 客户端并执行迁移

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 5. 启动开发服务器

```bash
npm run start:dev
```

服务将在 `http://localhost:3000` 启动。

## API 接口

### 注册
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### 登录
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### 退出登录
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

## 安全配置

- 密码使用 bcrypt 加密（cost=12）
- JWT Token 使用 HS256 算法，有效期 2 小时
- 错误信息不泄露用户是否存在
- 建议生产环境使用 HTTPS

## 下一步

- [ ] Phase 3: 完善 Token 黑名单机制
- [ ] GitHub OAuth 集成
- [ ] 速率限制
- [ ] 单元测试
