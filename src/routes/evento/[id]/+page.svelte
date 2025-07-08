<script lang="ts">
	import { onMount } from 'svelte';
	import Card, { Content, Actions } from '@smui/card';
	import Button from '@smui/button';
	import Dialog, { Title, Content as DialogContent, Actions as DialogActions } from '@smui/dialog';
	import LinearProgress from '@smui/linear-progress';
	import Textfield from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';
	import { supabase } from '$lib/supabaseClient';

	export let data;
	let event = data.event;
	
	let name = '';
	let email = '';
	let phone = '';
	let optIn = false;
	let optInDialogOpen = false;
	let loading = false;
	let errorMessage = '';
	let successMessage = '';

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

	async function handleOptIn() {
		if (!name || !email) {
			errorMessage = 'Por favor, preencha seu nome e email';
			return;
		}

		loading = true;
		errorMessage = '';
		successMessage = '';

		try {
			// 1. Registrar o participante
			const { data: attendeeData, error: attendeeError } = await supabase
				.from('attendees')
				.insert({
					name,
					email,
					phone: phone || null
				})
				.select()
				.single();

			if (attendeeError) throw attendeeError;

			// 2. Registrar o opt-in para o evento
			const { error: optInError } = await supabase.from('event_optins').insert({
				event_id: event.id,
				attendee_id: attendeeData.id,
				opted_in: optIn
			});

			if (optInError) throw optInError;

			successMessage = 'Inscrição realizada com sucesso!';
			
			// Limpar formulário
			name = '';
			email = '';
			phone = '';
			optIn = false;
			
			// Fechar diálogo após alguns segundos
			setTimeout(() => {
				optInDialogOpen = false;
			}, 3000);
			
		} catch (err) {
			console.error('Erro ao registrar participante:', err);
			errorMessage = 'Ocorreu um erro ao registrar sua participação. Por favor, tente novamente.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>{event.title} - Hauxenda</title>
	<meta name="description" content={event.description || `Evento: ${event.title}`} />
	{#if event.image_url}
		<meta property="og:image" content={event.image_url} />
	{/if}
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="max-w-4xl mx-auto">
		<!-- Cabeçalho do Evento -->
		<div class="mb-8">
			<h1 class="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
			<p class="text-gray-600">
				{#if event.datetime}
					<span class="inline-flex items-center mr-4">
						<span class="material-icons text-gray-500 mr-1 text-sm">calendar_today</span>
						{formatDate(event.datetime)}
					</span>
				{/if}
				{#if event.location}
					<span class="inline-flex items-center">
						<span class="material-icons text-gray-500 mr-1 text-sm">location_on</span>
						{event.location}
					</span>
				{/if}
			</p>
		</div>

		<!-- Imagem do Evento -->
		{#if event.image_url}
			<div class="mb-8">
				<img
					src={event.image_url}
					alt={event.title}
					class="w-full h-auto max-h-96 object-cover rounded-lg shadow-lg"
				/>
			</div>
		{/if}

		<!-- Detalhes do Evento -->
		<Card class="mb-8">
			<Content class="p-6">
				{#if event.description}
					<div class="mb-6">
						<h2 class="text-xl font-semibold mb-2">Sobre o Evento</h2>
						<p class="text-gray-700 whitespace-pre-line">{event.description}</p>
					</div>
				{/if}

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<h2 class="text-xl font-semibold mb-3">Detalhes</h2>
						<ul class="space-y-3">
							{#if event.datetime}
								<li class="flex items-start">
									<span class="material-icons text-gray-500 mr-2">calendar_today</span>
									<div>
										<span class="text-sm text-gray-500">Data e Hora</span>
										<p>{formatDate(event.datetime)}</p>
									</div>
								</li>
							{/if}
							{#if event.location}
								<li class="flex items-start">
									<span class="material-icons text-gray-500 mr-2">location_on</span>
									<div>
										<span class="text-sm text-gray-500">Local</span>
										<p>{event.location}</p>
									</div>
								</li>
							{/if}
							{#if event.guests}
								<li class="flex items-start">
									<span class="material-icons text-gray-500 mr-2">people</span>
									<div>
										<span class="text-sm text-gray-500">Convidados</span>
										<p>{event.guests}</p>
									</div>
								</li>
							{/if}
						</ul>
					</div>

					{#if event.link}
						<div>
							<h2 class="text-xl font-semibold mb-3">Links</h2>
							<ul class="space-y-3">
								<li class="flex items-start">
									<span class="material-icons text-gray-500 mr-2">link</span>
									<div>
										<span class="text-sm text-gray-500">Mais Informações</span>
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
							</ul>
						</div>
					{/if}
				</div>
			</Content>
			<Actions class="px-6 pb-6 pt-0">
				<div class="w-full">
					<Button variant="raised" on:click={() => (optInDialogOpen = true)} class="w-full md:w-auto">
						<span class="material-icons mr-2">how_to_reg</span>
						Confirmar Presença
					</Button>
				</div>
			</Actions>
		</Card>

		<!-- Informações de Pagamento (se houver chave PIX) -->
		{#if event.pix_key}
			<Card class="mb-8">
				<Content class="p-6">
					<h2 class="text-xl font-semibold mb-3">Pagamento</h2>
					<div class="flex flex-col md:flex-row items-start md:items-center justify-between">
						<div>
							<p class="mb-2">
								Para confirmar sua participação, realize um pagamento via PIX usando a chave abaixo:
							</p>
							<div class="bg-gray-100 p-3 rounded-md font-mono text-sm mb-4 md:mb-0">
								{event.pix_key}
							</div>
						</div>
						<Button variant="outlined">
							<span class="material-icons mr-2">content_copy</span>
							Copiar Chave PIX
						</Button>
					</div>
				</Content>
			</Card>
		{/if}
	</div>
</div>

<!-- Diálogo de Opt-in -->
<Dialog bind:open={optInDialogOpen} aria-labelledby="optin-dialog-title">
	<Title id="optin-dialog-title">Confirmar Presença</Title>
	<DialogContent>
		<form on:submit|preventDefault={handleOptIn} class="space-y-4">
			<Textfield variant="outlined" bind:value={name} label="Nome Completo *" class="w-full">
				<HelperText slot="helper">Digite seu nome completo</HelperText>
			</Textfield>

			<Textfield variant="outlined" bind:value={email} label="Email *" type="email" class="w-full">
				<HelperText slot="helper">Digite seu email</HelperText>
			</Textfield>

			<Textfield variant="outlined" bind:value={phone} label="Telefone" class="w-full">
				<HelperText slot="helper">Digite seu telefone (opcional)</HelperText>
			</Textfield>

			<div class="flex items-center">
				<input
					type="checkbox"
					id="optin"
					bind:checked={optIn}
					class="mr-2 h-4 w-4 text-blue-600"
				/>
				<label for="optin" class="text-sm text-gray-700">
					Desejo receber atualizações sobre este e outros eventos
				</label>
			</div>

			{#if errorMessage}
				<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
					{errorMessage}
				</div>
			{/if}

			{#if successMessage}
				<div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
					{successMessage}
				</div>
			{/if}

			{#if loading}
				<LinearProgress indeterminate />
			{/if}
		</form>
	</DialogContent>
	<DialogActions>
		<Button on:click={() => (optInDialogOpen = false)} disabled={loading}>Cancelar</Button>
		<Button on:click={handleOptIn} variant="raised" disabled={loading || !name || !email}>
			Confirmar
		</Button>
	</DialogActions>
</Dialog>
