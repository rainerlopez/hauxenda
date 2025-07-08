<script lang="ts">
	import '../app.css';
	import 'noph-ui/defaultTheme';
	import { TopAppBar, IconButton } from 'noph-ui';
	import { page } from '$app/stores';
	import { pwaInfo } from 'virtual:pwa-info';

	let { children } = $props();
	const webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');
</script>

<svelte:head>
	{@html webManifestLink}
</svelte:head>

<TopAppBar fixed>
	<div slot="title">Hauxenda</div>
	<div slot="actions">
		<IconButton href="/eventos" aria-label="Ver Eventos" icon="event" />
		{#if $page.url.pathname !== '/test-supabase'}
			<IconButton href="/test-supabase" aria-label="Test Supabase" icon="bug_report" />
		{/if}
	</div>
</TopAppBar>

<main class="pt-16">
	{@render children()}
</main>
