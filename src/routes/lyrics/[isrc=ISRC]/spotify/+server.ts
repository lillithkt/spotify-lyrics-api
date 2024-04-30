import { noAuthToken, trackNotFound } from '$lib/server/responses';
import getLyrics, { getRawLyrics } from '$lib/server/spotify';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, locals, url }) => {
	const { isrc } = params;
	const res = await fetch('https://api.spotify.com/v1/search?type=track&q=isrc:' + isrc, {
		headers: {
			Authorization: 'Bearer ' + locals.accessToken
		}
	});
	if (!res.ok) {
		return error(res.status, 'Track not found');
	}
	const data = await res.json();
	if (data?.tracks?.items?.length) {
		const trackId = data.tracks.items[0].id;
		if (!locals.accessToken) {
			return noAuthToken();
		}

		const raw = url.searchParams.has('rawLyrics');

		try {
			if (raw) {
				return json(await getRawLyrics(trackId, locals.accessToken));
			}
			return json(await getLyrics(trackId, locals.accessToken));
		} catch (e) {
			return trackNotFound(trackId);
		}
	}
	return error(404, 'Track not found');
};
