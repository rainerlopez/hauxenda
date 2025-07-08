<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';
	import { TopAppBar, Button, Icon } from 'noph-ui';

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
	<TopAppBar fixed color="secondary">
		<div slot="title">Hauxenda Admin</div>
		<div slot="actions">
			{#if user}
				<span class="hidden md:inline-block mr-4 text-sm">
					{user.email}
				</span>
			{/if}
			<Button on:click={handleLogout} variant="outlined">
				{#snippet start()}
					<Icon>logout</Icon>
				{/snippet}
				Sair
			</Button>
		</div>
	</TopAppBar>

	<main class="pt-16 p-4">
		{@render children()}
	</main>
{:else}
	{@render children()}
{/if}
