import React from 'react';
import {
  Card,
  Button,
  Space,
  Typography,
  Input,
  Select,
  Checkbox,
  Radio,
  Switch,
  Slider,
  Progress,
  Tag,
  Badge,
  Rate,
  Steps,
  Tabs,
  Alert,
  Divider,
  Row,
  Col,
} from 'antd';
import {
  HeartOutlined,
  StarOutlined,
  LikeOutlined,
  MessageOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { ThemeToggle } from './ThemeToggle';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { Step } = Steps;
const { TabPane } = Tabs;

export const ThemeDemo: React.FC = () => {
  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <Card className="hauxenda-header" style={{ marginBottom: '24px', textAlign: 'center' }}>
        <Title level={1} style={{ color: 'white', margin: 0 }}>
          Hauxenda - Tema Customizado
        </Title>
        <Paragraph style={{ color: 'white', fontSize: '16px', margin: '8px 0 0 0' }}>
          Demonstração das cores #43cea2 e #185a9d aplicadas no Ant Design
        </Paragraph>
        <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
          <ThemeToggle size="large" />
        </div>
      </Card>

      <Row gutter={[24, 24]}>
        {/* Botões */}
        <Col xs={24} md={12}>
          <Card title="Botões" className="hauxenda-card">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space wrap>
                <Button type="primary">Primário</Button>
                <Button type="default">Padrão</Button>
                <Button type="dashed">Tracejado</Button>
                <Button type="text">Texto</Button>
                <Button type="link">Link</Button>
              </Space>
              <Space wrap>
                <Button type="primary" size="large">Grande</Button>
                <Button type="primary">Médio</Button>
                <Button type="primary" size="small">Pequeno</Button>
              </Space>
              <Space wrap>
                <Button type="primary" icon={<HeartOutlined />}>
                  Com Ícone
                </Button>
                <Button type="primary" loading>
                  Carregando
                </Button>
                <Button type="primary" disabled>
                  Desabilitado
                </Button>
              </Space>
            </Space>
          </Card>
        </Col>

        {/* Formulários */}
        <Col xs={24} md={12}>
          <Card title="Formulários" className="hauxenda-card">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Input placeholder="Digite seu nome" />
              <Input.Password placeholder="Digite sua senha" />
              <Select placeholder="Selecione uma opção" style={{ width: '100%' }}>
                <Option value="opcao1">Opção 1</Option>
                <Option value="opcao2">Opção 2</Option>
                <Option value="opcao3">Opção 3</Option>
              </Select>
              <Space>
                <Checkbox>Checkbox</Checkbox>
                <Radio>Radio</Radio>
                <Switch defaultChecked />
              </Space>
            </Space>
          </Card>
        </Col>

        {/* Tipografia */}
        <Col xs={24} md={12}>
          <Card title="Tipografia" className="hauxenda-card">
            <Title level={2} className="hauxenda-gradient-text">
              Título com Gradiente
            </Title>
            <Title level={3}>Título Nível 3</Title>
            <Title level={4}>Título Nível 4</Title>
            <Paragraph>
              Este é um parágrafo de exemplo demonstrando a tipografia do tema.
              <Text strong> Texto em negrito</Text>, <Text italic>texto em itálico</Text>,
              e <Text code>código inline</Text>.
            </Paragraph>
            <Paragraph>
              <Text type="secondary">Texto secundário</Text> e{' '}
              <Text type="success">texto de sucesso</Text>.
            </Paragraph>
          </Card>
        </Col>

        {/* Componentes Interativos */}
        <Col xs={24} md={12}>
          <Card title="Componentes Interativos" className="hauxenda-card">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text>Slider:</Text>
                <Slider defaultValue={30} />
              </div>
              <div>
                <Text>Progress:</Text>
                <Progress percent={70} />
              </div>
              <div>
                <Text>Rate:</Text>
                <Rate defaultValue={4} />
              </div>
              <div>
                <Text>Tags:</Text>
                <Space>
                  <Tag color="green">Verde</Tag>
                  <Tag color="blue">Azul</Tag>
                  <Tag>Padrão</Tag>
                  <Badge count={5}>
                    <Tag>Com Badge</Tag>
                  </Badge>
                </Space>
              </div>
            </Space>
          </Card>
        </Col>

        {/* Steps */}
        <Col xs={24}>
          <Card title="Steps (Passos)" className="hauxenda-card">
            <Steps current={1}>
              <Step title="Concluído" description="Este passo foi concluído." />
              <Step title="Em Progresso" description="Este passo está em progresso." />
              <Step title="Aguardando" description="Este passo está aguardando." />
            </Steps>
          </Card>
        </Col>

        {/* Tabs */}
        <Col xs={24}>
          <Card title="Tabs (Abas)" className="hauxenda-card">
            <Tabs defaultActiveKey="1">
              <TabPane tab="Aba 1" key="1">
                <Paragraph>
                  Conteúdo da primeira aba. As cores primárias são aplicadas
                  automaticamente nos elementos ativos.
                </Paragraph>
              </TabPane>
              <TabPane tab="Aba 2" key="2">
                <Paragraph>
                  Conteúdo da segunda aba. Note como a cor de destaque
                  segue o tema customizado.
                </Paragraph>
              </TabPane>
              <TabPane tab="Aba 3" key="3">
                <Paragraph>
                  Conteúdo da terceira aba com mais informações sobre
                  a aplicação do tema.
                </Paragraph>
              </TabPane>
            </Tabs>
          </Card>
        </Col>

        {/* Alertas */}
        <Col xs={24}>
          <Card title="Alertas e Mensagens" className="hauxenda-card">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Alert message="Sucesso" description="Operação realizada com sucesso!" type="success" showIcon />
              <Alert message="Informação" description="Esta é uma mensagem informativa." type="info" showIcon />
              <Alert message="Aviso" description="Atenção a esta mensagem de aviso." type="warning" showIcon />
              <Alert message="Erro" description="Ocorreu um erro na operação." type="error" showIcon />
            </Space>
          </Card>
        </Col>

        {/* Ações */}
        <Col xs={24}>
          <Card title="Ações Sociais" className="hauxenda-card">
            <Space size="large">
              <Button type="text" icon={<LikeOutlined />} size="large">
                Curtir
              </Button>
              <Button type="text" icon={<MessageOutlined />} size="large">
                Comentar
              </Button>
              <Button type="text" icon={<ShareAltOutlined />} size="large">
                Compartilhar
              </Button>
              <Button type="text" icon={<StarOutlined />} size="large">
                Favoritar
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <Text type="secondary">
          Tema customizado do Hauxenda com cores #43cea2 (primária) e #185a9d (secundária)
        </Text>
      </div>
    </div>
  );
};
