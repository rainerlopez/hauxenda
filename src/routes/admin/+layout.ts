import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { supabase } from '$lib/supabaseClient';

export const load: LayoutLoad = async ({ url }) => {
	// Não verificar autenticação na página de login ou registro
	if (url.pathname === '/admin/login' || url.pathname === '/admin/register') {
		return {};
	}

	// Verificar se o usuário está autenticado
	const { data } = await supabase.auth.getSession();
	
	if (!data.session) {
		// Se não estiver autenticado, redirecionar para a página de login
		throw redirect(303, '/admin/login');
	}

	// Se estiver autenticado, retornar os dados do usuário
	return {
		user: data.session.user
	};
};
