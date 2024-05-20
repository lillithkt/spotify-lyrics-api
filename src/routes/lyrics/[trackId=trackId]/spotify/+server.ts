import { noAuthToken, trackNotFound } from '$lib/server/responses';
import getLyrics, { getRawLyrics } from '$lib/server/spotify';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, locals, url }) => {
	if (!locals.accessToken) {
		return noAuthToken();
	}

	const raw = url.searchParams.has('rawLyrics');

	try {
		if (raw) {
			return json(await getRawLyrics(params.trackId as string, locals.accessToken));
		}
		return json(await getLyrics(params.trackId as string, locals.accessToken));
	} catch (e) {
		return trackNotFound(params.trackId as string);
	}
};
