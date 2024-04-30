import { SongLinkRegex } from '$lib/regex';
import { trackNotFound } from '$lib/server/responses';
import { getISRC } from '$lib/server/spotify';
import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, locals }) => {
	if (!params.songLink) {
		return trackNotFound('not given');
	}
	console.log(params.service);
	const match = params.songLink.match(SongLinkRegex);
	if (!match) {
		return trackNotFound(params.songLink);
	}
	const trackId = match[1];

	const isrc = await getISRC(trackId, locals.accessToken || '');
	return redirect(301, `/lyrics/${isrc}/${params.service || 'spotify'}`);
};
