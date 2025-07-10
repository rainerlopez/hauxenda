<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';
	import { AppBar } from '@skeletonlabs/skeleton-svelte';

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
	<div class="admin-shell">
		<header>
			<AppBar background="bg-primary-500">
				<svelte:fragment slot="lead">
					<strong class="text-xl">Hauxenda Admin</strong>
				</svelte:fragment>
				<svelte:fragment slot="trail">
					{#if user}
						<span class="hidden md:inline-block mr-4 text-sm">
							{user.email}
						</span>
					{/if}
					<button class="btn btn-sm variant-filled-surface" onclick={handleLogout}>
						<span class="material-icons">logout</span>
						<span>Sair</span>
					</button>
				</svelte:fragment>
			</AppBar>
		</header>
		<main class="container mx-auto p-4">
			{@render children()}
		</main>
	</div>
{:else}
	{@render children()}
{/if}
