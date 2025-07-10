<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';
	import type { Database, Tables } from '$lib/database.types';
	import { ArrowLeft } from '@lucide/svelte';

	export let data;

	type EventUpdate = Database['public']['Tables']['events']['Update'];

	let event: Tables<'events'> = data.event;

	// Initialize formData with data from the loader
	let formData: EventUpdate = {
		name: event.name,
		location: event.location,
		datetime: event.datetime ? new Date(event.datetime).toISOString().slice(0, 16) : '',
		guests: event.guests,
		link: event.link,
		pix_key: event.pix_key
	};

	let imageFile: File | null = null;
	let imagePreview: string = event.image_url || '';
	let loading = false;
	let errorMessage = '';
	let successMessage = '';

	function handleImageChange(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		const file = e.currentTarget.files?.[0];
		if (!file) return;

		if (!file.type.startsWith('image/')) {
			errorMessage = 'Por favor, selecione um arquivo de imagem válido.';
			imageFile = null;
			return;
		}

		imageFile = file;
		const reader = new FileReader();
		reader.onload = (ev: ProgressEvent<FileReader>) => {
			if (ev.target?.result) {
				imagePreview = ev.target.result as string;
			}
		};
		reader.readAsDataURL(file);
	}

	async function handleSubmit() {
		if (!formData.name) {
			errorMessage = 'Por favor, informe o nome do evento.';
			return;
		}

		loading = true;
		errorMessage = '';
		successMessage = '';

		try {
			let imageUrl = event.image_url;

			if (imageFile) {
				const fileExt = imageFile.name.split('.').pop();
				const fileName = `public/${event.id}.${fileExt}`;

				const { error: uploadError } = await supabase.storage
					.from('event-images')
					.upload(fileName, imageFile, {
						cacheControl: '3600',
						upsert: true
					});

				if (uploadError) throw uploadError;

				const { data: urlData } = supabase.storage.from('event-images').getPublicUrl(fileName);
				imageUrl = urlData.publicUrl;
			}

			const eventToUpdate: EventUpdate = {
				...formData,
				datetime: formData.datetime || null,
				image_url: imageUrl
			};

			const { error: updateError } = await supabase
				.from('events')
				.update(eventToUpdate)
				.eq('id', event.id);

			if (updateError) throw updateError;

			successMessage = 'Evento atualizado com sucesso! Redirecionando...';
			setTimeout(() => {
				goto('/admin/dashboard');
			}, 2000);
		} catch (err: any) {
			console.error('Erro ao atualizar evento:', err);
			errorMessage =
				err.message || 'Ocorreu um erro ao atualizar o evento. Por favor, tente novamente.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Editar: {event.name} - Hauxenda Admin</title>
</svelte:head>

<div class="container mx-auto max-w-4xl px-4 py-8">
	<div class="flex items-center mb-6">
		<a
			href="/admin/dashboard"
			class="flex items-center text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
		>
			<ArrowLeft class="w-5 h-5 mr-2" />
			Voltar para o Dashboard
		</a>
	</div>

	<h1 class="text-3xl font-bold mb-2">Editar Evento</h1>
	<p class="text-gray-500 dark:text-gray-400 mb-6">{event.name}</p>

	<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 md:p-8">
		<form on:submit|preventDefault={handleSubmit} class="space-y-6">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<!-- Nome do Evento -->
				<div class="md:col-span-2">
					<label for="eventName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome do Evento *</label>
					<input id="eventName" type="text" bind:value={formData.name} required class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Ex: Casamento de João e Maria" />
				</div>

				<!-- Local -->
				<div>
					<label for="location" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Local</label>
					<input id="location" type="text" bind:value={formData.location} class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Ex: Salão de Festas" />
				</div>

				<!-- Data e Hora -->
				<div>
					<label for="datetime" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Data e Hora</label>
					<input id="datetime" type="datetime-local" bind:value={formData.datetime} class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
				</div>

				<!-- Convidados -->
				<div>
					<label for="guests" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Convidados</label>
					<input id="guests" type="text" bind:value={formData.guests} class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Ex: Noivos e Padrinhos" />
				</div>

				<!-- Link Adicional -->
				<div>
					<label for="link" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Link Adicional</label>
					<input id="link" type="url" bind:value={formData.link} class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="https://..." />
				</div>

				<!-- Chave PIX -->
				<div class="md:col-span-2">
					<label for="pix_key" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Chave PIX (Opcional)</label>
					<input id="pix_key" type="text" bind:value={formData.pix_key} class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Para presentes ou contribuições" />
				</div>

				<!-- Upload de Imagem -->
				<div class="md:col-span-2">
					<div class="block text-sm font-medium text-gray-700 dark:text-gray-300">Imagem do Evento</div>
					<div class="mt-2 flex items-center space-x-6">
						<div class="shrink-0">
							{#if imagePreview}
								<img class="h-20 w-32 rounded-md object-cover" src={imagePreview} alt="Preview da imagem do evento" />
							{:else}
								<div class="h-20 w-32 flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-700 text-gray-400">
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M20.4 14.5L16 10l-4 4-4-4-2.5 2.5"/></svg>
								</div>
							{/if}
						</div>
						<label for="file-upload" class="relative cursor-pointer">
							<span class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">Trocar Imagem</span>
							<input id="file-upload" name="file-upload" type="file" class="sr-only" accept="image/*" on:change={handleImageChange} />
						</label>
					</div>
					<p class="mt-2 text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF até 5MB. Recomendado: 1200x630px.</p>
				</div>
			</div>

			<!-- Alertas -->
			{#if errorMessage}
				<div class="p-4 mt-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
					<span class="font-medium">Erro:</span> {errorMessage}
				</div>
			{/if}
			{#if successMessage}
				<div class="p-4 mt-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
					<span class="font-medium">Sucesso!</span> {successMessage}
				</div>
			{/if}

			<!-- Ações -->
			<div class="flex justify-end items-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
				<a href="/admin/dashboard" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">Cancelar</a>
				<button type="submit" class="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>
					{#if loading}
						<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Salvando...
					{:else}
						Salvar Alterações
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
