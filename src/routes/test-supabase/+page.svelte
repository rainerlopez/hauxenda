<script lang="ts">
	import { onMount } from 'svelte'
	import { supabase } from '$lib/supabaseClient'
	import Button from '@smui/button'
	
	let connectionStatus: string = 'Testing...'
	let dbTables: string[] = []
	let error: string = ''

	onMount(async () => {
		try {
			// Test basic connection
			const { data, error: supabaseError } = await supabase
				.from('eventos')
				.select('*')
				.limit(1)

			if (supabaseError) {
				if (supabaseError.message.includes('relation "eventos" does not exist')) {
					connectionStatus = '✅ Connected! (Tables not created yet)'
					error = 'Database connected but eventos table not found. This is expected for initial setup.'
				} else {
					connectionStatus = '❌ Connection Error'
					error = supabaseError.message
				}
			} else {
				connectionStatus = '✅ Connected and Ready!'
				console.log('Supabase connection successful:', data)
			}

			// Test auth
			const { data: { user } } = await supabase.auth.getUser()
			console.log('Current user:', user)

		} catch (err) {
			connectionStatus = '❌ Connection Failed'
			error = err instanceof Error ? err.message : 'Unknown error'
			console.error('Supabase test error:', err)
		}
	})

	async function testConnection() {
		connectionStatus = 'Testing...'
		error = ''
		
		try {
			const { data, error: testError } = await supabase
				.from('eventos')
				.select('count', { count: 'exact' })

			if (testError) {
				connectionStatus = '❌ Table Access Error'
				error = testError.message
			} else {
				connectionStatus = '✅ Database Ready!'
				console.log('Events count:', data)
			}
		} catch (err) {
			connectionStatus = '❌ Test Failed'
			error = err instanceof Error ? err.message : 'Unknown error'
		}
	}
</script>

<svelte:head>
	<title>Supabase Connection Test - Hauxenda</title>
</svelte:head>

<div class="container mx-auto p-4 max-w-2xl">
	<h1 class="text-3xl font-bold mb-6 text-center">🔗 Supabase Connection Test</h1>
	
	<div class="bg-white rounded-lg shadow-lg p-6 mb-6">
		<h2 class="text-xl font-semibold mb-4">Connection Status</h2>
		<p class="text-lg mb-4">{connectionStatus}</p>
		
		{#if error}
			<div class="bg-red-50 border border-red-200 rounded p-4 mb-4">
				<h3 class="font-semibold text-red-800 mb-2">Error Details:</h3>
				<p class="text-red-700 text-sm">{error}</p>
			</div>
		{/if}

		<div class="flex gap-4">
			<Button on:click={testConnection} variant="raised">
				🧪 Test Connection
			</Button>
			
			<Button href="/" variant="outlined">
				← Back to Home
			</Button>
		</div>
	</div>

	<div class="bg-blue-50 border border-blue-200 rounded p-4">
		<h3 class="font-semibold text-blue-800 mb-2">📋 Setup Checklist:</h3>
		<ul class="text-blue-700 text-sm space-y-1">
			<li>✅ Supabase client configured</li>
			<li>🔄 Environment variables set in Vercel</li>
			<li>⏳ Database tables creation (next step)</li>
		</ul>
	</div>
</div>

<style>
	.container {
		min-height: 80vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
</style>
