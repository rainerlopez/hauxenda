<script lang="ts">
	import '../app.css';
	// Removed AppBar import - using custom header with Skeleton classes
	import { page } from '$app/stores';
	// @ts-ignore - O módulo virtual:pwa-info é gerado em tempo de execução
	import { pwaInfo } from 'virtual:pwa-info';

	let { children } = $props();
	const webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');
</script>

<svelte:head>
	{@html webManifestLink}
</svelte:head>

<div class="app-shell">
	<header class="bg-gray-100 border-b border-gray-300">
		<div class="container mx-auto px-4">
			<div class="flex items-center justify-between h-16">
				<a href="/" class="flex items-center space-x-2">
					<img src="/favicon.svg" alt="Logo" class="w-8 h-8" />
					<span class="text-xl font-bold">Hauxenda</span>
				</a>
				<nav class="flex items-center space-x-4">
					<a href="/eventos" class="btn btn-sm variant-ghost-surface">Eventos</a>
					<a href="/admin" class="btn btn-sm variant-ghost-surface">Admin</a>
				</nav>
			</div>
		</div>
	</header>
	<main class="container mx-auto p-4">
		{@render children()}
	</main>
</div>
