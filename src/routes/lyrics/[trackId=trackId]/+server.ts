import getBeautifulLyrics, { getRawBeautifulLyrics } from '$lib/server/beautiful';
import getLyrics, { getRawLyrics } from '$lib/server/spotify';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, locals, url }) => {
	const raw = url.searchParams.has('rawLyrics');
	try {
		if (raw) {
			return json(await getRawBeautifulLyrics(params.trackId as string, locals.accessToken!));
		} else {
			return json(await getBeautifulLyrics(params.trackId as string, locals.accessToken!));
		}
	} catch (e) {
		try {
			if (raw) {
				return json(await getRawLyrics(params.trackId as string, locals.accessToken as string));
			} else {
				return json(await getLyrics(params.trackId as string, locals.accessToken as string));
			}
		} catch (e) {
			return error(500, 'Failed to get lyrics');
		}
	}
};
