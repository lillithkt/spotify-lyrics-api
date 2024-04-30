import getBeautifulLyrics, { getRawBeautifulLyrics } from '$lib/server/beautiful';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, url }) => {
	const { isrc } = params;
	const raw = url.searchParams.has('rawLyrics');
	try {
		if (raw) {
			return json(await getRawBeautifulLyrics(isrc as string));
		} else {
			return json(await getBeautifulLyrics(isrc as string));
		}
	} catch (e) {
		return error(500, 'Failed to get lyrics');
	}
};
