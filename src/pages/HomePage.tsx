import React, { useState, useEffect } from "react";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { Card, Divider, Typography } from "antd";
import ParticlesBg from "particles-bg";
import "./HomePage.css";

const { Meta } = Card;

const HomePage: React.FC = () => {
  // Imagens da pasta random
  const images = [
    "/src/assets/random/Captura de tela de 2025-07-18 14-10-05.png",
    "/src/assets/random/Captura de tela de 2025-07-18 14-11-36.png",
    "/src/assets/random/dim9a0q-e3c73afa-4508-4bcb-a278-50d52548596d.jpg",
    "/src/assets/random/dmt2.jpg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

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
    <div className="fullscreen-layout">
      {/* Background layer with transparency */}
      <div className="background-container"></div>

      {/* Particles layer - Custom advanced config */}
      <ParticlesBg type="custom" config={config} bg={false} />

      {/* Content layer without transparency */}
      <div className="content-layer">
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
          actions={[
            <div key="haux" style={{ textAlign: "center" }}>
              <MoonOutlined />
              <div>Haux</div>
            </div>,
            <div key="condutor" style={{ textAlign: "center" }}>
              <SunOutlined />
              <div>Condutor</div>
            </div>,
          ]}
        >
          <Meta
            title="Bem-vindo ao Hauxenda"
            description="Gerencie suas cerimônias e participantes de forma simples e elegante"
          />

          <Divider style={{ margin: "24px 0 0" }} />

          <div style={{ textAlign: "center", marginTop: "-8px" }}>
            <Typography.Title level={5} style={{ marginBottom: 0 }}>
              Você É?
            </Typography.Title>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
