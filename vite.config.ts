import { paraglideVitePlugin } from '@inlang/paraglide-js';
import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
	optimizeDeps: {
		exclude: ['@zag-js/avatar', '@zag-js/file-upload', '@zag-js/pagination', '@zag-js/progress', '@zag-js/slider', '@zag-js/switch', '@zag-js/tags-input', '@zag-js/toast', '@zag-js/combobox', '@zag-js/popover', '@zag-js/tooltip', '@zag-js/dialog', '@zag-js/accordion', '@zag-js/radio-group', '@zag-js/tabs', '@zag-js/rating-group', '@zag-js/core', '@zag-js/types', '@zag-js/utils']
	},
	plugins: [
		tailwindcss(),
		
		sveltekit(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			manifest: {
				name: 'Hauxenda - Gestão de Eventos',
				short_name: 'Hauxenda',
				description: 'PWA simples para gerenciar cerimônias e participantes por Rainer E. Lopez',
				theme_color: '#ff5722',
				background_color: '#ffffff',
				display: 'standalone',
				start_url: '/',
				scope: '/',
				lang: 'pt-BR',
				icons: [
					{
						src: 'pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: 'pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png'
					},
					{
						src: 'pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable'
					}
				]
			}
		}),
		devtoolsJson(),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide'
		})
	],
	test: {
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'client',
					environment: 'browser',
					browser: {
						enabled: true,
						provider: 'playwright',
						instances: [{ browser: 'chromium' }]
					},
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**'],
					setupFiles: ['./vitest-setup-client.ts']
				}
			},
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
