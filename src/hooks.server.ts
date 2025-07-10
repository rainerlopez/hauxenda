import type { Handle } from '@sveltejs/kit';

// Paraglide middleware removed - not configured in project
// const handleParaglide: Handle = ({ event, resolve }) =>
// 	paraglideMiddleware(event.request, ({ request, locale }) => {
// 		event.request = request;
// 		return resolve(event, {
// 			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
// 		});
// 	});

// Default handle - no middleware
export const handle: Handle = ({ event, resolve }) => {
	return resolve(event);
};
