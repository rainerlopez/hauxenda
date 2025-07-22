# Integração Supabase - Hauxenda

## Configuração Realizada

### 1. Dependências Instaladas
- `@supabase/supabase-js` - Cliente oficial do Supabase

### 2. Estrutura de Arquivos Criada

```
src/
├── lib/
│   └── supabase.ts              # Cliente Supabase configurado
├── types/
│   └── supabase.ts              # Tipos TypeScript do banco
├── hooks/
│   └── useSupabase.ts           # Hooks React personalizados
├── contexts/
│   └── SupabaseContext.tsx      # Context Provider global
├── services/
│   └── storage.ts               # Serviço para upload de arquivos
└── components/
    └── SupabaseExample.tsx      # Componente de exemplo
```

### 3. Configuração de Ambiente

#### Desenvolvimento Local
1. Copie `.env.example` para `.env.local`
2. Configure suas credenciais do Supabase:
```env
VITE_SUPABASE_URL=https://qpywcetodekuwvmtvuzi.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-aqui
```

#### Produção (Vercel)
Configure as variáveis de ambiente no dashboard do Vercel:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Como Usar

### 1. Contexto Global
O `SupabaseProvider` está configurado no `main.tsx` e fornece acesso global aos dados:

```tsx
import { useSupabaseContext } from './contexts/SupabaseContext';

function MeuComponente() {
  const { user, events, createEvent } = useSupabaseContext();
  // Use os dados e métodos aqui
}
```

### 2. Hooks Individuais
Você também pode usar hooks específicos:

```tsx
import { useSupabaseAuth, useEvents } from './hooks/useSupabase';

function MeuComponente() {
  const { user, session } = useSupabaseAuth();
  const { events, createEvent } = useEvents();
}
```

### 3. Cliente Supabase Direto
Para operações customizadas:

```tsx
import { supabase } from './lib/supabase';

// Exemplo de consulta customizada
const { data, error } = await supabase
  .from('events')
  .select('*')
  .eq('admin_id', userId);
```

### 4. Upload de Arquivos
Use o serviço de storage:

```tsx
import { StorageService } from './services/storage';

const { data, error } = await StorageService.uploadEventImage(eventId, file);
```

## Funcionalidades Implementadas

### ✅ Autenticação
- Hook `useSupabaseAuth()` para gerenciar estado de login
- Detecção automática de mudanças de sessão
- Helpers para login/logout

### ✅ Eventos (CRUD)
- Listar todos os eventos
- Criar novo evento
- Atualizar evento existente
- Deletar evento
- Tipagem completa com TypeScript

### ✅ Participantes
- Gerenciar attendees
- Criar opt-ins para eventos
- Relacionamento N:N entre eventos e participantes

### ✅ Storage
- Upload de imagens para eventos
- Geração de URLs públicas
- Gerenciamento de arquivos no bucket `event-images`

### ✅ TypeScript
- Tipos completos baseados no schema do banco
- Intellisense e type safety
- Tipos para Insert, Update e Select

## Exemplo de Uso

Visite `/supabase` no navegador para ver um exemplo completo funcionando.

## Próximos Passos

1. Configure as credenciais do Supabase no `.env.local`
2. Crie o bucket `event-images` no Supabase Storage
3. Configure as políticas de segurança (RLS) no Supabase
4. Implemente as páginas específicas do projeto usando os hooks criados

## Segurança

- ✅ Credenciais não são commitadas no Git
- ✅ Uso de variáveis de ambiente
- ✅ Cliente configurado com auto-refresh de tokens
- ⚠️  Configure Row Level Security (RLS) no Supabase para produção
