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

	export let data;
	
	let event = data.event;
	let title = event.title;
	let description = event.description || '';
	let location = event.location || '';
	let guests = event.guests || '';
	let datetime = event.datetime ? new Date(event.datetime).toISOString().slice(0, 16) : '';
	let link = event.link || '';
	let pixKey = event.pix_key || '';
	let enableOptIn = false; // Implementar lógica de opt-in quando necessário
	let imageFile: File | null = null;
	let imagePreview = event.image_url || '';
	let loading = false;
	let errorMessage = '';
	let successMessage = '';

	function handleImageChange(event) {
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
		reader.onload = (e) => {
			imagePreview = e.target.result as string;
		};
		reader.readAsDataURL(file);
	}

	async function handleSubmit() {
		if (!title) {
			errorMessage = 'Por favor, informe pelo menos o título do evento';
			return;
		}

		loading = true;
		errorMessage = '';
		successMessage = '';

		try {
			// 1. Atualizar o evento no banco de dados
			const { error: updateError } = await supabase
				.from('events')
				.update({
					title,
					description,
					location,
					guests,
					datetime: datetime || null,
					link: link || null,
					pix_key: pixKey || null,
					updated_at: new Date().toISOString()
				})
				.eq('id', event.id);

			if (updateError) throw updateError;

			// 2. Se houver nova imagem, fazer upload
			if (imageFile) {
				const fileExt = imageFile.name.split('.').pop();
				const fileName = `event-${event.id}.${fileExt}`;

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

				const imageUrl = urlData.publicUrl;

				// 4. Atualizar o evento com a URL da imagem
				const { error: imageUpdateError } = await supabase
					.from('events')
					.update({ image_url: imageUrl })
					.eq('id', event.id);

				if (imageUpdateError) throw imageUpdateError;
			}

			successMessage = 'Evento atualizado com sucesso!';
			
			// Redirecionar para a página de detalhes após alguns segundos
			setTimeout(() => {
				goto(`/admin/events/${event.id}`);
			}, 2000);
			
		} catch (err) {
			console.error('Erro ao atualizar evento:', err);
			errorMessage = 'Ocorreu um erro ao atualizar o evento. Por favor, tente novamente.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Editar Evento - Hauxenda Admin</title>
</svelte:head>

<div class="container mx-auto px-4 py-6">
	<div class="flex items-center mb-6">
		<Button href={`/admin/events/${event.id}`} variant="text">
			<span class="material-icons mr-1">arrow_back</span>
			Voltar
		</Button>
		<h1 class="text-2xl font-bold ml-4">Editar Evento</h1>
	</div>

	<Card class="w-full max-w-3xl mx-auto">
		<Content class="p-6">
			<form on:submit|preventDefault={handleSubmit} class="space-y-6">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<!-- Título do Evento -->
					<div class="md:col-span-2">
						<Textfield
							variant="outlined"
							bind:value={title}
							label="Título do Evento *"
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
									{imagePreview ? 'Trocar Imagem' : 'Selecionar Imagem'}
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
					<Button href={`/admin/events/${event.id}`} variant="outlined">Cancelar</Button>
					<Button variant="raised" type="submit" disabled={loading}>
						{loading ? 'Salvando...' : 'Salvar Alterações'}
					</Button>
				</div>
			</form>
		</Content>
	</Card>
</div>
