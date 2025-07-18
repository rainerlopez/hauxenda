import React from "react";
import { EditOutlined, SettingOutlined } from "@ant-design/icons";
import { Card } from "antd";
import ParticlesBg from "particles-bg";
import "./TestBg.css";

const { Meta } = Card;

const TestBg: React.FC = () => {
  const config = {
    num: [4, 7],
    rps: 0.1,
    radius: [5, 40],
    life: [2, 3],
    v: [0.05, 0.1],
    tha: [-40, 40],
    alpha: [0.8, 0],
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
          style={{ width: 600 }}
          cover={
            <img
              alt="example"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            />
          }
          actions={[
            <SettingOutlined key="setting" />,
            <EditOutlined key="edit" />,
          ]}
        >
          <Meta title="Card title" description="This is the description" />
        </Card>
      </div>
    </div>
  );
};

export default TestBg;
