import React from 'react';
import { Layout, Button, Typography, Card, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogoutOutlined, DashboardOutlined, UserOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
          <DashboardOutlined /> 登录系统
        </div>
        <Space>
          <Text style={{ color: '#fff' }}>欢迎，{user?.email}</Text>
          <Button
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            danger
          >
            退出登录
          </Button>
        </Space>
      </Header>
      <Content style={{ padding: '24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <Card style={{ marginBottom: 24 }}>
          <Title level={2}>仪表盘</Title>
          <Text type="secondary">欢迎使用登录系统，您已成功登录。</Text>
        </Card>

        <Card title="用户信息">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <UserOutlined /> <strong>用户 ID:</strong> {user?.id}
            </div>
            <div>
              <UserOutlined /> <strong>邮箱:</strong> {user?.email}
            </div>
            <div>
              <UserOutlined /> <strong>注册时间:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleString('zh-CN') : '未知'}
            </div>
          </Space>
        </Card>
      </Content>
    </Layout>
  );
};

export default DashboardPage;
