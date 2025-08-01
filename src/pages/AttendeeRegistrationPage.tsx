import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Button, 
  Card, 
  Typography, 
  Form, 
  Input,
  message,
  Divider
} from "antd";
import { 
  ArrowLeftOutlined, 
  SaveOutlined
} from '@ant-design/icons';
import { supabase } from "../lib/supabase";
import './AttendeeRegistrationPage.css';

const { Title, Text } = Typography;

interface AttendeeFormData {
  cpf: string;
  full_name: string;
  email?: string;
}

interface Event {
  id: string;
  name: string;
}

const AttendeeRegistrationPage: React.FC = () => {
  const { id: eventId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialCpf, setInitialCpf] = useState('');

  // Get initial CPF from navigation state
  useEffect(() => {
    if (location.state?.cpf) {
      const cpf = location.state.cpf;
      setInitialCpf(cpf);
      form.setFieldsValue({ cpf: formatCpf(cpf) });
    }
  }, [location.state, form]);

  // Load event data
  useEffect(() => {
    const loadEvent = async () => {
      if (!eventId) return;

      try {
        const { data, error } = await supabase
          .from('events')
          .select('id, name')
          .eq('id', eventId)
          .single();

        if (!error && data) {
          setEvent(data);
        }
      } catch (error) {
        console.error('Error loading event:', error);
      }
    };

    loadEvent();
  }, [eventId]);

  // Format CPF input
  const formatCpf = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  // Validate CPF format
  const isValidCpf = (cpf: string) => {
    const numbers = cpf.replace(/\D/g, '');
    return numbers.length === 11;
  };

  // Handle form submission
  const handleSubmit = async (values: AttendeeFormData) => {
    setLoading(true);
    
    try {
      const cleanCpf = values.cpf.replace(/\D/g, '');
      
      // Validate CPF format
      if (!isValidCpf(values.cpf)) {
        message.error('CPF deve ter 11 dígitos');
        return;
      }

      // Check if CPF already exists
      const { data: existing } = await supabase
        .from('attendees')
        .select('id')
        .eq('cpf', cleanCpf)
        .single();

      if (existing) {
        message.error('Este CPF já está cadastrado');
        return;
      }

      // Create new attendee
      const attendeeData = {
        cpf: cleanCpf,
        full_name: values.full_name.trim(),
        email: values.email?.trim() || null
      };

      const { error } = await supabase
        .from('attendees')
        .insert([attendeeData]);

      if (error) throw error;

      message.success('Cadastro realizado com sucesso!');
      
      // Navigate back to registration page with CPF filled
      navigate(`/events/${eventId}`, { 
        state: { 
          cpf: cleanCpf,
          justRegistered: true 
        } 
      });
      
    } catch (error: any) {
      console.error('Error creating attendee:', error);
      message.error(`Erro ao criar cadastro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate(`/events/${eventId}`);
  };

  // Handle CPF input change with formatting
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCpf(e.target.value);
    form.setFieldsValue({ cpf: formatted });
  };

  return (
    <div className="attendee-registration-layout">
      <div className="attendee-registration-content">
        <Card className="attendee-registration-card">
          <div className="attendee-registration-header">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={handleCancel}
              className="back-btn"
            >
              Voltar
            </Button>
            
            <Title className="attendee-registration-title">
              Cadastro de Participante
            </Title>
            
            {event && (
              <Text className="attendee-registration-subtitle">
                Para participar da cerimônia: {event.name}
              </Text>
            )}
          </div>

          <Divider />

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="attendee-registration-form"
            initialValues={{ cpf: formatCpf(initialCpf) }}
          >
            <Form.Item
              label="CPF"
              name="cpf"
              rules={[
                { required: true, message: 'Por favor, insira seu CPF' },
                {
                  validator: (_, value) => {
                    if (!value || isValidCpf(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('CPF deve ter 11 dígitos'));
                  }
                }
              ]}
            >
              <Input 
                placeholder="000.000.000-00"
                size="large"
                maxLength={14}
                onChange={handleCpfChange}
              />
            </Form.Item>

            <Form.Item
              label="Nome Completo"
              name="full_name"
              rules={[
                { required: true, message: 'Por favor, insira seu nome completo' },
                { min: 3, message: 'Nome deve ter pelo menos 3 caracteres' }
              ]}
            >
              <Input 
                placeholder="Seu nome completo"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="E-mail (opcional)"
              name="email"
              rules={[
                { type: 'email', message: 'Por favor, insira um e-mail válido' }
              ]}
            >
              <Input 
                placeholder="seu@email.com"
                size="large"
                type="email"
              />
            </Form.Item>

            <Divider />

            <div className="attendee-registration-actions">
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
                Cadastrar
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default AttendeeRegistrationPage;
