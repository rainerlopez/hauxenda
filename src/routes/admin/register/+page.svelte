<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';
	import { Progress } from '@skeletonlabs/skeleton-svelte';

	let name = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let loading = false;
	let errorMessage = '';
	let successMessage = '';

	async function handleRegister() {
		// Validação básica
		if (!name || !email || !password || !confirmPassword) {
			errorMessage = 'Por favor, preencha todos os campos';
			return;
		}

		if (password !== confirmPassword) {
			errorMessage = 'As senhas não coincidem';
			return;
		}

		if (password.length < 6) {
			errorMessage = 'A senha deve ter pelo menos 6 caracteres';
			return;
		}

		loading = true;
		errorMessage = '';
		successMessage = '';

		try {
			// Registrar o usuário no Supabase Auth
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						name
					}
				}
			});

			if (error) {
				errorMessage = error.message;
			} else {
				successMessage = 'Conta criada com sucesso! Verifique seu email para confirmar o registro.';
				// Limpar o formulário
				name = '';
				email = '';
				password = '';
				confirmPassword = '';
				
				// Redirecionar para login após alguns segundos
				setTimeout(() => {
					goto('/admin/login');
				}, 3000);
			}
		} catch (err) {
			console.error('Erro ao registrar:', err);
			errorMessage = 'Ocorreu um erro ao criar a conta';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Registrar Admin - Hauxenda</title>
</svelte:head>

<div class="flex items-center justify-center min-h-screen bg-surface-50-900-token">
	<div class="w-full max-w-md p-4">
		<div class="card p-6">
			<header class="text-center mb-6">
				<h1 class="h2">👤 Registrar Admin</h1>
			</header>

			<form on:submit|preventDefault={handleRegister} class="space-y-4">
				<label class="label">
					<span>Nome Completo</span>
					<input 
						class="input" 
						type="text" 
						placeholder="Seu nome completo" 
						bind:value={name} 
						autocomplete="name" 
						required
					/>
					<span class="text-sm opacity-70">Digite seu nome completo</span>
				</label>

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
					<span class="text-sm opacity-70">Digite seu email</span>
				</label>

				<label class="label">
					<span>Senha</span>
					<input 
						class="input" 
						type="password" 
						placeholder="********" 
						bind:value={password} 
						autocomplete="new-password" 
						required
					/>
					<span class="text-sm opacity-70">Mínimo de 6 caracteres</span>
				</label>

				<label class="label">
					<span>Confirmar Senha</span>
					<input 
						class="input" 
						type="password" 
						placeholder="********" 
						bind:value={confirmPassword} 
						autocomplete="new-password" 
						required
					/>
					<span class="text-sm opacity-70">Digite a senha novamente</span>
				</label>

				{#if errorMessage}
					<div class="alert variant-filled-error">
						{errorMessage}
					</div>
				{/if}

				{#if successMessage}
					<div class="alert variant-filled-success">
						{successMessage}
					</div>
				{/if}

				{#if loading}
					<Progress/>
				{/if}

				<div class="flex justify-center">
					<button type="submit" class="btn variant-filled-primary w-full" disabled={loading}>
						{loading ? 'Registrando...' : 'Registrar'}
					</button>
				</div>
			</form>

			<footer class="mt-6 flex justify-center">
				<a href="/admin/login" class="btn variant-ghost-surface">← Voltar para Login</a>
			</footer>
		</div>
	</div>
</div>
