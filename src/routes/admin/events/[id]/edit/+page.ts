import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { supabase } from '$lib/supabaseClient';

export const load: PageLoad = async ({ params }) => {
	const { id } = params;

	// Buscar o evento pelo ID
	const { data: event, error: eventError } = await supabase
		.from('events')
		.select('*')
		.eq('id', id)
		.single();

	if (eventError) {
		console.error('Erro ao buscar evento:', eventError);
		throw error(404, 'Evento não encontrado');
	}

	return {
		event
	};
};
