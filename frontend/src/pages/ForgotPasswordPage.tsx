import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Alert } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { forgotPassword } from '../api/auth';

export const ForgotPasswordPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await forgotPassword(values.email);
      setSubmitted(true);
    } catch (error: any) {
      message.error(error.response?.data?.message || '发送失败');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ maxWidth: 500, margin: '50px auto' }}>
        <Card title="重置链接已发送" bordered={false}>
          <Alert
            message="检查邮箱"
            description="如果该邮箱已注册，您会收到一封包含密码重置链接的邮件。请检查收件箱（包括垃圾邮件箱）。"
            type="success"
            showIcon
            style={{ marginBottom: 24 }}
          />
          <Button type="primary" block size="large" onClick={() => setSubmitted(false)}>
            重新发送
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 500, margin: '50px auto' }}>
      <Card title="忘记密码" bordered={false}>
        <Alert
          message="提示"
          description="输入您的注册邮箱，我们将发送密码重置链接"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />
        <Form name="forgot_password" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '邮箱格式不正确' },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="注册邮箱"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              发送重置链接
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
