import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Typography, Space, Row, Col } from 'antd';
import { LogoutOutlined, PlusOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { supabase } from '../lib/supabase';
import { ThemeToggle } from '../components/ThemeToggle';
import { designTokens } from '../theme';
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
    // TODO: Navigate to create event page
    console.log('Criar novo evento');
  };

  const handleManageEvents = () => {
    // TODO: Navigate to manage events page
    console.log('Gerenciar eventos');
  };

  const handleViewParticipants = () => {
    // TODO: Navigate to participants page
    console.log('Visualizar participantes');
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f9f0 0%, #dcf2dc 100%)',
        padding: designTokens.spacing.lg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Card
        style={{
          maxWidth: 600,
          width: '100%',
          borderRadius: designTokens.borderRadius.xl,
          boxShadow: designTokens.shadows.xl,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
        }}
        bodyStyle={{
          padding: designTokens.spacing.xl,
        }}
      >
        {/* Header com título e controles */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: designTokens.spacing.xl,
          }}
        >
          <div>
            <Title 
              level={1} 
              style={{ 
                margin: 0,
                background: 'linear-gradient(135deg, #3d8b3d, #2d6b2d)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              🌿 Dashboard Administrativo
            </Title>
            <Text 
              type="secondary" 
              style={{ 
                fontSize: 16,
                display: 'block',
                marginTop: designTokens.spacing.sm,
              }}
            >
              Gerencie seus eventos e cerimônias sagradas
            </Text>
          </div>
          
          <Space>
            <ThemeToggle size="large" />
            <Button 
              type="text" 
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                height: 40,
              }}
            >
              Sair
            </Button>
          </Space>
        </div>

        {/* Ações principais */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={8}>
            <Button 
              type="primary" 
              size="large"
              icon={<PlusOutlined />}
              onClick={handleCreateEvent}
              block
              style={{
                height: 80,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              <div>Criar Evento</div>
              <Text 
                style={{ 
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                Nova cerimônia
              </Text>
            </Button>
          </Col>
          
          <Col xs={24} sm={12} md={8}>
            <Button 
              type="default" 
              size="large"
              icon={<CalendarOutlined />}
              onClick={handleManageEvents}
              block
              style={{
                height: 80,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: 500,
              }}
            >
              <div>Gerenciar Eventos</div>
              <Text 
                type="secondary" 
                style={{ 
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                Editar e organizar
              </Text>
            </Button>
          </Col>
          
          <Col xs={24} sm={12} md={8}>
            <Button 
              type="default" 
              size="large"
              icon={<UserOutlined />}
              onClick={handleViewParticipants}
              block
              style={{
                height: 80,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: 500,
              }}
            >
              <div>Participantes</div>
              <Text 
                type="secondary" 
                style={{ 
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                Visualizar lista
              </Text>
            </Button>
          </Col>
        </Row>

        {/* Estatísticas rápidas */}
        <div 
          style={{
            marginTop: designTokens.spacing.xl,
            padding: designTokens.spacing.lg,
            background: 'linear-gradient(135deg, #f0f9f0, #dcf2dc)',
            borderRadius: designTokens.borderRadius.lg,
            border: '1px solid rgba(61, 139, 61, 0.1)',
          }}
        >
          <Text 
            style={{ 
              fontSize: 14,
              color: '#3d8b3d',
              fontWeight: 500,
              display: 'block',
              textAlign: 'center',
            }}
          >
            ✨ Bem-vindo ao seu espaço sagrado de administração ✨
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;
