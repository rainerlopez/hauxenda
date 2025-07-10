<script lang="ts">
	// Não precisamos importar componentes específicos do Skeleton UI
	// Usaremos as classes utilitárias diretamente
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
		<div class="card p-4">
			<div class="p-6 text-center">
				<span class="material-icons text-4xl text-blue-600 mb-4">event</span>
				<h3 class="text-2xl font-semibold mb-2">Gestão de Eventos</h3>
				<p class="text-sm">
					Crie e gerencie seus eventos com facilidade
				</p>
			</div>
		</div>

		<div class="card p-4">
			<div class="p-6 text-center">
				<span class="material-icons text-4xl text-purple-600 mb-4">people</span>
				<h3 class="text-2xl font-semibold mb-2">Controle de Participantes</h3>
				<p class="text-sm">
					Gerencie inscrições e acompanhe participantes
				</p>
			</div>
		</div>

		<div class="card p-4">
			<div class="p-6 text-center">
				<span class="material-icons text-4xl text-pink-600 mb-4">payment</span>
				<h3 class="text-2xl font-semibold mb-2">Pagamentos PIX</h3>
				<p class="text-sm">
					Integração com PIX para pagamentos
				</p>
			</div>
		</div>
	</div>

	<div class="text-center">
		<div class="card p-4">
			<div class="p-6">
				<h2 class="text-3xl font-bold mb-4">🚀 Status do Projeto</h2>
				<div class="space-y-2 text-left max-w-md mx-auto">
					<div class="flex items-center gap-2">
						<span class="text-green-600">✅</span>
						<span class="text-sm">SvelteKit + TypeScript</span>
					</div>
					<div class="flex items-center gap-2">
						<span class="text-green-600">✅</span>
						<span class="text-sm">Tailwind CSS v4</span>
					</div>
					<div class="flex items-center gap-2">
						<span class="text-green-600">✅</span>
						<span class="text-sm">Skeleton UI</span>
					</div>
					<div class="flex items-center gap-2">
						<span class="text-green-600">✅</span>
						<span class="text-sm">Supabase Client</span>
					</div>
					<div class="flex items-center gap-2">
						<span class="text-blue-600">🔄</span>
						<span class="text-sm">Ready for deployment</span>
					</div>
				</div>
				<div class="mt-6">
					<a href="/test-supabase" class="inline-block bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
						🧪 Test Supabase Connection
					</a>
				</div>
			</div>
		</div>
	</div>
</div>
