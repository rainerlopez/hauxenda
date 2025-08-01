import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Button, 
  Card, 
  Typography, 
  Form, 
  Input, 
  DatePicker, 
  Upload, 
  Space,
  message,
  Divider
} from "antd";
import { 
  ArrowLeftOutlined, 
  SaveOutlined, 
  PlusOutlined, 
  UploadOutlined,
  MinusCircleOutlined 
} from '@ant-design/icons';
import { supabase } from "../lib/supabase";
import './CreateEventPage.css';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface EventFormData {
  name: string;
  datetime: any;
  location: string;
  pix_key: string;
  guests: string[];
  image?: File;
}

const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    return false; // Prevent automatic upload
  };

  const uploadImageToSupabase = async (eventId: string, file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `event-${eventId}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('event-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('event-images')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSubmit = async (values: EventFormData) => {
    setLoading(true);
    
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('Usuário não autenticado');
      }

      // Create event first to get the ID
      const eventData = {
        name: values.name,
        datetime: values.datetime?.toISOString(),
        location: values.location,
        pix_key: values.pix_key,
        guests: values.guests || [],
        admin_id: user.id,
        link: '', // Will be updated after we get the ID
        image_url: null
      };

      const { data: event, error: eventError } = await supabase
        .from('events')
        .insert([eventData])
        .select()
        .single();

      if (eventError) throw eventError;

      // Generate unique link using event ID
      const eventLink = `https://hauxenda.vercel.app/events/${event.id}`;

      // Upload image if provided
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImageToSupabase(event.id, imageFile);
      }

      // Update event with link and image URL
      const { error: updateError } = await supabase
        .from('events')
        .update({ 
          link: eventLink,
          image_url: imageUrl 
        })
        .eq('id', event.id);

      if (updateError) throw updateError;

      message.success('Evento criado com sucesso!');
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error('Error creating event:', error);
      message.error(`Erro ao criar evento: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-layout">
      <div className="create-event-content">
        <Card className="create-event-card">
          <div className="create-event-header">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={handleCancel}
              className="back-btn"
            >
              Voltar
            </Button>
            
            <Title className="create-event-title">Criar Nova Cerimônia</Title>
            
            <Text className="create-event-subtitle">
              Preencha os dados para criar uma nova cerimônia
            </Text>
          </div>

          <Divider />

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="create-event-form"
          >
            <Form.Item
              label="Nome da Cerimônia"
              name="name"
              rules={[{ required: true, message: 'Por favor, insira o nome da cerimônia' }]}
            >
              <Input 
                placeholder="Ex: Cerimônia de Ayahuasca - Lua Cheia"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Data e Hora"
              name="datetime"
              rules={[{ required: true, message: 'Por favor, selecione a data e hora' }]}
            >
              <DatePicker
                showTime
                format="DD/MM/YYYY HH:mm"
                placeholder="Selecione a data e hora"
                size="large"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              label="Local"
              name="location"
              rules={[{ required: true, message: 'Por favor, insira o local' }]}
            >
              <TextArea
                placeholder="Ex: Sítio Sagrado, Rua das Flores, 123 - Cidade/UF"
                rows={3}
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Chave PIX"
              name="pix_key"
              rules={[{ required: true, message: 'Por favor, insira a chave PIX' }]}
            >
              <Input
                placeholder="Ex: exemplo@email.com ou CPF ou telefone"
                size="large"
              />
            </Form.Item>

            <Form.Item label="Convidados">
              <Form.List name="guests">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                        <Form.Item
                          {...restField}
                          name={[name]}
                          rules={[{ required: true, message: 'Nome do convidado é obrigatório' }]}
                          style={{ flex: 1 }}
                        >
                          <Input 
                            placeholder="Nome do convidado" 
                            size="large"
                          />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Space>
                    ))}
                    <Form.Item>
                      <Button 
                        type="dashed" 
                        onClick={() => add()} 
                        block 
                        icon={<PlusOutlined />}
                        size="large"
                      >
                        Adicionar Convidado
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form.Item>

            <Form.Item
              label="Imagem da Cerimônia"
              name="image"
            >
              <Upload
                beforeUpload={handleImageUpload}
                maxCount={1}
                accept="image/*"
                listType="picture-card"
              >
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>

            <Divider />

            <div className="create-event-actions">
              <Button
                size="large"
                onClick={handleCancel}
                className="cancel-btn"
              >
                Cancelar
              </Button>
              
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={loading}
                icon={<SaveOutlined />}
                className="save-btn"
              >
                Salvar Cerimônia
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default CreateEventPage;
