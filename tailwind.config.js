import { skeleton } from '@skeletonlabs/tw-plugin';

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		// Adiciona os arquivos do Skeleton UI para processamento do Tailwind
		require('path').join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {}
	},
	plugins: [
		// Adiciona o plugin do Skeleton UI
		skeleton({
			themes: { preset: ['cerberus'] }
		})
	]
};
