<script lang="ts">
	import { onMount } from 'svelte';
	import Card, { Content, Actions } from '@smui/card';
	import Button from '@smui/button';
	import LinearProgress from '@smui/linear-progress';

	export let data;
	let events = data.events;
	let loading = false;
	let errorMessage = '';

	function formatDate(dateString) {
		if (!dateString) return '-';
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('pt-BR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		}).format(date);
	}

	// Filtrar eventos passados e futuros
	$: upcomingEvents = events.filter(
		(event) => !event.datetime || new Date(event.datetime) >= new Date()
	);
	$: pastEvents = events.filter(
		(event) => event.datetime && new Date(event.datetime) < new Date()
	);
</script>

<svelte:head>
	<title>Eventos - Hauxenda</title>
	<meta name="description" content="Confira todos os eventos disponíveis no Hauxenda" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-3xl font-bold mb-8 text-center">Eventos</h1>

	{#if loading}
		<div class="py-4">
			<LinearProgress indeterminate />
		</div>
	{:else if errorMessage}
		<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 max-w-lg mx-auto">
			{errorMessage}
		</div>
	{:else if events.length === 0}
		<div class="text-center py-12">
			<p class="text-gray-500 mb-4">Não há eventos disponíveis no momento.</p>
			<Button href="/" variant="raised">Voltar para Home</Button>
		</div>
	{:else}
		<!-- Eventos Futuros -->
		{#if upcomingEvents.length > 0}
			<div class="mb-12">
				<h2 class="text-2xl font-semibold mb-6">Próximos Eventos</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each upcomingEvents as event (event.id)}
						<Card class="h-full flex flex-col">
							{#if event.image_url}
								<div class="h-48 overflow-hidden">
									<img
										src={event.image_url}
										alt={event.title}
										class="w-full h-full object-cover"
									/>
								</div>
							{/if}
							<Content class="p-4 flex-grow">
								<h3 class="text-xl font-semibold mb-2 line-clamp-2">{event.title}</h3>
								{#if event.datetime}
									<p class="text-gray-600 mb-2 flex items-center">
										<span class="material-icons text-gray-500 mr-1 text-sm">calendar_today</span>
										{formatDate(event.datetime)}
									</p>
								{/if}
								{#if event.location}
									<p class="text-gray-600 mb-3 flex items-center">
										<span class="material-icons text-gray-500 mr-1 text-sm">location_on</span>
										<span class="line-clamp-1">{event.location}</span>
									</p>
								{/if}
								{#if event.description}
									<p class="text-gray-700 line-clamp-3 mb-4">{event.description}</p>
								{/if}
							</Content>
							<Actions class="p-4 pt-0">
								<Button href={`/evento/${event.id}`} variant="raised" class="w-full">
									Ver Detalhes
								</Button>
							</Actions>
						</Card>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Eventos Passados -->
		{#if pastEvents.length > 0}
			<div>
				<h2 class="text-2xl font-semibold mb-6">Eventos Passados</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each pastEvents as event (event.id)}
						<Card class="h-full flex flex-col opacity-75">
							{#if event.image_url}
								<div class="h-48 overflow-hidden grayscale">
									<img
										src={event.image_url}
										alt={event.title}
										class="w-full h-full object-cover"
									/>
								</div>
							{/if}
							<Content class="p-4 flex-grow">
								<h3 class="text-xl font-semibold mb-2 line-clamp-2">{event.title}</h3>
								{#if event.datetime}
									<p class="text-gray-600 mb-2 flex items-center">
										<span class="material-icons text-gray-500 mr-1 text-sm">calendar_today</span>
										{formatDate(event.datetime)}
									</p>
								{/if}
								{#if event.location}
									<p class="text-gray-600 mb-3 flex items-center">
										<span class="material-icons text-gray-500 mr-1 text-sm">location_on</span>
										<span class="line-clamp-1">{event.location}</span>
									</p>
								{/if}
								{#if event.description}
									<p class="text-gray-700 line-clamp-3 mb-4">{event.description}</p>
								{/if}
							</Content>
							<Actions class="p-4 pt-0">
								<Button href={`/evento/${event.id}`} variant="outlined" class="w-full">
									Ver Detalhes
								</Button>
							</Actions>
						</Card>
					{/each}
				</div>
			</div>
		{/if}
	{/if}
</div>
