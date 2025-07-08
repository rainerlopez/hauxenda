<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';
	import Card, { Content, Actions } from '@smui/card';
	import Button from '@smui/button';
	import IconButton from '@smui/icon-button';
	import Dialog, { Title, Content as DialogContent, Actions as DialogActions } from '@smui/dialog';
	import LinearProgress from '@smui/linear-progress';

	export let data;
	let event = data.event;
	let deleteDialogOpen = false;
	let loading = false;
	let errorMessage = '';

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

	async function handleDelete() {
		loading = true;
		errorMessage = '';

		try {
			// 1. Se houver imagem, excluir do storage
			if (event.image_url) {
				const fileName = event.image_url.split('/').pop();
				if (fileName) {
					await supabase.storage.from('event-images').remove([fileName]);
				}
			}

			// 2. Excluir o evento do banco de dados
			const { error: deleteError } = await supabase
				.from('events')
				.delete()
				.eq('id', event.id);

			if (deleteError) throw deleteError;

			// 3. Redirecionar para o dashboard
			goto('/admin/dashboard');
		} catch (err) {
			console.error('Erro ao excluir evento:', err);
			errorMessage = 'Ocorreu um erro ao excluir o evento. Por favor, tente novamente.';
			deleteDialogOpen = false;
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>{event.title} - Hauxenda Admin</title>
</svelte:head>

<div class="container mx-auto px-4 py-6">
	<div class="flex items-center mb-6">
		<Button href="/admin/dashboard" variant="text">
			<span class="material-icons mr-1">arrow_back</span>
			Voltar
		</Button>
		<h1 class="text-2xl font-bold ml-4 truncate">{event.title}</h1>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
		<!-- Coluna Principal -->
		<div class="md:col-span-2 space-y-6">
			<!-- Card de Detalhes -->
			<Card>
				<Content class="p-6">
					<div class="flex justify-between items-start mb-4">
						<h2 class="text-xl font-semibold">{event.title}</h2>
						<div class="flex space-x-2">
							<IconButton
								class="material-icons"
								href={`/admin/events/${event.id}/edit`}
								title="Editar"
							>
								edit
							</IconButton>
							<IconButton
								class="material-icons text-red-500"
								on:click={() => (deleteDialogOpen = true)}
								title="Excluir"
							>
								delete
							</IconButton>
						</div>
					</div>

					{#if event.image_url}
						<div class="mb-6">
							<img
								src={event.image_url}
								alt={event.title}
								class="w-full h-64 object-cover rounded-lg"
							/>
						</div>
					{/if}

					{#if event.description}
						<div class="mb-6">
							<h3 class="text-lg font-medium mb-2">Descrição</h3>
							<p class="text-gray-700 whitespace-pre-line">{event.description}</p>
						</div>
					{/if}

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<h3 class="text-lg font-medium mb-2">Detalhes do Evento</h3>
							<ul class="space-y-2">
								<li class="flex items-start">
									<span class="material-icons text-gray-500 mr-2">calendar_today</span>
									<div>
										<span class="text-sm text-gray-500">Data e Hora</span>
										<p>{formatDate(event.datetime) || 'Não definido'}</p>
									</div>
								</li>
								<li class="flex items-start">
									<span class="material-icons text-gray-500 mr-2">location_on</span>
									<div>
										<span class="text-sm text-gray-500">Local</span>
										<p>{event.location || 'Não definido'}</p>
									</div>
								</li>
								<li class="flex items-start">
									<span class="material-icons text-gray-500 mr-2">people</span>
									<div>
										<span class="text-sm text-gray-500">Convidados</span>
										<p>{event.guests || 'Não definido'}</p>
									</div>
								</li>
							</ul>
						</div>

						<div>
							<h3 class="text-lg font-medium mb-2">Informações Adicionais</h3>
							<ul class="space-y-2">
								{#if event.link}
									<li class="flex items-start">
										<span class="material-icons text-gray-500 mr-2">link</span>
										<div>
											<span class="text-sm text-gray-500">Link</span>
											<p>
												<a
													href={event.link}
													target="_blank"
													rel="noopener noreferrer"
													class="text-blue-600 hover:underline break-all"
												>
													{event.link}
												</a>
											</p>
										</div>
									</li>
								{/if}
								{#if event.pix_key}
									<li class="flex items-start">
										<span class="material-icons text-gray-500 mr-2">payments</span>
										<div>
											<span class="text-sm text-gray-500">Chave PIX</span>
											<p>{event.pix_key}</p>
										</div>
									</li>
								{/if}
								<li class="flex items-start">
									<span class="material-icons text-gray-500 mr-2">schedule</span>
									<div>
										<span class="text-sm text-gray-500">Criado em</span>
										<p>{formatDate(event.created_at)}</p>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</Content>
				<Actions class="px-6 pb-6 pt-0">
					<div class="w-full flex justify-between">
						<Button href="/admin/dashboard" variant="text">Voltar</Button>
						<Button href={`/admin/events/${event.id}/edit`} variant="raised">Editar</Button>
					</div>
				</Actions>
			</Card>

			<!-- Card de Participantes (placeholder) -->
			<Card>
				<Content class="p-6">
					<h2 class="text-xl font-semibold mb-4">Participantes</h2>
					<p class="text-gray-500 text-center py-8">
						Funcionalidade de participantes em desenvolvimento.
					</p>
				</Content>
			</Card>
		</div>

		<!-- Coluna Lateral -->
		<div class="space-y-6">
			<!-- Card de Estatísticas -->
			<Card>
				<Content class="p-6">
					<h2 class="text-xl font-semibold mb-4">Estatísticas</h2>
					<div class="space-y-4">
						<div>
							<p class="text-sm text-gray-500">Visualizações</p>
							<p class="text-2xl font-bold">-</p>
						</div>
						<div>
							<p class="text-sm text-gray-500">Opt-ins</p>
							<p class="text-2xl font-bold">-</p>
						</div>
						<div>
							<p class="text-sm text-gray-500">Confirmações</p>
							<p class="text-2xl font-bold">-</p>
						</div>
					</div>
					<p class="text-xs text-gray-400 mt-4">Estatísticas em breve</p>
				</Content>
			</Card>

			<!-- Card de Ações -->
			<Card>
				<Content class="p-6">
					<h2 class="text-xl font-semibold mb-4">Ações</h2>
					<div class="space-y-3">
						<Button href={`/admin/events/${event.id}/edit`} variant="outlined" class="w-full">
							<span class="material-icons mr-2">edit</span>
							Editar Evento
						</Button>
						<Button
							on:click={() => (deleteDialogOpen = true)}
							variant="outlined"
							class="w-full text-red-500 border-red-500"
						>
							<span class="material-icons mr-2">delete</span>
							Excluir Evento
						</Button>
						<Button href={`/evento/${event.id}`} variant="outlined" class="w-full" target="_blank">
							<span class="material-icons mr-2">visibility</span>
							Ver Página Pública
						</Button>
					</div>
				</Content>
			</Card>

			<!-- Card de QR Code (placeholder) -->
			<Card>
				<Content class="p-6">
					<h2 class="text-xl font-semibold mb-4">QR Code</h2>
					<div class="bg-gray-100 h-48 rounded flex items-center justify-center">
						<p class="text-gray-500">QR Code em breve</p>
					</div>
					<p class="text-xs text-gray-400 mt-4">
						Compartilhe o QR Code para acesso rápido ao evento
					</p>
				</Content>
			</Card>
		</div>
	</div>
</div>

<!-- Diálogo de Confirmação de Exclusão -->
<Dialog bind:open={deleteDialogOpen} aria-labelledby="delete-dialog-title">
	<Title id="delete-dialog-title">Excluir Evento</Title>
	<DialogContent>
		<p>
			Tem certeza que deseja excluir o evento <strong>{event.title}</strong>? Esta ação não pode
			ser desfeita.
		</p>
		{#if errorMessage}
			<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mt-4">
				{errorMessage}
			</div>
		{/if}
		{#if loading}
			<LinearProgress indeterminate class="mt-4" />
		{/if}
	</DialogContent>
	<DialogActions>
		<Button on:click={() => (deleteDialogOpen = false)} disabled={loading}>Cancelar</Button>
		<Button on:click={handleDelete} variant="raised" disabled={loading}>Excluir</Button>
	</DialogActions>
</Dialog>
