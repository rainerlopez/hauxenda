<script lang="ts">
	import { onMount } from 'svelte';
	import { Progress } from '@skeletonlabs/skeleton-svelte';

	export let data;
	let events = data.events;
	let loading = false;
	let errorMessage = '';

	function formatDate(dateString: string): string {
		if (!dateString) return '-';
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('pt-BR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		}).format(date);
	}

	function formatCurrency(value: number | null): string {
		if (!value && value !== 0) return 'Gratuito';
		return `R$ ${value.toFixed(2).replace('.', ',')}`;
	}

	// Filtrar eventos passados e futuros
	$: upcomingEvents = events.filter(
		(event) => !event.data_evento || new Date(event.data_evento) >= new Date()
	);
	$: pastEvents = events.filter(
		(event) => event.data_evento && new Date(event.data_evento) < new Date()
	);
</script>

<svelte:head>
	<title>Eventos - Hauxenda</title>
	<meta name="description" content="Confira todos os eventos disponíveis no Hauxenda" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<h1 class="h1 mb-8 text-center">Eventos</h1>

	{#if loading}
		<div class="py-4">
			<Progress />
		</div>
	{:else if errorMessage}
		<div class="alert variant-filled-error mb-4 max-w-lg mx-auto">
			{errorMessage}
		</div>
	{:else if events.length === 0}
		<div class="text-center py-12">
			<p class="text-gray-500 mb-4">Não há eventos disponíveis no momento.</p>
			<a href="/" class="btn variant-filled">Voltar para Home</a>
		</div>
	{:else}
		<!-- Eventos Futuros -->
		{#if upcomingEvents.length > 0}
			<div class="mb-12">
				<h2 class="h2 mb-6">Próximos Eventos</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each upcomingEvents as event (event.id)}
						<div class="card h-full flex flex-col">
							{#if event.banner_url}
								<div class="h-48 overflow-hidden">
									<img
										src={event.banner_url}
										alt={event.nome}
										class="w-full h-full object-cover"
									/>
								</div>
							{/if}
							<div class="p-4 flex-grow">
								<h3 class="h3 mb-2 line-clamp-2">{event.nome}</h3>
								{#if event.data_evento}
									<p class="text-gray-600 mb-2 flex items-center">
										<span class="material-icons text-gray-500 mr-1 text-sm">calendar_today</span>
										{formatDate(event.data_evento)}
									</p>
								{/if}
								{#if event.local}
									<p class="text-gray-600 mb-3 flex items-center">
										<span class="material-icons text-gray-500 mr-1 text-sm">location_on</span>
										<span class="line-clamp-1">{event.local}</span>
									</p>
								{/if}
								{#if event.descricao}
									<p class="text-gray-700 line-clamp-3 mb-4">{event.descricao}</p>
								{/if}
							</div>
							<div class="p-4 pt-0">
								<a href={`/evento/${event.id}`} class="btn variant-filled w-full">
									Ver Detalhes
								</a>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Eventos Passados -->
		{#if pastEvents.length > 0}
			<div>
				<h2 class="h2 mb-6">Eventos Passados</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each pastEvents as event (event.id)}
						<div class="card h-full flex flex-col opacity-75">
							{#if event.banner_url}
								<div class="h-48 overflow-hidden grayscale">
									<img
										src={event.banner_url}
										alt={event.nome}
										class="w-full h-full object-cover"
									/>
								</div>
							{/if}
							<div class="p-4 flex-grow">
								<h3 class="h3 mb-2 line-clamp-2">{event.nome}</h3>
								{#if event.data_evento}
									<p class="text-gray-600 mb-2 flex items-center">
										<span class="material-icons text-gray-500 mr-1 text-sm">calendar_today</span>
										{formatDate(event.data_evento)}
									</p>
								{/if}
								{#if event.local}
									<p class="text-gray-600 mb-3 flex items-center">
										<span class="material-icons text-gray-500 mr-1 text-sm">location_on</span>
										<span class="line-clamp-1">{event.local}</span>
									</p>
								{/if}
								{#if event.descricao}
									<p class="text-gray-700 line-clamp-3 mb-4">{event.descricao}</p>
								{/if}
							</div>
							<div class="p-4 pt-0">
								<a href={`/evento/${event.id}`} class="btn variant-ghost w-full">
									Ver Detalhes
								</a>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{/if}
</div>
