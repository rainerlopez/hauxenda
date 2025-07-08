<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';
	import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
	import IconButton from '@smui/icon-button';
	import Button from '@smui/button';

	let { children } = $props();
	let user = $page.data.user;

	async function handleLogout() {
		const { error } = await supabase.auth.signOut();
		if (!error) {
			goto('/admin/login');
		} else {
			console.error('Erro ao fazer logout:', error);
		}
	}
</script>

<svelte:head>
	<title>Admin - Hauxenda</title>
</svelte:head>

{#if $page.url.pathname !== '/admin/login' && $page.url.pathname !== '/admin/register'}
	<TopAppBar variant="fixed" color="secondary">
		<Row>
			<Section>
				<Title>Hauxenda Admin</Title>
			</Section>
			<Section align="end" toolbar>
				{#if user}
					<span class="hidden md:inline-block mr-4 text-sm">
						{user.email}
					</span>
				{/if}
				<Button on:click={handleLogout} variant="outlined">
					<span class="material-icons mr-2">logout</span>
					Sair
				</Button>
			</Section>
		</Row>
	</TopAppBar>

	<main class="pt-16 p-4">
		{@render children()}
	</main>
{:else}
	{@render children()}
{/if}
