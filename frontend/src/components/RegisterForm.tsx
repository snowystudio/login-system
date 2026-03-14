import React from 'react';
import { Form, Input, Button, Typography, message as antdMessage } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const { Title } = Typography;

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [form] = Form.useForm<RegisterFormData>();

  React.useEffect(() => {
    if (error) {
      antdMessage.error(error);
      clearError();
    }
  }, [error, clearError]);

  const onFinish = async (values: RegisterFormData) => {
    try {
      await register(values.email, values.password);
      antdMessage.success('注册成功！');
      navigate('/dashboard');
    } catch (error: any) {
      // 错误已在 store 中处理并显示
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Title level={2}>创建账号</Title>
        <Title level={5} type="secondary">注册即可开始使用</Title>
      </div>

      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        autoComplete="off"
        size="large"
        disabled={isLoading}
      >
        <Form.Item<RegisterFormData>
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

        <Form.Item<RegisterFormData>
          name="password"
          rules={[
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码长度至少为 6 位' },
            { max: 20, message: '密码长度不能超过 20 位' },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="密码（6-20 位）"
          />
        </Form.Item>

        <Form.Item<RegisterFormData>
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: '请确认密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="确认密码"
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
            注册
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center' }}>
          <span style={{ color: '#999' }}>已有账号？</span>
          <Link to="/login" style={{ marginLeft: 8 }}>
            立即登录
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default RegisterForm;
