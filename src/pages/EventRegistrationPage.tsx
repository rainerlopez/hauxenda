import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Button, 
  Card, 
  Typography, 
  Input,
  message,
  Modal,
  Space,
  Divider
} from "antd";
import { 
  HomeOutlined, 
  UserAddOutlined, 
  LoginOutlined,
  CopyOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { supabase } from "../lib/supabase";
import './EventRegistrationPage.css';

const { Title, Text } = Typography;

interface Event {
  id: string;
  name: string;
  location: string;
  datetime: string;
  pix_key: string;
  image_url?: string;
}

const EventRegistrationPage: React.FC = () => {
  const { id: eventId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [cpf, setCpf] = useState('');
  const [cpfExists, setCpfExists] = useState<boolean | null>(null);
  const [checkingCpf, setCheckingCpf] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [eventNotFound, setEventNotFound] = useState(false);

  // Load event data
  useEffect(() => {
    const loadEvent = async () => {
      if (!eventId) {
        setEventNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('events')
          .select('id, name, location, datetime, pix_key, image_url')
          .eq('id', eventId)
          .single();

        if (error || !data) {
          setEventNotFound(true);
        } else {
          setEvent(data);
        }
      } catch (error) {
        console.error('Error loading event:', error);
        setEventNotFound(true);
      } finally {
        setLoading(false);
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

  // Check if CPF exists in database
  const checkCpfExists = async (cpfValue: string) => {
    if (!isValidCpf(cpfValue)) {
      setCpfExists(null);
      return;
    }

    setCheckingCpf(true);
    try {
      const cleanCpf = cpfValue.replace(/\D/g, '');
      const { data, error } = await supabase
        .from('attendees')
        .select('id')
        .eq('cpf', cleanCpf)
        .single();

      setCpfExists(!error && !!data);
    } catch (error) {
      console.error('Error checking CPF:', error);
      setCpfExists(false);
    } finally {
      setCheckingCpf(false);
    }
  };

  // Handle CPF input change
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCpf(e.target.value);
    setCpf(formatted);
    
    // Check CPF when user finishes typing
    if (formatted.length === 14) {
      checkCpfExists(formatted);
    } else {
      setCpfExists(null);
    }
  };

  // Handle registration (opt-in)
  const handleRegister = async () => {
    if (!event || !cpf || !cpfExists) return;

    setRegistering(true);
    try {
      const cleanCpf = cpf.replace(/\D/g, '');
      
      // Get attendee ID
      const { data: attendee, error: attendeeError } = await supabase
        .from('attendees')
        .select('id')
        .eq('cpf', cleanCpf)
        .single();

      if (attendeeError || !attendee) {
        throw new Error('Participante não encontrado');
      }

      // Check if already registered
      const { data: existing } = await supabase
        .from('event_optins')
        .select('*')
        .eq('event_id', event.id)
        .eq('attendee_id', attendee.id)
        .single();

      if (existing) {
        message.warning('Você já está inscrito neste evento!');
        setShowSuccessModal(true);
        return;
      }

      // Register for event
      const { error: optinError } = await supabase
        .from('event_optins')
        .insert([{
          event_id: event.id,
          attendee_id: attendee.id
        }]);

      if (optinError) throw optinError;

      setShowSuccessModal(true);
      message.success('Inscrição realizada com sucesso!');
      
    } catch (error: any) {
      console.error('Error registering:', error);
      message.error(`Erro ao realizar inscrição: ${error.message}`);
    } finally {
      setRegistering(false);
    }
  };

  // Handle go to registration form
  const handleGoToRegistration = () => {
    navigate(`/events/${eventId}/register`, { 
      state: { cpf: cpf.replace(/\D/g, '') } 
    });
  };

  // Handle copy PIX key
  const handleCopyPix = async () => {
    if (event?.pix_key) {
      try {
        await navigator.clipboard.writeText(event.pix_key);
        message.success('Chave PIX copiada!');
      } catch (error) {
        message.error('Erro ao copiar chave PIX');
      }
    }
  };

  // Handle go to home
  const handleGoHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="event-registration-layout">
        <div className="event-registration-content">
          <Card className="event-registration-card">
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Text>Carregando evento...</Text>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (eventNotFound) {
    return (
      <div className="event-registration-layout">
        <div className="event-registration-content">
          <Card className="event-registration-card">
            <div className="event-registration-header">
              <Title className="event-registration-title">Evento não encontrado</Title>
              <Text className="event-registration-subtitle">
                Este link não existe ou o evento foi removido.
              </Text>
            </div>
            
            <Divider />
            
            <div className="event-registration-actions">
              <Button
                type="primary"
                size="large"
                icon={<HomeOutlined />}
                onClick={handleGoHome}
                className="home-btn"
              >
                Ir para Home
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="event-registration-layout">
      <div className="event-registration-content">
        <Card className="event-registration-card">
          <div className="event-registration-header">
            <Title className="event-registration-title">
              Inscrição Cerimônia {event?.name}
            </Title>
            
            {event?.location && (
              <Text className="event-location">
                📍 {event.location}
              </Text>
            )}
            
            {event?.datetime && (
              <Text className="event-datetime">
                🗓️ {new Date(event.datetime).toLocaleString('pt-BR')}
              </Text>
            )}
          </div>

          <Divider />

          <div className="cpf-section">
            <Text className="cpf-label">Digite seu CPF para continuar:</Text>
            
            <Input
              placeholder="000.000.000-00"
              value={cpf}
              onChange={handleCpfChange}
              size="large"
              maxLength={14}
              className="cpf-input"
            />
            
            {checkingCpf && (
              <Text className="cpf-status checking">
                Verificando CPF...
              </Text>
            )}
            
            {cpfExists === true && (
              <Text className="cpf-status found">
                ✅ CPF encontrado! Você pode se inscrever.
              </Text>
            )}
            
            {cpfExists === false && (
              <Text className="cpf-status not-found">
                ❌ CPF não encontrado. Você precisa se cadastrar primeiro.
              </Text>
            )}
          </div>

          <Divider />

          <div className="event-registration-actions">
            {cpfExists === true && (
              <Button
                type="primary"
                size="large"
                icon={<LoginOutlined />}
                onClick={handleRegister}
                loading={registering}
                className="register-btn"
              >
                Inscrever-se
              </Button>
            )}
            
            {cpfExists === false && (
              <Button
                type="primary"
                size="large"
                icon={<UserAddOutlined />}
                onClick={handleGoToRegistration}
                className="signup-btn"
              >
                Cadastrar-se
              </Button>
            )}
          </div>
        </Card>
      </div>

      {/* Success Modal */}
      <Modal
        title={
          <Space>
            <CheckCircleOutlined style={{ color: '#52c41a' }} />
            <span>Você está inscrito!</span>
          </Space>
        }
        open={showSuccessModal}
        onCancel={() => setShowSuccessModal(false)}
        footer={[
          <Button key="close" onClick={() => setShowSuccessModal(false)}>
            Fechar
          </Button>
        ]}
        className="success-modal"
      >
        <div className="modal-content">
          <Text className="modal-text">
            Efetue o pagamento via PIX:
          </Text>
          
          <div className="pix-section">
            <Input
              value={event?.pix_key || ''}
              readOnly
              size="large"
              className="pix-input"
              suffix={
                <Button
                  type="text"
                  icon={<CopyOutlined />}
                  onClick={handleCopyPix}
                  className="copy-btn"
                >
                  Copiar
                </Button>
              }
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EventRegistrationPage;
