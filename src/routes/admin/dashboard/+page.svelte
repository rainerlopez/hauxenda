<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';

	let user = $page.data.user;
	let events: any[] = [];
	let loading = true;
	let error: string | null = null;

	onMount(async () => {
		await fetchEvents();
	});

	async function fetchEvents() {
		loading = true;
		error = null;

		try {
			// Buscar eventos do usuário logado
			const { data, error: fetchError } = await supabase
				.from('events')
				.select('*')
				.eq('admin_id', user.id)
				.order('created_at', { ascending: false });

			if (fetchError) {
				throw fetchError;
			}

			events = data || [];
		} catch (err: any) {
			console.error('Erro ao buscar eventos:', err);
			error = 'Não foi possível carregar os eventos. Por favor, tente novamente.';
		} finally {
			loading = false;
		}
	}

	function formatDate(dateString: string | null): string {
		if (!dateString) return '-';
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('pt-BR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(date);
	}
</script>

<svelte:head>
	<title>Dashboard Admin - Hauxenda</title>
</svelte:head>

<div class="container mx-auto px-4 py-6">
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-3xl font-bold">Dashboard Admin</h1>
		<a href="/admin/events/new" class="inline-flex items-center gap-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
			<span class="material-symbols-outlined">add</span>
			Novo Evento
		</a>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
		<!-- Card de Boas-vindas -->
		<div class="card p-6 col-span-1 md:col-span-3">
			<h2 class="text-2xl font-semibold mb-2">Bem-vindo, {user?.user_metadata?.name || user?.email}!</h2>
			<p class="opacity-75">
				Este é o seu painel de controle para gerenciar eventos do Hauxenda. Aqui você pode criar, editar e
				monitorar seus eventos.
			</p>
		</div>

		<!-- Card de Estatísticas -->
		<div class="card p-6">
			<h3 class="text-lg font-semibold mb-2">Total de Eventos</h3>
			<p class="text-3xl font-bold">{events.length}</p>
		</div>

		<!-- Card de Participantes -->
		<div class="card p-6">
			<h3 class="text-lg font-semibold mb-2">Participantes</h3>
			<p class="text-3xl font-bold">-</p>
			<p class="text-sm opacity-50">Em breve</p>
		</div>

		<!-- Card de Opt-ins -->
		<div class="card p-6">
			<h3 class="text-lg font-semibold mb-2">Opt-ins</h3>
			<p class="text-3xl font-bold">-</p>
			<p class="text-sm opacity-50">Em breve</p>
		</div>
	</div>

	<!-- Lista de Eventos -->
	<div class="card p-6">
		<h2 class="text-2xl font-semibold mb-4">Seus Eventos</h2>

		{#if loading}
			<div class="py-4">
				<div class="flex justify-center">
					<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				</div>
			</div>
		{:else if error}
			<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
				{error}
			</div>
			<button on:click={fetchEvents} class="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-300 transition-colors">Tentar Novamente</button>
		{:else if events.length === 0}
			<div class="text-center py-8">
				<p class="opacity-75 mb-4">Você ainda não tem eventos cadastrados.</p>
				<a href="/admin/events/new" class="inline-block bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">Criar Primeiro Evento</a>
			</div>
		{:else}
			<div class="table-container">
				<table class="table table-hover">
					<thead>
						<tr>
							<th>Título</th>
							<th>Data</th>
							<th>Local</th>
							<th>Convidados</th>
							<th>Ações</th>
						</tr>
					</thead>
					<tbody>
						{#each events as event (event.id)}
							<tr>
								<td>{event.name}</td>
								<td>{formatDate(event.datetime)}</td>
								<td>{event.location || '-'}</td>
								<td>{event.guests || '-'}</td>
								<td>
									<div class="flex space-x-2">
										<a href={`/admin/events/${event.id}`} class="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors">
										<span class="material-symbols-outlined text-sm">visibility</span>
									</a>
									<a href={`/admin/events/${event.id}/edit`} class="inline-flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded hover:bg-purple-200 transition-colors">
										<span class="material-symbols-outlined text-sm">edit</span>
									</a>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>
