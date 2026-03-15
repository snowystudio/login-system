import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Alert } from 'antd';
import { LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { PasswordStrengthMeter } from '../components/PasswordStrengthMeter';
import { changePassword } from '../api/auth';

export const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await changePassword(values.currentPassword, values.newPassword);
      message.success('密码修改成功，请重新登录');
      setTimeout(() => {
        localStorage.removeItem('token');
        navigate('/login');
      }, 1500);
    } catch (error: any) {
      if (error.response?.data?.code === 'PASSWORD_REUSED') {
        message.error('不得使用最近 5 次使用过的密码');
      } else if (error.response?.data?.requirements) {
        message.error(`密码强度不足：${error.response.data.requirements.join('、')}`);
      } else {
        message.error(error.response?.data?.message || '密码修改失败');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '50px auto' }}>
      <Card title="修改密码" bordered={false}>
        <Alert
          message="密码要求"
          description="密码长度 8-20 位，需包含大写字母、小写字母、数字、特殊字符中的至少 3 种"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />
        <Form name="change_password" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="currentPassword"
            rules={[{ required: true, message: '请输入当前密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="当前密码"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 8, message: '密码至少 8 位' },
              { max: 20, message: '密码最多 20 位' },
            ]}
          >
            <Input.Password
              prefix={<SafetyOutlined />}
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
              修改密码
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
