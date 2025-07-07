<script lang="ts">
	import Button from '@smui/button';
	import Card, { Content, Actions } from '@smui/card';
	import { Icon } from '@smui/common';
</script>

<svelte:head>
	<title>Hauxenda - Gestão de Eventos e Participantes</title>
	<meta name="description" content="PWA simples para gerenciar cerimônias e participantes por Rainer E. Lopez" />
</svelte:head>

<div class="container mx-auto p-4 max-w-4xl">
	<div class="text-center mb-8">
		<h1 class="text-4xl font-bold text-gray-800 mb-4">🎉 Hauxenda</h1>
		<p class="text-xl text-gray-600 mb-6">
			Uma PWA simples para gerenciar cerimônias e participantes
		</p>
		<p class="text-sm text-gray-500">por Rainer E. Lopez</p>
	</div>

	<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
		<Card>
			<Content class="p-6 text-center">
				<Icon class="material-icons text-4xl text-blue-500 mb-4">event</Icon>
				<h3 class="text-lg font-semibold mb-2">Gestão de Eventos</h3>
				<p class="text-gray-600 text-sm">
					Crie e gerencie seus eventos com facilidade
				</p>
			</Content>
		</Card>

		<Card>
			<Content class="p-6 text-center">
				<Icon class="material-icons text-4xl text-green-500 mb-4">people</Icon>
				<h3 class="text-lg font-semibold mb-2">Controle de Participantes</h3>
				<p class="text-gray-600 text-sm">
					Gerencie inscrições e acompanhe participantes
				</p>
			</Content>
		</Card>

		<Card>
			<Content class="p-6 text-center">
				<Icon class="material-icons text-4xl text-purple-500 mb-4">payment</Icon>
				<h3 class="text-lg font-semibold mb-2">Pagamentos PIX</h3>
				<p class="text-gray-600 text-sm">
					Integração com PIX para pagamentos
				</p>
			</Content>
		</Card>
	</div>

	<div class="text-center">
		<Card>
			<Content class="p-6">
				<h2 class="text-2xl font-semibold mb-4">🚀 Status do Projeto</h2>
				<div class="space-y-2 text-left max-w-md mx-auto">
					<div class="flex items-center gap-2">
						<span class="text-green-500">✅</span>
						<span class="text-sm">SvelteKit + TypeScript</span>
					</div>
					<div class="flex items-center gap-2">
						<span class="text-green-500">✅</span>
						<span class="text-sm">Tailwind CSS v4</span>
					</div>
					<div class="flex items-center gap-2">
						<span class="text-green-500">✅</span>
						<span class="text-sm">SMUI (Svelte Material UI)</span>
					</div>
					<div class="flex items-center gap-2">
						<span class="text-green-500">✅</span>
						<span class="text-sm">Supabase Client</span>
					</div>
					<div class="flex items-center gap-2">
						<span class="text-blue-500">🔄</span>
						<span class="text-sm">Ready for deployment</span>
					</div>
				</div>
			</Content>
			<Actions>
				<Button href="/test-supabase" variant="raised">
					🧪 Test Supabase Connection
				</Button>
			</Actions>
		</Card>
	</div>
</div>
