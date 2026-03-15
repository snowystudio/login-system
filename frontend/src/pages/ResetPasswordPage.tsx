import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Alert } from 'antd';
import { SafetyOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PasswordStrengthMeter } from '../components/PasswordStrengthMeter';
import { resetPassword } from '../api/auth';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      message.error('缺少重置 token');
      navigate('/forgot-password');
    }
  }, [searchParams, navigate]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await resetPassword(token, values.newPassword);
      message.success('密码重置成功，请登录');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error: any) {
      if (error.response?.data?.message === 'Token 已过期') {
        message.error('重置链接已过期，请重新申请');
        setTimeout(() => navigate('/forgot-password'), 1500);
      } else if (error.response?.data?.message === '无效的 token') {
        message.error('重置链接无效');
      } else {
        message.error(error.response?.data?.message || '密码重置失败');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '50px auto' }}>
      <Card title="重置密码" bordered={false}>
        <Alert
          message="设置新密码"
          description="密码长度 8-20 位，需包含大写字母、小写字母、数字、特殊字符中的至少 3 种"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />
        <Form name="reset_password" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 8, message: '密码至少 8 位' },
              { max: 20, message: '密码最多 20 位' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="新密码"
              size="large"
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Item>

          {newPassword && <PasswordStrengthMeter password={newPassword} />}

          <Form.Item
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<SafetyOutlined />}
              placeholder="确认新密码"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              重置密码
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
