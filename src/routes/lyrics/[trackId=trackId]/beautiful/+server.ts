import getBeautifulLyrics, { getRawBeautifulLyrics } from '$lib/server/beautiful';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, url, locals }) => {
	const raw = url.searchParams.has('rawLyrics');
	try {
		if (raw) {
			return json(await getRawBeautifulLyrics(params.trackId as string, locals.accessToken!));
		} else {
			return json(await getBeautifulLyrics(params.trackId as string, locals.accessToken!));
		}
	} catch (e) {
		return error(500, 'Failed to get lyrics');
	}
};
