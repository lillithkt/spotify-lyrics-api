import getLyrics, { getRawLyrics } from '$lib/server/lyrics';
import { noAuthToken, trackNotFound } from '$lib/server/responses';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals, params, url }) => {
	if (!locals.accessToken) {
		return noAuthToken();
	}
	if (!params.trackId) {
		return trackNotFound('not given');
	}

	const keepMeta = url.searchParams.has('meta');
	const raw = url.searchParams.has('rawLyrics');

	try {
		if (raw) {
			return json(await getRawLyrics(params.trackId, locals.accessToken));
		}
		return json(await getLyrics(params.trackId, locals.accessToken, keepMeta));
	} catch (e) {
		return trackNotFound(params.trackId);
	}
};
