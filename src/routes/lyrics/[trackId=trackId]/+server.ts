import getAnyLyrics from '$lib/server/any';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, locals, url }) => {
	const raw = url.searchParams.has('rawLyrics');
	console.log('a');
	if (!locals.accessToken) {
		console.log(locals);
		return error(401, 'No access token');
	}
	try {
		return json(await getAnyLyrics(params.trackId as string, locals.accessToken!, raw));
	} catch (e) {
		return error(500, 'Failed to get lyrics');
	}
};
