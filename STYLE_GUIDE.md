# 🌿 Guia de Estilo Hauxenda
## Design System para Comunidade Xamânica e Espiritual

---

## 🎨 **Filosofia de Design**

O Hauxenda foi criado para conectar pessoas em jornadas espirituais através de eventos e cerimônias sagradas. Nosso design reflete os valores de **conexão com a natureza**, **espiritualidade** e **comunidade**.

### Princípios Fundamentais
- **🌱 Orgânico**: Formas suaves, inspiradas na natureza
- **🕯️ Contemplativo**: Espaços que convidam à reflexão
- **🤝 Acolhedor**: Interface que abraça e acolhe
- **⚡ Intuitivo**: Navegação natural e fluida

---

## 🎯 **Paleta de Cores**

### Cores Primárias - Verde Sagrado
```css
--primary-50: #f0f9f0   /* Verde muito claro */
--primary-500: #3d8b3d  /* Verde sagrado principal */
--primary-900: #1a3a1a  /* Verde escuro profundo */
```

### Cores Secundárias - Terracota Sagrado
```css
--secondary-50: #faf7f0  /* Bege muito claro */
--secondary-500: #b8875a /* Terracota sagrado */
--secondary-900: #5e3e2e /* Marrom escuro */
```

### Cores de Apoio - Tons Místicos
```css
--accent-purple: #6b46c1  /* Violeta espiritual */
--accent-indigo: #4338ca  /* Índigo místico */
--accent-teal: #0d9488    /* Verde água */
--accent-amber: #d97706   /* Âmbar dourado */
```

### Neutros - Pedras e Cristais
```css
--neutral-50: #fafaf9    /* Cristal claro */
--neutral-500: #78716c   /* Pedra média */
--neutral-900: #1c1917   /* Obsidiana */
```

---

## ✍️ **Tipografia**

### Família de Fontes
```css
font-family: "Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

### Hierarquia Tipográfica
- **H1**: 38px - Títulos principais de página
- **H2**: 30px - Seções importantes
- **H3**: 24px - Subtítulos
- **H4**: 20px - Títulos de cards
- **H5**: 16px - Labels e pequenos títulos
- **Body**: 14px - Texto padrão
- **Small**: 12px - Textos auxiliares

### Altura de Linha
- **Títulos**: 1.2 - 1.4 (mais compacto)
- **Corpo**: 1.57 (mais legível)

---

## 📐 **Espaçamentos**

### Sistema de Espaçamento (8pt Grid)
```typescript
spacing: {
  xs: 8px,   // Espaçamentos mínimos
  sm: 12px,  // Espaçamentos pequenos
  md: 16px,  // Espaçamento padrão
  lg: 24px,  // Espaçamentos grandes
  xl: 32px,  // Espaçamentos muito grandes
  xxl: 48px, // Espaçamentos máximos
}
```

### Aplicação
- **Margens entre seções**: 32px (xl)
- **Padding de cards**: 24px (lg)
- **Espaçamento entre elementos**: 16px (md)
- **Espaçamento interno de botões**: 12px (sm)

---

## 🔘 **Componentes**

### Botões
```typescript
// Botão Primário - Ações principais
<Button type="primary" size="large">
  Criar Evento
</Button>

// Botão Secundário - Ações secundárias
<Button type="default" size="large">
  Cancelar
</Button>

// Botão de Perigo - Ações destrutivas
<Button type="primary" danger size="large">
  Excluir
</Button>
```

**Especificações:**
- Altura: 40px
- Padding horizontal: 24px
- Border radius: 8px
- Font weight: 500

### Cards
```typescript
<Card 
  style={{ 
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)' 
  }}
>
  Conteúdo do card
</Card>
```

**Especificações:**
- Border radius: 12px
- Padding: 24px
- Sombra sutil para elevação

### Inputs
```typescript
<Input 
  size="large"
  placeholder="Digite aqui..."
  style={{ borderRadius: '8px' }}
/>
```

**Especificações:**
- Altura: 40px
- Border radius: 8px
- Padding horizontal: 16px

---

## 🌓 **Temas**

### Tema Claro (Cerimônias Diurnas)
- Fundo principal: Branco puro (#ffffff)
- Fundo de container: Cristal claro (#fafaf9)
- Texto principal: Obsidiana (#292524)

### Tema Escuro (Cerimônias Noturnas)
- Fundo principal: Obsidiana (#1c1917)
- Fundo de container: Pedra escura (#292524)
- Texto principal: Cristal claro (#f5f5f4)

---

## 🎭 **Estados e Interações**

### Transições
```css
transition: all 0.2s ease-in-out;
```

### Estados de Hover
- **Botões**: Escurecer 10% da cor base
- **Cards**: Elevar sombra suavemente
- **Links**: Mudar para cor primária

### Estados de Foco
- **Inputs**: Border azul índigo (#4338ca)
- **Botões**: Outline sutil na cor primária

---

## 📱 **Responsividade**

### Breakpoints
```css
/* Mobile First */
@media (min-width: 576px) { /* SM */ }
@media (min-width: 768px) { /* MD */ }
@media (min-width: 992px) { /* LG */ }
@media (min-width: 1200px) { /* XL */ }
```

### Adaptações Mobile
- Padding reduzido em 25%
- Botões com altura mínima de 44px (touch target)
- Texto ligeiramente maior para legibilidade

---

## 🛠️ **Implementação**

### 1. Instalar Dependências
```bash
npm install antd @ant-design/icons
```

### 2. Configurar Tema
```typescript
import { ThemeProvider } from './components/ThemeProvider';
import { hauxendaTheme } from './theme';

// No main.tsx
<ThemeProvider>
  <App />
</ThemeProvider>
```

### 3. Usar Componentes
```typescript
import { Button, Card, Input } from 'antd';
import { colors, designTokens } from './theme';

// Usar tokens de design
const customStyle = {
  padding: designTokens.spacing.lg,
  borderRadius: designTokens.borderRadius.lg,
  boxShadow: designTokens.shadows.md,
};
```

---

## 🎨 **Exemplos de Uso**

### Card de Evento
```typescript
<Card
  cover={<img src={evento.banner} alt={evento.nome} />}
  actions={[
    <Button type="primary">Ver Detalhes</Button>,
    <Button type="default">Compartilhar</Button>
  ]}
>
  <Card.Meta
    title={evento.nome}
    description={evento.descricao}
  />
  <div style={{ marginTop: designTokens.spacing.md }}>
    <Text type="secondary">{evento.data}</Text>
  </div>
</Card>
```

### Formulário de Cadastro
```typescript
<Form layout="vertical" size="large">
  <Form.Item label="Nome do Evento" required>
    <Input placeholder="Digite o nome do evento" />
  </Form.Item>
  
  <Form.Item label="Data e Hora" required>
    <DatePicker.RangePicker style={{ width: '100%' }} />
  </Form.Item>
  
  <Form.Item>
    <Button type="primary" htmlType="submit" block>
      Criar Evento
    </Button>
  </Form.Item>
</Form>
```

---

## 🔍 **Checklist de Qualidade**

### ✅ Acessibilidade
- [ ] Contraste mínimo 4.5:1 para texto
- [ ] Foco visível em todos os elementos interativos
- [ ] Textos alternativos em imagens
- [ ] Navegação por teclado funcionando

### ✅ Performance
- [ ] Imagens otimizadas (WebP quando possível)
- [ ] Lazy loading em listas longas
- [ ] Transições suaves (< 300ms)
- [ ] Bundle size otimizado

### ✅ Usabilidade
- [ ] Touch targets mínimo 44px em mobile
- [ ] Feedback visual em todas as ações
- [ ] Estados de loading claros
- [ ] Mensagens de erro compreensíveis

---

## 🌟 **Inspirações**

### Referências Visuais
- **Natureza**: Tons terrosos, texturas orgânicas
- **Espiritualidade**: Geometria sagrada, símbolos ancestrais
- **Modernidade**: Clean design, tipografia clara
- **Comunidade**: Warmth, acolhimento, conexão

### Mood Board
- Folhas verdes com orvalho
- Cristais e pedras naturais
- Fogueiras e velas
- Círculos de pessoas em conexão
- Mandalas e padrões sagrados

---

*"Design é a alma de uma criação humana que se expressa através das sucessivas camadas da superfície do produto ou serviço."* - Steve Jobs

**Criado com 💚 para a comunidade Hauxenda**
