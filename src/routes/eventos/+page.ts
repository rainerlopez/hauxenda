import type { PageLoad } from './$types';
import { supabase } from '$lib/supabaseClient';

export const load: PageLoad = async () => {
	// Buscar todos os eventos públicos
	const { data: events, error } = await supabase
		.from('eventos')
		.select('*')
		.order('data_evento', { ascending: true });

	if (error) {
		console.error('Erro ao buscar eventos:', error);
		return {
			events: []
		};
	}

	return {
		events: events || []
	};
};
