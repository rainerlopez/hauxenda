import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { Card, Divider, Typography, Button, Space } from "antd";
import ParticlesBg from "particles-bg";
import { ThemeToggle } from '../components/ThemeToggle';
import { designTokens, colors } from '../theme';
import "./HomePage.css";

// Importando as imagens para que o Vite as inclua no build
import imageUrl1 from "/src/assets/random/Captura de tela de 2025-07-18 14-10-05.png";
import imageUrl2 from "/src/assets/random/Captura de tela de 2025-07-18 14-11-36.png";
import imageUrl3 from "/src/assets/random/dim9a0q-e3c73afa-4508-4bcb-a278-50d52548596d.jpg";
import imageUrl4 from "/src/assets/random/dmt2.jpg";



const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  // Usando as imagens importadas
  const images = [imageUrl1, imageUrl2, imageUrl3, imageUrl4];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleCondutorClick = () => {
    navigate('/condutor');
  };

  useEffect(() => {
    const imageChangeInterval = 4000; // Tempo total para trocar a imagem
    const transitionDuration = 1500; // Duração da animação de fade (deve ser igual ao do CSS)

    const interval = setInterval(() => {
      setIsTransitioning(true);

      // Após a transição, atualiza os índices
      setTimeout(() => {
        const newCurrentIndex = (currentImageIndex + 1) % images.length;
        setCurrentImageIndex(newCurrentIndex);
        setNextImageIndex((newCurrentIndex + 1) % images.length);
        setIsTransitioning(false);
      }, transitionDuration);
    }, imageChangeInterval);

    return () => clearInterval(interval);
  }, [currentImageIndex, images.length]);

  const config = {
    num: [4, 7],
    rps: 0.1,
    radius: [5, 40],
    life: [2, 3],
    v: [0.02, 0.05],
    tha: [-40, 40],
    alpha: [0.5, 0],
    scale: [0.1, 0.3],
    position: "all" as const,
    color: [
      "#ffffff",
      "#90EE90",
      "#32CD32",
      "#228B22",
      "#FFD700",
      "#FFA500",
      "#FFFF00",
    ],
    cross: "dead" as const,
    random: 15,
    g: 1,
    ...(Math.random() > 0.85 && {
      onParticleUpdate: (ctx: CanvasRenderingContext2D, particle: any) => {
        ctx.beginPath();
        ctx.rect(
          particle.p.x,
          particle.p.y,
          particle.radius * 2,
          particle.radius * 2
        );
        ctx.fillStyle = particle.color;
        ctx.fill();
        ctx.closePath();
      },
    }),
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
      {/* Particles layer - Custom advanced config */}
      <ParticlesBg type="custom" config={config} bg={false} />

      {/* Theme Toggle - Posição fixa no canto superior direito */}
      <div 
        style={{
          position: 'fixed',
          top: designTokens.spacing.lg,
          right: designTokens.spacing.lg,
          zIndex: 1000,
        }}
      >
        <ThemeToggle size="large" />
      </div>

      {/* Content layer */}
      <Card
        style={{
          maxWidth: 500,
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
              height: 300,
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
            level={1} 
            style={{ 
              margin: 0,
              marginBottom: designTokens.spacing.sm,
              background: 'linear-gradient(135deg, #3d8b3d, #2d6b2d)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: 32,
            }}
          >
            🌿 Bem-vindo ao Hauxenda
          </Typography.Title>
          
          <Typography.Text 
            type="secondary" 
            style={{ 
              fontSize: 16,
              display: 'block',
              marginBottom: designTokens.spacing.xl,
              lineHeight: 1.6,
            }}
          >
            Gerencie suas cerimônias e participantes de forma simples e elegante
          </Typography.Text>

          <Divider 
            style={{ 
              margin: `${designTokens.spacing.lg}px 0`,
              borderColor: colors.primary[200],
            }} 
          />

          <Typography.Title 
            level={4} 
            style={{ 
              marginBottom: designTokens.spacing.lg,
              color: colors.primary[600],
            }}
          >
            Você é?
          </Typography.Title>

          {/* Botões de ação */}
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Button
              size="large"
              icon={<MoonOutlined />}
              style={{
                height: 60,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: 500,
                borderColor: colors.accent.indigo,
                color: colors.accent.indigo,
              }}
            >
              <div>
                <div>Participante</div>
                <Typography.Text 
                  style={{ 
                    fontSize: 12,
                    color: colors.neutral[500],
                    display: 'block',
                  }}
                >
                  Buscar eventos e cerimônias
                </Typography.Text>
              </div>
            </Button>
            
            <Button
              type="primary"
              size="large"
              icon={<SunOutlined />}
              onClick={handleCondutorClick}
              style={{
                height: 60,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              <div>
                <div>Condutor</div>
                <Typography.Text 
                  style={{ 
                    fontSize: 12,
                    color: 'rgba(255, 255, 255, 0.8)',
                    display: 'block',
                  }}
                >
                  Gerenciar eventos e participantes
                </Typography.Text>
              </div>
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default HomePage;
