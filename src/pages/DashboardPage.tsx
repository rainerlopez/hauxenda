import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Typography } from "antd";
import { LogoutOutlined, PlusOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { supabase } from "../lib/supabase";
import './DashboardPage.css';

const { Title, Text } = Typography;

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

  const handleCreateEvent = () => {
    navigate('/create-event');
  };

  const handleManageEvents = () => {
    navigate('/events');
  };

  const handleViewParticipants = () => {
    // TODO: Navigate to participants page
    console.log('Visualizar participantes');
  };

  return (
    <div className="dashboard-layout">
      <div className="dashboard-content">
        <Card
          className="dashboard-card"
          actions={[
            <Button
              key="logout"
              type="text"
              className="logout-btn"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Sair
            </Button>,
          ]}
        >
          <Title className="dashboard-title">Dashboard Administrativo</Title>

          <Text className="dashboard-subtitle">
            Gerencie seus eventos e participantes
          </Text>

          <div className="dashboard-actions">
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              className="dashboard-action-btn"
              onClick={handleCreateEvent}
            >
              Criar Nova Cerimônia
            </Button>

            <Button
              type="default"
              size="large"
              icon={<CalendarOutlined />}
              className="dashboard-action-btn"
              onClick={handleManageEvents}
            >
              Gerenciar Eventos
            </Button>

            <Button
              type="default"
              size="large"
              icon={<UserOutlined />}
              className="dashboard-action-btn"
              onClick={handleViewParticipants}
            >
              Visualizar Participantes
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
