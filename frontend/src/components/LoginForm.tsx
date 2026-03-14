import React from 'react';
import { Form, Input, Button, Typography, message as antdMessage } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import type { LoginFormData } from '../utils/validation';

const { Title } = Typography;

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [form] = Form.useForm<LoginFormData>();

  React.useEffect(() => {
    if (error) {
      antdMessage.error(error);
      clearError();
    }
  }, [error, clearError]);

  const onFinish = async (values: LoginFormData) => {
    try {
      await login(values.email, values.password);
      antdMessage.success('登录成功！');
      navigate('/dashboard');
    } catch (error: any) {
      // 错误已在 store 中处理并显示
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Title level={2}>欢迎回来</Title>
        <Title level={5} type="secondary">请登录您的账号</Title>
      </div>

      <Form
        form={form}
        name="login"
        onFinish={onFinish}
        autoComplete="off"
        size="large"
        disabled={isLoading}
      >
        <Form.Item<LoginFormData>
          name="email"
          rules={[
            { required: true, message: '请输入邮箱地址' },
            { type: 'email', message: '请输入有效的邮箱地址' },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="邮箱地址"
            type="email"
          />
        </Form.Item>

        <Form.Item<LoginFormData>
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="密码"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            block
            size="large"
          >
            登录
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center' }}>
          <span style={{ color: '#999' }}>还没有账号？</span>
          <Link to="/register" style={{ marginLeft: 8 }}>
            立即注册
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default LoginForm;
