<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';
	import Button from '@smui/button';
	import Textfield from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';
	import Card, { Content, Actions } from '@smui/card';
	import LinearProgress from '@smui/linear-progress';

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

<div class="flex items-center justify-center min-h-screen bg-gray-100">
	<div class="w-full max-w-md p-4">
		<Card class="w-full">
			<Content class="p-6">
				<h1 class="text-2xl font-bold text-center mb-6">👤 Registrar Admin</h1>

				<form on:submit|preventDefault={handleRegister} class="space-y-4">
					<Textfield
						variant="outlined"
						bind:value={name}
						label="Nome Completo"
						type="text"
						class="w-full"
						input$autocomplete="name"
					>
						<HelperText slot="helper">Digite seu nome completo</HelperText>
					</Textfield>

					<Textfield
						variant="outlined"
						bind:value={email}
						label="Email"
						type="email"
						class="w-full"
						input$autocomplete="email"
					>
						<HelperText slot="helper">Digite seu email</HelperText>
					</Textfield>

					<Textfield
						variant="outlined"
						bind:value={password}
						label="Senha"
						type="password"
						class="w-full"
						input$autocomplete="new-password"
					>
						<HelperText slot="helper">Mínimo de 6 caracteres</HelperText>
					</Textfield>

					<Textfield
						variant="outlined"
						bind:value={confirmPassword}
						label="Confirmar Senha"
						type="password"
						class="w-full"
						input$autocomplete="new-password"
					>
						<HelperText slot="helper">Digite a senha novamente</HelperText>
					</Textfield>

					{#if errorMessage}
						<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
							{errorMessage}
						</div>
					{/if}

					{#if successMessage}
						<div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
							{successMessage}
						</div>
					{/if}

					{#if loading}
						<LinearProgress indeterminate />
					{/if}

					<div class="flex justify-center">
						<Button variant="raised" type="submit" disabled={loading} class="w-full">
							{loading ? 'Registrando...' : 'Registrar'}
						</Button>
					</div>
				</form>
			</Content>
			<Actions class="px-6 pb-6 pt-0">
				<div class="w-full flex justify-center">
					<Button href="/admin/login" variant="text">← Voltar para Login</Button>
				</div>
			</Actions>
		</Card>
	</div>
</div>
