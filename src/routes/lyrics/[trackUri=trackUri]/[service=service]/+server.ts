import { TrackUriRegex } from '$lib/regex';
import { trackNotFound } from '$lib/server/responses';
import { getISRC } from '$lib/server/spotify';
import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, url, locals }) => {
	if (!params.trackUri) {
		return trackNotFound('not given');
	}
	const match = params.trackUri.match(TrackUriRegex);
	if (!match) {
		return trackNotFound(params.trackUri);
	}
	const trackId = match[1];

	const isrc = await getISRC(trackId, locals.accessToken || '');

	url.pathname = `/lyrics/${isrc}/${params.service || 'spotify'}`;
	return redirect(301, url);
};
