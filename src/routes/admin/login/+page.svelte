<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';
	import { Progress } from '@skeletonlabs/skeleton-svelte';

	let email = '';
	let password = '';
	let loading = false;
	let errorMessage = '';

	onMount(() => {
		// Verificar se já está logado
		checkSession();
	});

	async function checkSession() {
		const { data } = await supabase.auth.getSession();
		if (data.session) {
			// Já está autenticado, redirecionar para o dashboard
			goto('/admin/dashboard');
		}
	}

	async function handleLogin() {
		if (!email || !password) {
			errorMessage = 'Por favor, preencha todos os campos';
			return;
		}

		loading = true;
		errorMessage = '';

		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password
			});

			if (error) {
				errorMessage = error.message;
			} else if (data.user) {
				// Login bem-sucedido, redirecionar para o dashboard
				goto('/admin/dashboard');
			}
		} catch (err) {
			console.error('Erro ao fazer login:', err);
			errorMessage = 'Ocorreu um erro ao fazer login';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Login Admin - Hauxenda</title>
</svelte:head>

<div class="flex items-center justify-center min-h-screen bg-surface-50-900-token">
	<div class="w-full max-w-md p-4">
		<div class="card p-6">
			<header class="text-center mb-6">
				<h1 class="h2">🔐 Admin Login</h1>
			</header>

			<form on:submit|preventDefault={handleLogin} class="space-y-6">
				<label class="label">
					<span>Email</span>
					<input 
						class="input" 
						type="email" 
						placeholder="seu@email.com" 
						bind:value={email} 
						autocomplete="email" 
						required
					/>
					<span class="text-sm opacity-70">Digite seu email de administrador</span>
				</label>

				<label class="label">
					<span>Senha</span>
					<input 
						class="input" 
						type="password" 
						placeholder="********" 
						bind:value={password} 
						autocomplete="current-password" 
						required
					/>
					<span class="text-sm opacity-70">Digite sua senha</span>
				</label>

				{#if errorMessage}
					<div class="alert variant-filled-error">
						{errorMessage}
					</div>
				{/if}

				{#if loading}
					<Progress/>
				{/if}

				<div class="flex justify-center">
					<button type="submit" class="btn variant-filled-primary w-full" disabled={loading}>
						{loading ? 'Entrando...' : 'Entrar'}
					</button>
				</div>
			</form>

			<footer class="mt-6 flex justify-between items-center">
				<a href="/" class="btn variant-ghost-surface">← Voltar</a>
				<a href="/admin/register" class="btn variant-ghost-surface">Registrar</a>
			</footer>
		</div>
	</div>
</div>
