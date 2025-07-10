<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	// Custom modal store implementation to avoid Skeleton UI CSS conflicts
	import { writable } from 'svelte/store';
	
	type ModalSettings = {
		type: string;
		title?: string;
		body: string;
		response?: (r: boolean) => void;
	};
	
	// Simple modal store replacement
	const modalStore = writable(null);
	const getModalStore = () => modalStore;

	let optInDialogOpen = false;

	export let data;
	let event = data.event;
	
	let name = '';
	let email = '';
	let phone = '';
	let cpf = '';
	let optIn = false;
	let loading = false;
	let errorMessage = '';
	let successMessage = '';

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

	function formatCurrency(value: number | null): string {
		if (!value && value !== 0) return '-';
		return value.toFixed(2).replace('.', ',');
	}

	// Função para abrir o modal de confirmação de presença
	function openOptInModal() {
		optInDialogOpen = true;
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
			const { error: optInError } = await supabase
				.from('inscricoes')
				.insert({ 
					evento_id: event.id, 
					nome_participante: name, 
					email_participante: email,
					telefone_participante: phone,
					cpf_participante: cpf
				});

			if (optInError) throw optInError;

			successMessage = 'Inscrição realizada com sucesso!';
			
			// Limpar formulário
			name = '';
			email = '';
			phone = '';
			optIn = false;
			
			// Mostrar mensagem de sucesso e fechar modal após alguns segundos
			const successModal: ModalSettings = {
				type: 'alert',
				title: 'Sucesso!',
				body: 'Inscrição realizada com sucesso!',
				button: 'OK',
				autoclose: true,
				timeout: 3000
			};
			modalStore.trigger(successModal);
			
		} catch (err) {
			console.error('Erro ao registrar participante:', err);
			errorMessage = 'Ocorreu um erro ao registrar sua participação. Por favor, tente novamente.';
			
			// Mostrar mensagem de erro
			const errorModal: ModalSettings = {
				type: 'alert',
				title: 'Erro',
				body: errorMessage,
				button: 'OK',
				variant: 'error'
			};
			modalStore.trigger(errorModal);
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>{event.nome} - Hauxenda</title>
	<meta name="description" content={`Evento: ${event.nome}`} />
	{#if event.banner_url}
		<meta property="og:image" content={event.banner_url} />
	{/if}
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="max-w-4xl mx-auto">
		<!-- Cabeçalho do Evento -->
		<div class="card p-4">
			<div class="p-4">
				<div class="flex flex-col md:flex-row gap-6">
					<div class="w-full md:w-1/2">
						{#if event.banner_url}
							<img src={event.banner_url} alt={event.nome} class="w-full h-auto rounded-lg shadow-md" />
						{:else}
							<div class="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
								<span class="text-gray-500">Sem imagem</span>
							</div>
						{/if}
					</div>
					<div class="w-full md:w-1/2">
						<h1 class="h2 font-bold mb-4">{event.nome}</h1>
						<div class="mb-4">
							<p class="text-gray-700">
								<span class="font-semibold">Data:</span>
								{formatDate(event.data_evento)}
							</p>
							<p class="text-gray-700">
								<span class="font-semibold">Local:</span>
								{event.local || 'A definir'}
							</p>
							<p class="text-gray-700">
								<span class="font-semibold">Valor:</span>
								R$ {formatCurrency(event.valor_inscricao)}
							</p>
						</div>
						<div class="mb-4">
							<h2 class="h3 font-semibold mb-2">Descrição</h2>
							<p class="text-gray-700">{event.descricao || 'Informações sobre o evento'}</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Detalhes do Evento -->
		<div class="card p-4 mb-8">
			<div class="p-6">
				<h2 class="h3 font-semibold mb-4">Sobre o Evento</h2>
				<p class="mb-6">{event.descricao || 'Detalhes e informações sobre o evento'}</p>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<h3 class="text-xl font-semibold mb-3">Detalhes</h3>
						<ul class="space-y-3">
							{#if event.data_evento}
								<li class="flex items-start">
									<span class="material-icons text-gray-500 mr-2">event</span>
									<div>
										<span class="text-sm text-gray-600">Data e Hora</span>
										<p>{formatDate(event.data_evento)}</p>
									</div>
								</li>
							{/if}
							{#if event.local}
								<li class="flex items-start">
									<span class="material-icons text-gray-500 mr-2">location_on</span>
									<div>
										<span class="text-sm text-gray-600">Local</span>
										<p>{event.local}</p>
									</div>
								</li>
							{/if}
							<li class="flex items-start">
								<span class="material-icons text-gray-500 mr-2">people</span>
								<div>
									<span class="text-sm text-gray-600">Participantes</span>
									<p>{event.max_participantes ? `Máximo ${event.max_participantes}` : 'Ilimitado'}</p>
								</div>
							</li>
						</ul>
					</div>

					{#if event.pix_key}
						<div>
							<h3 class="text-xl font-semibold mb-3">Pagamento</h3>
							<ul class="space-y-3">
								<li class="flex items-start">
									<span class="material-icons text-gray-500 mr-2">payment</span>
									<div>
										<span class="text-sm text-gray-500">Chave PIX</span>
										<p class="font-mono text-sm bg-gray-100 p-2 rounded">{event.pix_key}</p>
									</div>
								</li>
							</ul>
						</div>
					{/if}
				</div>

				<div class="flex justify-between mt-6">
					<div>
						<button class="btn variant-filled" on:click={() => optInDialogOpen = true}>
							<span class="material-icons mr-2">check_circle</span>
							Confirmar Presença
						</button>
					</div>
					<div>
						<button class="btn variant-ghost" on:click={() => window.history.back()}>Voltar</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Informações de Pagamento (se houver chave PIX) -->
		{#if event.pix_key}
			<div class="card p-4 mb-8">
				<div class="p-6">
					<h2 class="h3 font-semibold mb-3">Pagamento</h2>
					<div class="flex flex-col md:flex-row items-start md:items-center justify-between">
						<div>
							<p class="mb-2">
								Para confirmar sua participação, realize um pagamento via PIX usando a chave abaixo:
							</p>
							<div class="bg-gray-100 p-3 rounded-md font-mono text-sm mb-4 md:mb-0">
								{event.pix_key}
							</div>
						</div>
						<button class="btn variant-outline">
							<span class="material-icons mr-2">content_copy</span>
							Copiar Chave PIX
						</button>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<!-- Modal de Opt-in usando Skeleton UI -->
{#if optInDialogOpen}
	<div class="modal-backdrop bg-black/50 fixed inset-0 z-40"></div>
	<div class="modal card w-modal shadow-xl variant-filled-surface p-4 border-t-4 border-primary-500 max-w-lg mx-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
		<header class="modal-header">
			<h3 class="h3">Confirmar Presença</h3>
			<button class="btn-icon btn-icon-sm variant-ghost-surface" on:click={() => (optInDialogOpen = false)}>
				<span class="material-icons">close</span>
			</button>
		</header>
		<article class="p-4">
			<form on:submit|preventDefault={handleOptIn} class="space-y-4">
				<label class="label">
					<span>Nome Completo *</span>
					<input class="input" type="text" bind:value={name} placeholder="Digite seu nome completo" />
					<span class="text-xs text-surface-600-300-token">Digite seu nome completo</span>
				</label>

				<label class="label">
					<span>Email *</span>
					<input class="input" type="email" bind:value={email} placeholder="Digite seu email" />
					<span class="text-xs text-surface-600-300-token">Digite seu email</span>
				</label>

				<label class="label">
					<span>Telefone</span>
					<input class="input" type="tel" bind:value={phone} placeholder="Digite seu telefone (opcional)" />
					<span class="text-xs text-surface-600-300-token">Digite seu telefone (opcional)</span>
				</label>

				<div class="flex items-center">
					<input
						type="checkbox"
						id="optin"
						bind:checked={optIn}
						class="checkbox mr-2"
					/>
					<label for="optin" class="text-sm">
						Desejo receber atualizações sobre este e outros eventos
					</label>
				</div>

				{#if errorMessage}
					<div class="alert variant-filled-error">
						{errorMessage}
					</div>
				{/if}

				{#if successMessage}
					<div class="alert variant-filled-success">
						{successMessage}
					</div>
				{/if}

				{#if loading}
					<div class="progress-bar">
						<div class="progress-bar-track">
							<div class="progress-bar-fill-indeterminate"></div>
						</div>
					</div>
				{/if}
			</form>
		</article>
		<footer class="modal-footer flex justify-end space-x-2">
			<button class="btn variant-ghost" on:click={() => (optInDialogOpen = false)} disabled={loading}>Cancelar</button>
			<button class="btn variant-filled-primary" on:click={handleOptIn} disabled={loading || !name || !email}>
				Confirmar
			</button>
		</footer>
	</div>
{/if}
