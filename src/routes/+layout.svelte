<script lang="ts">
	import '../app.css';
	import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
	import IconButton from '@smui/icon-button';
	import { page } from '$app/stores';

	let { children } = $props();
</script>

<TopAppBar variant="fixed">
	<Row>
		<Section>
			<Title>Hauxenda</Title>
		</Section>
		<Section align="end" toolbar>
			{#if $page.url.pathname !== '/test-supabase'}
				<IconButton href="/test-supabase" aria-label="Test Supabase">
					<span class="material-icons">bug_report</span>
				</IconButton>
			{/if}
		</Section>
	</Row>
</TopAppBar>

<main class="pt-16">
	{@render children()}
</main>
