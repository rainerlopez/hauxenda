MASTER PROMPT: PWA de Eventos - Plano de Execução Vibecoding (Versão Final Revisada)

1. DIRETIVA DE MISSÃO
   PARA: Cascade (Modelo AI: Claude 4 Thinking)
   DE: Tech Lead
   ASSUNTO: Execução de protótipo de PWA de Eventos em modo Vibecoding.

Sua Persona: Você é Cascade, um desenvolvedor SvelteKit expert. Seu código é limpo, eficiente e segue as melhores práticas à risca. Você opera com autonomia, seguindo o plano abaixo sem necessidade de diálogo supérfluo. O objetivo é velocidade com qualidade.

Filosofia do Projeto (Vibecoding): Foco total na implementação. Mínima fricção, máxima produtividade. O plano é a fonte única da verdade. Execute os "Tacks" em sequência.

2. ARQUITETURA E STACK TECNOLÓGICA
   A stack é fixa e não deve ser alterada.

Frontend Framework: SvelteKit

Backend (BaaS): Supabase (usando supabase-js v2)

Deployment Target: Vercel

Styling: Tailwind CSS

Component Library (Material Design): Svelte Material UI (SMUI). É a escolha ideal por ser construída nativamente para Svelte, seguir as especificações do Google e ser altamente configurável e acessível.

3. ESQUEMA DO BANCO DE DADOS (Supabase SQL)
   Execute o DDL abaixo no "SQL Editor" do seu projeto Supabase para criar a estrutura de dados.

-- Tabela para armazenar informações dos eventos
CREATE TABLE events (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
name TEXT NOT NULL,
pix_key TEXT,
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela para armazenar informações dos inscritos
CREATE TABLE attendees (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
cpf TEXT UNIQUE NOT NULL,
full_name TEXT NOT NULL,
email TEXT,
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de junção para registrar o opt-in de um inscrito em um evento
CREATE TABLE event_optins (
event_id UUID REFERENCES events(id) ON DELETE CASCADE,
attendee_id UUID REFERENCES attendees(id) ON DELETE CASCADE,
created_at TIMESTAMPTZ DEFAULT NOW(),
PRIMARY KEY (event_id, attendee_id)
);

4. PLANO DE EXECUÇÃO: TACKS
   TACK 0: FUNDAÇÃO E SETUP
   Inicialize o projeto SvelteKit:

npm create svelte@latest pwa-evento-vibecode

# Opções: Skeleton project, TypeScript, ESLint, Prettier, Playwright, Vitest

cd pwa-evento-vibecode

Instale todas as dependências:

npm install @supabase/supabase-js
npm install -D tailwindcss postcss autoprefixer
npm install -D smui-theme
npm install -D @material/typography @material/theme
npm install svelte-material-ui

Configure o Tailwind CSS:

Execute npx tailwindcss init -p.

Atualize tailwind.config.js:

/** @type {import('tailwindcss').Config} \*/
export default {
content: ['./src/**/\*.{html,js,svelte,ts}'],
theme: {
extend: {},
},
plugins: [],
}

Crie src/app.css com as diretivas do Tailwind:

@tailwind base;
@tailwind components;
@tailwind utilities;

Configure o SMUI:

Crie um arquivo de tema em src/theme/\_smui-theme.scss. Deixe-o vazio por enquanto.

Em vite.config.ts, adicione a otimização para SMUI:

import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
plugins: [sveltekit()],
test: {
include: ['src/**/*.{test,spec}.{js,ts}']
},
optimizeDeps: {
include: ['@carbon/charts'] // Exemplo, ajuste conforme necessário
}
});

Setup do Cliente Supabase:

Crie src/lib/supabaseClient.ts:

import { createClient } from '@supabase/supabase-js'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY)

NÃO crie arquivos .env no seu projeto. As variáveis de ambiente (PUBLIC_SUPABASE_URL e PUBLIC_SUPABASE_ANON_KEY) serão configuradas diretamente na interface da Vercel durante o processo de deploy. Isso garante que suas chaves não sejam expostas no repositório Git.

Crie o Layout Principal src/routes/+layout.svelte:

Importe app.css.

A estrutura deve ser um container flex que centraliza o conteúdo.

TACK 1: FLUXO ADMIN - AUTENTICAÇÃO
Crie a Rota de Login: src/routes/admin/login/+page.svelte

Use componentes SMUI: Textfield para email e senha, e Button para o login.

No script, implemente a função handleLogin que chama supabase.auth.signInWithPassword.

Em caso de sucesso, redirecione para /admin/dashboard.

Em caso de erro, mostre uma notificação.

Crie o Layout Protegido: src/routes/admin/+layout.svelte

No script (+layout.ts), verifique se há uma sessão de usuário ativa no Supabase.

Se não houver sessão, redirecione para /admin/login.

O layout deve conter um Appbar (cabeçalho) SMUI com o título "Dashboard Admin" e um botão de logout.

TACK 2: FLUXO ADMIN - DASHBOARD E GESTÃO DE EVENTOS
Crie a Página do Dashboard: src/routes/admin/dashboard/+page.svelte

A página deve conter um botão (FAB - Floating Action Button) SMUI para "Criar Novo Evento".

Abaixo, implemente uma DataTable SMUI para listar os eventos existentes.

As colunas da tabela devem ser: Nome do Evento, Link de Inscrição, Ações.

Implemente a Criação de Eventos:

O botão "Criar" deve abrir um Dialog (modal) SMUI.

O Dialog conterá um formulário com campos (Textfield) para "Nome do Evento" e "Chave Pix".

Ao submeter o formulário, insira os dados na tabela events do Supabase.

Após a inserção, feche o Dialog e atualize a DataTable de eventos.

Implemente a Listagem de Eventos:

Na função load da página (+page.ts), busque todos os registros da tabela events.

Para cada evento na DataTable, a coluna "Link de Inscrição" deve exibir a URL completa: [SUA_URL_VERCEL]/evento/[event_id].

A coluna "Ações" deve conter um botão "Compartilhar" que gera o link whatsapp://send?text=... com os dados do evento e o link de inscrição, devidamente encodado.

TACK 3: FLUXO USUÁRIO - IDENTIFICAÇÃO E CADASTRO
Crie a Rota Pública do Evento: src/routes/evento/[id]/+page.svelte

Na função load (+page.ts), use o id da URL para buscar os detalhes do evento específico na tabela events. Se não encontrar, retorne um erro 404.

A página deve exibir o nome do evento.

Abaixo, apresente um Card SMUI com um formulário de identificação contendo um campo (Textfield) para CPF.

Implemente a Lógica de Identificação:

Ao submeter o CPF, faça uma busca na tabela attendees.

Cenário 1 (CPF encontrado): Prossiga para o TACK 4 (Opt-in), guardando os dados do usuário.

Cenário 2 (CPF não encontrado): Oculte o formulário de CPF e exiba um formulário de cadastro simples dentro do mesmo Card.

Implemente o Formulário de Cadastro:

Campos (Textfield): Nome Completo, Email. O CPF já foi preenchido.

Ao submeter, insira o novo usuário na tabela attendees.

Após o sucesso, prossiga para o TACK 4 (Opt-in).

TACK 4: FLUXO USUÁRIO - OPT-IN E SUCESSO
Crie a Tela de Opt-in:

Esta pode ser uma nova seção que aparece dinamicamente na mesma página evento/[id].

Mostre um resumo: "Olá, [Nome do Usuário], você confirma sua inscrição no evento [Nome do Evento]?"

Apresente um Button SMUI com o texto "Sim, Confirmar Presença".

Implemente a Lógica de Opt-in:

Ao clicar no botão, insira um novo registro na tabela de junção event_optins, associando o attendee_id ao event_id.

Verifique se a inserção foi bem-sucedida.

Crie a Tela de Sucesso:

Redirecione o usuário para uma nova rota /sucesso/[id].

Na função load desta página, busque novamente os dados do evento, principalmente a pix_key.

Exiba uma mensagem de sucesso clara: "Inscrição confirmada!".

Apresente a chave PIX e um Button SMUI que, ao ser clicado, copia a chave para a área de transferência do usuário.

5. DIRETIVA DE EXPERIÊNCIA: Mobile-First e PWA
   Esta diretiva é tão importante quanto a stack tecnológica e deve guiar todo o desenvolvimento da UI e da estrutura da aplicação.

5.1. Filosofia Mobile-First
Princípio fundamental: Toda a estilização e layout devem ser criados com a abordagem Mobile-First.

Execução com Tailwind CSS: Os estilos padrão (sem prefixos) devem ser aplicados à experiência mobile. Use os prefixos responsivos do Tailwind (md:, lg:, xl:) para aprimorar a experiência em telas maiores, e não para "consertá-la".

Layouts Fluidos: Priorize o uso de Flexbox e CSS Grid para criar layouts que se adaptem naturalmente a qualquer tamanho de tela. Evite larguras fixas a todo custo.

Áreas de Toque: Garanta que todos os botões e elementos interativos tenham áreas de toque generosas, conforme as diretrizes de acessibilidade mobile.

5.2. Implementação do Progressive Web App (PWA)
O projeto deve ser um PWA completo para garantir confiabilidade e uma experiência similar à de um app nativo.

Instale a dependência PWA para Vite/SvelteKit:

npm install -D @vite-pwa/sveltekit

Configure o PWA em vite.config.ts:

Atualize o arquivo vite.config.ts para incluir e configurar o plugin @vite-pwa/sveltekit.

import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vitest/config';

export default defineConfig({
plugins: [
sveltekit(),
SvelteKitPWA({
registerType: 'autoUpdate',
manifest: {
name: 'PWA Eventos Vibecode',
short_name: 'VibeEventos',
description: 'Gerenciador de inscrições para eventos.',
theme_color: '#ffffff',
icons: [
{
src: 'pwa-192x192.png',
sizes: '192x192',
type: 'image/png'
},
{
src: 'pwa-512x512.png',
sizes: '512x512',
type: 'image/png'
},
{
src: 'pwa-512x512.png',
sizes: '512x512',
type: 'image/png',
purpose: 'any maskable'
}
]
}
})
],
test: {
include: ['src/**/*.{test,spec}.{js,ts}']
}
});

Crie os Ícones:

Adicione os arquivos de ícone pwa-192x192.png e pwa-512x512.png ao diretório static do seu projeto. Utilize placeholders se necessário durante o desenvolvimento.

Estratégia do Service Worker:

O plugin @vite-pwa/sveltekit com registerType: 'autoUpdate' gerenciará o Service Worker automaticamente, utilizando uma estratégia de cache stale-while-revalidate para os assets, o que é ideal para este projeto. Não é necessária configuração manual do Service Worker.

FIM DA DIRETIVA MESTRA.
