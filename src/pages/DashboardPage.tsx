import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { supabase } from '../lib/supabase';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/condutor');
    } catch (error: any) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: '#f0f2f5'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: 600,
          textAlign: 'center'
        }}
        actions={[
          <Button 
            key="logout"
            type="text" 
            danger 
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Sair
          </Button>
        ]}
      >
        <h1 style={{ 
          fontSize: '24px',
          margin: '0 0 20px 0'
        }}>
          Dashboard
        </h1>
      </Card>
    </div>
  );
};

export default DashboardPage;
