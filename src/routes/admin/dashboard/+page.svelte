<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import { Card, Button, LinearProgress, Icon, IconButton } from 'noph-ui';

	let user = $page.data.user;
	let events = [];
	let loading = true;
	let error = null;

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
		} catch (err) {
			console.error('Erro ao buscar eventos:', err);
			error = 'Não foi possível carregar os eventos. Por favor, tente novamente.';
		} finally {
			loading = false;
		}
	}

	function formatDate(dateString) {
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
		<h1 class="text-2xl font-bold">Dashboard Admin</h1>
		<Button href="/admin/events/new" variant="filled">
			{#snippet start()}
				<Icon>add</Icon>
			{/snippet}
			Novo Evento
		</Button>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
		<!-- Card de Boas-vindas -->
		<Card variant="outlined" class="col-span-1 md:col-span-3 p-6">
			<h2 class="text-xl font-semibold mb-2">Bem-vindo, {user?.user_metadata?.name || user?.email}!</h2>
			<p class="text-gray-600">
				Este é o seu painel de controle para gerenciar eventos do Hauxenda. Aqui você pode criar, editar e
				monitorar seus eventos.
			</p>
		</Card>

		<!-- Card de Estatísticas -->
		<Card variant="outlined" class="p-6">
			<h3 class="text-lg font-semibold mb-2">Total de Eventos</h3>
			<p class="text-3xl font-bold">{events.length}</p>
		</Card>

		<!-- Card de Participantes -->
		<Card variant="outlined" class="p-6">
			<h3 class="text-lg font-semibold mb-2">Participantes</h3>
			<p class="text-3xl font-bold">-</p>
			<p class="text-sm text-gray-500">Em breve</p>
		</Card>

		<!-- Card de Opt-ins -->
		<Card variant="outlined" class="p-6">
			<h3 class="text-lg font-semibold mb-2">Opt-ins</h3>
			<p class="text-3xl font-bold">-</p>
			<p class="text-sm text-gray-500">Em breve</p>
		</Card>
	</div>

	<!-- Lista de Eventos -->
	<Card variant="outlined" class="p-6">
		<h2 class="text-xl font-semibold mb-4">Seus Eventos</h2>

		{#if loading}
			<div class="py-4">
				<LinearProgress indeterminate />
			</div>
		{:else if error}
			<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
				{error}
			</div>
			<Button on:click={fetchEvents} variant="outlined">Tentar Novamente</Button>
		{:else if events.length === 0}
			<div class="text-center py-8">
				<p class="text-gray-500 mb-4">Você ainda não tem eventos cadastrados.</p>
				<Button href="/admin/events/new" variant="filled">Criar Primeiro Evento</Button>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full border-collapse">
					<thead>
						<tr class="border-b border-gray-200">
							<th class="py-3 px-4 text-left">Título</th>
							<th class="py-3 px-4 text-left">Data</th>
							<th class="py-3 px-4 text-left">Local</th>
							<th class="py-3 px-4 text-left">Convidados</th>
							<th class="py-3 px-4 text-left">Ações</th>
						</tr>
					</thead>
					<tbody>
						{#each events as event (event.id)}
							<tr class="border-b border-gray-100 hover:bg-gray-50">
								<td class="py-3 px-4">{event.title}</td>
								<td class="py-3 px-4">{formatDate(event.datetime)}</td>
								<td class="py-3 px-4">{event.location || '-'}</td>
								<td class="py-3 px-4">{event.guests || '-'}</td>
								<td class="py-3 px-4">
									<div class="flex space-x-2">
										<IconButton href={`/admin/events/${event.id}`} icon="visibility" />
										<IconButton href={`/admin/events/${event.id}/edit`} icon="edit" />
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</Card>
</div>
