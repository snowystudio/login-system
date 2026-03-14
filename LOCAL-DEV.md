# 本地开发环境部署指南

## ⚠️ Docker Hub 网络问题

由于中国大陆访问 Docker Hub 的网络问题，自动部署可能失败。

## 解决方案

### 方案 1: 手动拉取镜像（推荐）

```bash
# 配置镜像加速器
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://docker.m.daocloud.io",
    "https://docker.1panel.live"
  ]
}
EOF

# 重启 Docker
sudo systemctl restart docker

# 手动拉取镜像
docker pull postgres:15-alpine
docker pull node:20-alpine
docker pull nginx:alpine

# 然后运行
docker compose up -d
```

### 方案 2: 本地运行（无需 Docker）

#### 后端

```bash
cd backend

# 安装依赖
npm install

# 配置环境
cp .env.example .env
# 编辑 .env 配置数据库连接

# 如果使用本地 PostgreSQL
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/login_system

# 运行数据库迁移（需要先有 PostgreSQL）
npx prisma migrate dev

# 启动开发服务器
npm run start:dev
```

#### 前端

```bash
cd frontend

# 安装依赖
npm install

# 配置环境
cp .env.example .env

# 启动开发服务器
npm run dev
```

### 方案 3: 使用国内镜像源

修改 `docker-compose.yml`：

```yaml
services:
  db:
    image: registry.cn-hangzhou.aliyuncs.com/library/postgres:15-alpine
```

---

## 快速测试（推荐）

如果只是想测试代码，直接运行：

```bash
# 后端
cd backend
npm install
npm run start:dev

# 前端（新终端）
cd frontend
npm install
npm run dev
```

访问 http://localhost:5173（Vite 默认端口）

---

## 需要的服务

### PostgreSQL（可选）

如果用 Docker：
```bash
docker run -d \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=login_system \
  -p 5432:5432 \
  postgres:15-alpine
```

或者安装本地 PostgreSQL：
```bash
sudo apt install postgresql
sudo -u postgres createdb login_system
```

---

## 验证部署

### 后端 API

```bash
# 健康检查
curl http://localhost:3000

# 测试注册
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234!"}'
```

### 前端

访问 http://localhost:5173 或 http://localhost:80

---

_最后更新：2026-03-14_
