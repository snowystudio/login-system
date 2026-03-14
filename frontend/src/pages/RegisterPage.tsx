import React from 'react';
import { Layout } from 'antd';
import RegisterForm from '../components/RegisterForm';

const { Content } = Layout;

const RegisterPage: React.FC = () => {
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
          <RegisterForm />
        </div>
      </Content>
    </Layout>
  );
};

export default RegisterPage;
