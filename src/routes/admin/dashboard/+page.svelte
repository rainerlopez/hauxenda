<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import Card, { Content, Actions } from '@smui/card';
	import Button from '@smui/button';
	import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
	import LinearProgress from '@smui/linear-progress';
	import IconButton from '@smui/icon-button';

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
		<Button href="/admin/events/new" variant="raised">
			<span class="material-icons mr-2">add</span>
			Novo Evento
		</Button>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
		<!-- Card de Boas-vindas -->
		<Card class="col-span-1 md:col-span-3">
			<Content class="p-6">
				<h2 class="text-xl font-semibold mb-2">Bem-vindo, {user?.user_metadata?.name || user?.email}!</h2>
				<p class="text-gray-600">
					Este é o seu painel de controle para gerenciar eventos do Hauxenda. Aqui você pode criar, editar e
					monitorar seus eventos.
				</p>
			</Content>
		</Card>

		<!-- Card de Estatísticas -->
		<Card>
			<Content class="p-6">
				<h3 class="text-lg font-semibold mb-2">Total de Eventos</h3>
				<p class="text-3xl font-bold">{events.length}</p>
			</Content>
		</Card>

		<!-- Card de Participantes -->
		<Card>
			<Content class="p-6">
				<h3 class="text-lg font-semibold mb-2">Participantes</h3>
				<p class="text-3xl font-bold">-</p>
				<p class="text-sm text-gray-500">Em breve</p>
			</Content>
		</Card>

		<!-- Card de Opt-ins -->
		<Card>
			<Content class="p-6">
				<h3 class="text-lg font-semibold mb-2">Opt-ins</h3>
				<p class="text-3xl font-bold">-</p>
				<p class="text-sm text-gray-500">Em breve</p>
			</Content>
		</Card>
	</div>

	<!-- Lista de Eventos -->
	<Card>
		<Content class="p-6">
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
					<Button href="/admin/events/new" variant="raised">Criar Primeiro Evento</Button>
				</div>
			{:else}
				<div class="overflow-x-auto">
					<DataTable class="w-full">
						<Head>
							<Row>
								<Cell>Título</Cell>
								<Cell>Data</Cell>
								<Cell>Local</Cell>
								<Cell>Convidados</Cell>
								<Cell>Ações</Cell>
							</Row>
						</Head>
						<Body>
							{#each events as event (event.id)}
								<Row>
									<Cell>{event.title}</Cell>
									<Cell>{formatDate(event.datetime)}</Cell>
									<Cell>{event.location || '-'}</Cell>
									<Cell>{event.guests || '-'}</Cell>
									<Cell>
										<div class="flex space-x-2">
											<IconButton class="material-icons" href={`/admin/events/${event.id}`}>visibility</IconButton>
											<IconButton class="material-icons" href={`/admin/events/${event.id}/edit`}>edit</IconButton>
										</div>
									</Cell>
								</Row>
							{/each}
						</Body>
					</DataTable>
				</div>
			{/if}
		</Content>
	</Card>
</div>
