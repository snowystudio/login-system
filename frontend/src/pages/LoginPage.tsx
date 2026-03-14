import React from 'react';
import { Layout } from 'antd';
import LoginForm from '../components/LoginForm';

const { Content } = Layout;

const LoginPage: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            background: '#fff',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            width: '100%',
            maxWidth: 450,
          }}
        >
          <LoginForm />
        </div>
      </Content>
    </Layout>
  );
};

export default LoginPage;
