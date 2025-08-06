import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Space, Button, Typography, Card, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { supabase } from '../lib/supabase';
import type { Event } from '../types/supabase';
import './EventListPage.css';

const { Title } = Typography;

const EventListPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetchEvents();
    // Inscreve para atualizações em tempo real
    const subscription = supabase
      .channel('public:events')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'events' },
        () => {
          fetchEvents();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('datetime', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      message.error('Erro ao carregar as cerimônias: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (eventId: string) => {
    navigate(`/edit-event/${eventId}`);
  };

  const handleDelete = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;
      message.success('Cerimônia excluída com sucesso');
      fetchEvents();
    } catch (error: any) {
      message.error('Erro ao excluir a cerimônia: ' + error.message);
    }
  };

  const columns = [
    {
      title: 'Nome da Cerimônia',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Event, b: Event) => a.name.localeCompare(b.name),
    },
    {
      title: 'Local',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Data/Hora',
      dataIndex: 'datetime',
      key: 'datetime',
      render: (datetime: string) => new Date(datetime).toLocaleString('pt-BR'),
      sorter: (a: Event, b: Event) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: Event) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
          >
            Editar
          </Button>
          <Popconfirm
            title="Excluir cerimônia"
            description="Tem certeza que deseja excluir esta cerimônia?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Excluir
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="event-list-layout">
      <div className="event-list-content">
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/dashboard')}
          className="back-btn"
        >
          Voltar
        </Button>

        <Card className="event-list-card">
          <div className="event-list-header">
            <Title level={2} className="event-list-title">Gerenciar Cerimônias</Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={() => navigate('/create-event')}
              className="create-event-btn"
            >
              Criar Nova Cerimônia
            </Button>
          </div>
          
          <Table
            className="event-list-table"
            columns={columns}
            dataSource={events}
            rowKey="id"
            loading={loading}
            scroll={{ x: true }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total de ${total} cerimônias`,
              responsive: true
            }}
          />
        </Card>
      </div>
    </div>
  );
};

export default EventListPage;
