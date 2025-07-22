import { useState } from 'react';
import { Button, Card, List, Typography, Space, Input, Form, Upload, message } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useSupabaseContext } from '../contexts/SupabaseContext';
import { StorageService } from '../services/storage';

const { Title, Text } = Typography;

export function SupabaseExample() {
  const {
    // Auth
    user,
    authLoading,
    
    // Events
    events,
    eventsLoading,
    createEvent,
    fetchEvents
  } = useSupabaseContext();

  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);

  const handleCreateEvent = async (values: any) => {
    if (!user) {
      message.error('Você precisa estar logado para criar um evento');
      return;
    }

    try {
      const eventData = {
        ...values,
        admin_id: user.id,
        datetime: new Date(values.datetime).toISOString()
      };

      const { error } = await createEvent(eventData);
      
      if (error) {
        message.error(`Erro ao criar evento: ${error}`);
      } else {
        message.success('Evento criado com sucesso!');
        form.resetFields();
      }
    } catch (error) {
      message.error('Erro inesperado ao criar evento');
    }
  };

  const handleImageUpload = async (file: File, eventId: string) => {
    setUploading(true);
    try {
      const { data, error } = await StorageService.uploadEventImage(eventId, file);
      
      if (error) {
        message.error(`Erro no upload: ${error}`);
      } else {
        message.success('Imagem enviada com sucesso!');
        console.log('Image uploaded:', data);
      }
    } catch (error) {
      message.error('Erro inesperado no upload');
    } finally {
      setUploading(false);
    }
  };

  if (authLoading) {
    return <div>Carregando autenticação...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2}>Integração Supabase - Hauxenda</Title>
      
      {/* Auth Status */}
      <Card title="Status da Autenticação" style={{ marginBottom: '20px' }}>
        {user ? (
          <Space direction="vertical">
            <Text strong>Usuário logado:</Text>
            <Text>Email: {user.email}</Text>
            <Text>ID: {user.id}</Text>
          </Space>
        ) : (
          <Text>Usuário não logado</Text>
        )}
      </Card>

      {/* Events List */}
      <Card title="Eventos" style={{ marginBottom: '20px' }}>
        {eventsLoading ? (
          <Text>Carregando eventos...</Text>
        ) : (
          <List
            dataSource={events}
            renderItem={(event) => (
              <List.Item>
                <List.Item.Meta
                  title={event.name}
                  description={
                    <Space direction="vertical" size="small">
                      <Text>Local: {event.location}</Text>
                      <Text>Data: {new Date(event.datetime).toLocaleString('pt-BR')}</Text>
                      <Text>Convidados: {event.guests}</Text>
                      {event.image_url && (
                        <img 
                          src={event.image_url} 
                          alt={event.name}
                          style={{ maxWidth: '200px', height: 'auto' }}
                        />
                      )}
                    </Space>
                  }
                />
              </List.Item>
            )}
            locale={{ emptyText: 'Nenhum evento encontrado' }}
          />
        )}
        <Button 
          onClick={fetchEvents} 
          style={{ marginTop: '10px' }}
        >
          Atualizar Lista
        </Button>
      </Card>

      {/* Create Event Form */}
      {user && (
        <Card title="Criar Novo Evento">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateEvent}
          >
            <Form.Item
              name="name"
              label="Nome do Evento"
              rules={[{ required: true, message: 'Nome é obrigatório' }]}
            >
              <Input placeholder="Digite o nome do evento" />
            </Form.Item>

            <Form.Item
              name="location"
              label="Local"
              rules={[{ required: true, message: 'Local é obrigatório' }]}
            >
              <Input placeholder="Digite o local do evento" />
            </Form.Item>

            <Form.Item
              name="guests"
              label="Convidados"
              rules={[{ required: true, message: 'Convidados é obrigatório' }]}
            >
              <Input placeholder="Digite os convidados" />
            </Form.Item>

            <Form.Item
              name="datetime"
              label="Data e Hora"
              rules={[{ required: true, message: 'Data é obrigatória' }]}
            >
              <Input type="datetime-local" />
            </Form.Item>

            <Form.Item name="link" label="Link (opcional)">
              <Input placeholder="Link adicional" />
            </Form.Item>

            <Form.Item name="pix_key" label="Chave PIX (opcional)">
              <Input placeholder="Chave PIX para pagamentos" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                Criar Evento
              </Button>
            </Form.Item>
          </Form>

          {/* Image Upload Example */}
          <div style={{ marginTop: '20px' }}>
            <Title level={4}>Upload de Imagem (Exemplo)</Title>
            <Upload
              beforeUpload={(file) => {
                // Simulate upload with a dummy event ID
                handleImageUpload(file, 'example-event-id');
                return false; // Prevent default upload
              }}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />} loading={uploading}>
                {uploading ? 'Enviando...' : 'Upload Imagem'}
              </Button>
            </Upload>
          </div>
        </Card>
      )}
    </div>
  );
}
