import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Form, Input, message, Divider, Typography } from 'antd';
import { UserOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { supabase } from '../lib/supabase';
import { ThemeToggle } from '../components/ThemeToggle';
import { designTokens, colors } from '../theme';

// Importando as mesmas imagens da HomePage
import imageUrl1 from "/src/assets/random/Captura de tela de 2025-07-18 14-10-05.png";
import imageUrl2 from "/src/assets/random/Captura de tela de 2025-07-18 14-11-36.png";
import imageUrl3 from "/src/assets/random/dim9a0q-e3c73afa-4508-4bcb-a278-50d52548596d.jpg";
import imageUrl4 from "/src/assets/random/dmt2.jpg";



const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Usando as mesmas imagens da HomePage
  const images = [imageUrl1, imageUrl2, imageUrl3, imageUrl4];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Efeito para o carrossel de imagens
  useEffect(() => {
    const imageChangeInterval = 4000;
    const transitionDuration = 1500;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        const newCurrentIndex = (currentImageIndex + 1) % images.length;
        setCurrentImageIndex(newCurrentIndex);
        setNextImageIndex((newCurrentIndex + 1) % images.length);
        setIsTransitioning(false);
      }, transitionDuration);
    }, imageChangeInterval);

    return () => clearInterval(interval);
  }, [currentImageIndex, images.length]);



  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;
      
      message.success('Login realizado com sucesso!');
      // Redirecionar para o dashboard após login bem-sucedido
      navigate('/dashboard');
    } catch (error: any) {
      message.error(error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f9f0 0%, #dcf2dc 50%, #bce5bc 100%)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: designTokens.spacing.lg,
      }}
    >
      {/* Controles superiores */}
      <div 
        style={{
          position: 'fixed',
          top: designTokens.spacing.lg,
          left: designTokens.spacing.lg,
          right: designTokens.spacing.lg,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 1000,
        }}
      >
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            height: 40,
            color: colors.primary[600],
          }}
        >
          Voltar
        </Button>
        <ThemeToggle size="large" />
      </div>

      {/* Content layer */}
      <Card
        style={{
          maxWidth: 450,
          width: '100%',
          borderRadius: designTokens.borderRadius.xl,
          boxShadow: designTokens.shadows.xl,
          backdropFilter: 'blur(15px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: `1px solid ${colors.primary[200]}`,
        }}
        bodyStyle={{
          padding: designTokens.spacing.xl,
        }}
        cover={
          <div 
            style={{
              position: 'relative',
              height: 250,
              borderRadius: `${designTokens.borderRadius.xl}px ${designTokens.borderRadius.xl}px 0 0`,
              overflow: 'hidden',
            }}
          >
            {/* Próxima Imagem - Aparece apenas durante a transição */}
            {isTransitioning && (
              <img
                key={`img-${nextImageIndex}`}
                alt="Hauxenda Gallery Next"
                src={images[nextImageIndex]}
                className="carousel-image crossfade-image fade-in"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
              />
            )}
            {/* Imagem Atual - Fica visível e some na transição */}
            <img
              key={`img-${currentImageIndex}`}
              alt="Hauxenda Gallery Current"
              src={images[currentImageIndex]}
              className={`carousel-image crossfade-image ${
                isTransitioning ? "fade-out" : "fade-in"
              }`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            />
            
            {/* Overlay com gradiente */}
            <div 
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '50%',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.3))',
                zIndex: 1,
              }}
            />
          </div>
        }
      >
        {/* Conteúdo principal */}
        <div style={{ textAlign: 'center' }}>
          <Typography.Title 
            level={2} 
            style={{ 
              margin: 0,
              marginBottom: designTokens.spacing.sm,
              background: 'linear-gradient(135deg, #3d8b3d, #2d6b2d)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            🌅 Acesso do Condutor
          </Typography.Title>
          
          <Typography.Text 
            type="secondary" 
            style={{ 
              fontSize: 14,
              display: 'block',
              marginBottom: designTokens.spacing.lg,
            }}
          >
            Faça login para acessar o painel de controle
          </Typography.Text>

          <Divider 
            style={{ 
              margin: `${designTokens.spacing.lg}px 0`,
              borderColor: colors.primary[200],
            }} 
          />
        
          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            style={{ textAlign: 'left' }}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Por favor, insira seu email!' },
                { type: 'email', message: 'Email inválido!' }
              ]}
            >
              <Input 
                prefix={<UserOutlined style={{ color: colors.primary[500] }} />} 
                placeholder="Digite seu email" 
                style={{
                  borderRadius: designTokens.borderRadius.md,
                }}
              />
            </Form.Item>

            <Form.Item
              label="Senha"
              name="password"
              rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: colors.primary[500] }} />}
                placeholder="Digite sua senha"
                style={{
                  borderRadius: designTokens.borderRadius.md,
                }}
              />
            </Form.Item>

            <Form.Item style={{ marginTop: designTokens.spacing.xl, marginBottom: 0 }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                block
                size="large"
                style={{
                  height: 48,
                  fontSize: 16,
                  fontWeight: 600,
                  borderRadius: designTokens.borderRadius.md,
                }}
              >
                {loading ? 'Entrando...' : 'Entrar no Dashboard'}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
