import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Form, Input, message, Divider } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { supabase } from '../lib/supabase';

// Importando as mesmas imagens da HomePage
import imageUrl1 from "/src/assets/random/Captura de tela de 2025-07-18 14-10-05.png";
import imageUrl2 from "/src/assets/random/Captura de tela de 2025-07-18 14-11-36.png";
import imageUrl3 from "/src/assets/random/dim9a0q-e3c73afa-4508-4bcb-a278-50d52548596d.jpg";
import imageUrl4 from "/src/assets/random/dmt2.jpg";

const { Meta } = Card;

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
    <div className="fullscreen-layout">
      {/* Background layer with transparency */}
      <div className="background-container"></div>

      {/* Content layer */}
      <div className="content-layer" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Card
          className="home-card"
          cover={
            <div className="image-carousel">
              {/* Próxima Imagem - Aparece apenas durante a transição */}
              {isTransitioning && (
                <img
                  key={`img-${nextImageIndex}`}
                  alt="Hauxenda Gallery Next"
                  src={images[nextImageIndex]}
                  className="carousel-image crossfade-image fade-in"
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
              />
            </div>
          }
        >
          <Meta
            title="Acesso do Condutor"
            description="Faça login para acessar o painel de controle"
          />

          <Divider style={{ margin: "24px 0 16px" }} />
        
              <Form
                name="login"
                onFinish={onFinish}
                layout="vertical"
                size="large"
              >
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Por favor, insira seu email!' },
                    { type: 'email', message: 'Email inválido!' }
                  ]}
                >
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder="Email" 
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Senha"
                  />
                </Form.Item>

                <Form.Item style={{ marginTop: '32px' }}>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={loading}
                    block
                  >
                    Entrar
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </div>
        </div>
  );
};

export default LoginPage;
