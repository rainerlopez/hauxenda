<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';
	import Card, { Content, Actions } from '@smui/card';
	import Button from '@smui/button';
	import Textfield from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';
	import LinearProgress from '@smui/linear-progress';
	import Switch from '@smui/switch';
	import FormField from '@smui/form-field';

	// Interface for event type based on Supabase schema
	interface Event {
		id: string;
		name: string;
		description?: string;
		location?: string;
		guests?: string;
		datetime?: string;
		link?: string;
		pix_key?: string;
		image_url?: string;
		admin_id: string;
		created_at?: string;
		updated_at?: string;
	}

	let user = $page.data.user;
	let name = ''; // Changed from title to name to match DB schema
	let description = '';
	let location = '';
	let guests = '';
	let datetime = '';
	let link = '';
	let pixKey = '';
	let enableOptIn = false;
	let imageFile: File | null = null;
	let imagePreview = '';
	let loading = false;
	let errorMessage = '';
	let successMessage = '';

	function handleImageChange(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		const file = event.target.files[0];
		if (!file) return;

		// Verificar se é uma imagem
		if (!file.type.startsWith('image/')) {
			errorMessage = 'Por favor, selecione um arquivo de imagem válido';
			return;
		}

		imageFile = file;
		
		// Criar preview
		const reader = new FileReader();
		reader.onload = (e: ProgressEvent<FileReader>) => {
			if (e.target && e.target.result) {
				imagePreview = e.target.result as string;
			}
		};
		reader.readAsDataURL(file);
	}

	async function handleSubmit() {
		if (!name) {
			errorMessage = 'Por favor, informe pelo menos o nome do evento';
			return;
		}

		loading = true;
		errorMessage = '';
		successMessage = '';

		try {
			// 1. Inserir o evento no banco de dados
			const { data: eventData, error: eventError } = await supabase
				.from('events')
				.insert({
					name, // Changed from title to name
					description,
					location,
					guests,
					datetime: datetime || null,
					link: link || null,
					pix_key: pixKey || null,
					admin_id: user.id
				})
				.select()
				.single();

			if (eventError) throw eventError;

			// 2. Se houver imagem, fazer upload
			let imageUrl = null;
			if (imageFile && eventData) {
				const eventId = eventData.id;
				const fileExt = imageFile.name.split('.').pop();
				const fileName = `event-${eventId}.${fileExt}`;

				const { data: uploadData, error: uploadError } = await supabase.storage
					.from('event-images')
					.upload(fileName, imageFile, {
						cacheControl: '3600',
						upsert: true
					});

				if (uploadError) throw uploadError;

				// 3. Obter a URL pública da imagem
				const { data: urlData } = supabase.storage
					.from('event-images')
					.getPublicUrl(fileName);

				imageUrl = urlData.publicUrl;

				// 4. Atualizar o evento com a URL da imagem
				const { error: updateError } = await supabase
					.from('events')
					.update({ image_url: imageUrl })
					.eq('id', eventId);

				if (updateError) throw updateError;
			}

			successMessage = 'Evento criado com sucesso!';
			
			// Redirecionar para o dashboard após alguns segundos
			setTimeout(() => {
				goto('/admin/dashboard');
			}, 2000);
			
		} catch (err) {
			console.error('Erro ao criar evento:', err);
			errorMessage = 'Ocorreu um erro ao criar o evento. Por favor, tente novamente.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Novo Evento - Hauxenda Admin</title>
</svelte:head>

<div class="container mx-auto px-4 py-6">
	<div class="flex items-center mb-6">
		<Button href="/admin/dashboard" variant="text">
			<span class="material-icons mr-1">arrow_back</span>
			Voltar
		</Button>
		<h1 class="text-2xl font-bold ml-4">Novo Evento</h1>
	</div>

	<Card class="w-full max-w-3xl mx-auto">
		<Content class="p-6">
			<form on:submit|preventDefault={handleSubmit} class="space-y-6">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<!-- Título do Evento -->
					<div class="md:col-span-2">
						<Textfield
							variant="outlined"
							bind:value={name}
							label="Nome do Evento *"
							class="w-full"
						>
							<HelperText slot="helper">Nome do seu evento</HelperText>
						</Textfield>
					</div>

					<!-- Descrição -->
					<div class="md:col-span-2">
						<Textfield
							variant="outlined"
							bind:value={description}
							label="Descrição"
							textarea
							input$rows="4"
							class="w-full"
						>
							<HelperText slot="helper">Detalhes sobre o evento</HelperText>
						</Textfield>
					</div>

					<!-- Local -->
					<div>
						<Textfield
							variant="outlined"
							bind:value={location}
							label="Local"
							class="w-full"
						>
							<HelperText slot="helper">Onde será realizado</HelperText>
						</Textfield>
					</div>

					<!-- Data e Hora -->
					<div>
						<Textfield
							variant="outlined"
							bind:value={datetime}
							label="Data e Hora"
							type="datetime-local"
							class="w-full"
						>
							<HelperText slot="helper">Quando será realizado</HelperText>
						</Textfield>
					</div>

					<!-- Convidados -->
					<div>
						<Textfield
							variant="outlined"
							bind:value={guests}
							label="Convidados"
							class="w-full"
						>
							<HelperText slot="helper">Quem está convidado</HelperText>
						</Textfield>
					</div>

					<!-- Link -->
					<div>
						<Textfield
							variant="outlined"
							bind:value={link}
							label="Link"
							type="url"
							class="w-full"
						>
							<HelperText slot="helper">Link opcional para mais informações</HelperText>
						</Textfield>
					</div>

					<!-- Chave PIX -->
					<div>
						<Textfield
							variant="outlined"
							bind:value={pixKey}
							label="Chave PIX"
							class="w-full"
						>
							<HelperText slot="helper">Para recebimento de pagamentos</HelperText>
						</Textfield>
					</div>

					<!-- Opt-in Switch -->
					<div>
						<FormField>
							<Switch bind:checked={enableOptIn} />
							<span slot="label">Habilitar Opt-in para este evento</span>
						</FormField>
						<p class="text-xs text-gray-500 mt-1">
							Permite que participantes façam opt-in para receber informações
						</p>
					</div>

					<!-- Upload de Imagem -->
					<div class="md:col-span-2">
						<label class="block text-sm font-medium text-gray-700 mb-2">
							Imagem do Evento
						</label>
						<div class="flex items-center space-x-4">
							<div
								class="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden"
							>
								{#if imagePreview}
									<img src={imagePreview} alt="Preview" class="w-full h-full object-cover" />
								{:else}
									<span class="text-gray-400 text-center text-sm p-2">
										Nenhuma imagem selecionada
									</span>
								{/if}
							</div>
							<div>
								<Button variant="outlined" component="label" class="mb-2">
									<span class="material-icons mr-2">upload</span>
									Selecionar Imagem
									<input
										type="file"
										accept="image/*"
										on:change={handleImageChange}
										class="hidden"
									/>
								</Button>
								<p class="text-xs text-gray-500">
									Recomendado: 1200x630px, máximo 5MB
								</p>
							</div>
						</div>
					</div>
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

				<div class="flex justify-end space-x-4">
					<Button href="/admin/dashboard" variant="outlined">Cancelar</Button>
					<Button variant="raised" type="submit" disabled={loading}>
						{loading ? 'Criando...' : 'Criar Evento'}
					</Button>
				</div>
			</form>
		</Content>
	</Card>
</div>
