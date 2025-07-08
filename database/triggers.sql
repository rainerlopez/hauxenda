-- Função para atualizar o timestamp de updated_at
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar o trigger para cada tabela
CREATE TRIGGER update_events_timestamp
BEFORE UPDATE ON events
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_attendees_timestamp
BEFORE UPDATE ON attendees
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_event_optins_timestamp
BEFORE UPDATE ON event_optins
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();