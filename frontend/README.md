# 登录系统前端

基于 React + TypeScript + Ant Design 的用户登录系统前端应用。

## 技术栈

- **框架**: React 18 + TypeScript
- **UI 库**: Ant Design 5
- **状态管理**: Zustand
- **路由**: React Router v6
- **HTTP 客户端**: Axios
- **表单验证**: Zod
- **构建工具**: Vite

## 功能特性

- ✅ 用户注册（邮箱 + 密码）
- ✅ 用户登录（邮箱 + 密码）
- ✅ Token 自动存储和携带
- ✅ 受保护路由（未登录自动重定向）
- ✅ 自动登录（Token 持久化）
- ✅ 退出登录
- ✅ 响应式设计（支持移动端）
- ✅ 表单验证
- ✅ 友好的错误提示

## 项目结构

```
frontend/
├── src/
│   ├── components/       # 可复用组件
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── ProtectedRoute.tsx
│   ├── pages/           # 页面组件
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── DashboardPage.tsx
│   ├── store/           # Zustand 状态管理
│   │   └── authStore.ts
│   ├── api/             # API 调用
│   │   └── auth.ts
│   ├── utils/           # 工具函数
│   │   ├── axios.ts
│   │   └── validation.ts
│   ├── App.tsx          # 应用入口
│   └── main.tsx         # React 入口
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 快速开始

### 1. 安装依赖

```bash
cd projects/login-system/frontend
npm install
```

### 2. 配置环境变量（可选）

创建 `.env` 文件：

```env
VITE_API_BASE_URL=/api
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3001

### 4. 构建生产版本

```bash
npm run build
npm run preview
```

## API 集成

前端已配置与后端 API 的集成：

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/auth/register` | POST | 用户注册 |
| `/api/auth/login` | POST | 用户登录 |
| `/api/auth/logout` | POST | 退出登录 |
| `/api/auth/me` | GET | 获取当前用户 |

### Token 处理

- Token 存储在 `localStorage`，key 为 `auth_token`
- Axios 拦截器自动在请求头添加 `Authorization: Bearer <token>`
- 401 错误时自动清除 Token 并跳转登录页

## 开发说明

### 状态管理

使用 Zustand 管理认证状态：

```typescript
import { useAuthStore } from './store/authStore';

const { user, isAuthenticated, login, logout } = useAuthStore();
```

### 表单验证

使用 Zod 进行表单验证：

```typescript
import { loginSchema } from './utils/validation';

const schema = loginSchema.parse(formData);
```

### 受保护路由

使用 `ProtectedRoute` 组件保护需要登录的页面：

```typescript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

## 注意事项

- 确保后端服务运行在 `http://localhost:3000`
- Vite 已配置代理，开发环境直接调用 `/api` 即可
- 生产环境需配置正确的 API 地址

## 下一步

- [ ] 添加 GitHub OAuth 登录
- [ ] 实现记住我功能
- [ ] 添加忘记密码流程
- [ ] 完善错误处理和边界情况
- [ ] 添加单元测试

---

*最后更新：2026-03-14*
