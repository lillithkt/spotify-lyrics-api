import { error } from '@sveltejs/kit';

export const noAuthToken = () => error(401, 'No Auth Token on server');
export const trackNotFound = (trackId: string) => error(404, `Track ${trackId} not found`);
export const serverError = (message: string, errorObj: unknown) =>
	error(
		500,
		JSON.stringify({
			message,
			error: errorObj
		})
	);
