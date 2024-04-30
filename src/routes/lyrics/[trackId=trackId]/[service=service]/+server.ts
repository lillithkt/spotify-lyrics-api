import { getISRC } from '$lib/server/spotify';
import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals, params }) => {
	const isrc = await getISRC(params.trackId || '', locals.accessToken || '');
	return redirect(301, `/lyrics/${isrc}/${params.service || 'spotify'}`);
};
