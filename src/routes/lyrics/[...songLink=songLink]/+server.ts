import { SongLinkRegex } from '$lib/regex';
import { trackNotFound } from '$lib/server/responses';
import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, url }) => {
	if (!params.songLink) {
		return trackNotFound('not given');
	}

	const match = params.songLink.match(SongLinkRegex);
	if (!match) {
		return trackNotFound(params.songLink);
	}
	const trackId = match[1];

	const lastParam = url.href.split('/').pop();
	if (['spotify', 'beautiful'].includes(lastParam || '')) {
		return redirect(301, `/lyrics/${trackId}/${lastParam}`);
	}
	return redirect(301, `/lyrics/${trackId}`);
};
