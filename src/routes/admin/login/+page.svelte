<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';
	import Button from '@smui/button';
	import Textfield from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';
	import Card, { Content, Actions } from '@smui/card';
	import LinearProgress from '@smui/linear-progress';

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

<div class="flex items-center justify-center min-h-screen bg-gray-100">
	<div class="w-full max-w-md p-4">
		<Card class="w-full">
			<Content class="p-6">
				<h1 class="text-2xl font-bold text-center mb-6">🔐 Admin Login</h1>

				<form on:submit|preventDefault={handleLogin} class="space-y-6">
					<Textfield
						variant="outlined"
						bind:value={email}
						label="Email"
						type="email"
						class="w-full"
						input$autocomplete="email"
					>
						<HelperText slot="helper">Digite seu email de administrador</HelperText>
					</Textfield>

					<Textfield
						variant="outlined"
						bind:value={password}
						label="Senha"
						type="password"
						class="w-full"
						input$autocomplete="current-password"
					>
						<HelperText slot="helper">Digite sua senha</HelperText>
					</Textfield>

					{#if errorMessage}
						<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
							{errorMessage}
						</div>
					{/if}

					{#if loading}
						<LinearProgress indeterminate />
					{/if}

					<div class="flex justify-center">
						<Button variant="raised" type="submit" disabled={loading} class="w-full">
							{loading ? 'Entrando...' : 'Entrar'}
						</Button>
					</div>
				</form>
			</Content>
			<Actions class="px-6 pb-6 pt-0">
				<div class="w-full flex justify-between items-center">
					<Button href="/" variant="text">← Voltar</Button>
					<Button href="/admin/register" variant="text">Registrar</Button>
				</div>
			</Actions>
		</Card>
	</div>
</div>
