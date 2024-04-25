import { SPOTIFY_COOKIE } from '$env/static/private';
import baseHeaders from '$lib/server/request/headers';
import type { AccessTokenAPIData } from '$lib/types/Auth';
import type { Handle } from '@sveltejs/kit';

let AuthData: AccessTokenAPIData | null = null;

const dc = SPOTIFY_COOKIE.startsWith('sp_dc=') ? SPOTIFY_COOKIE : `sp_dc=${SPOTIFY_COOKIE}`;

async function getAccessToken() {
	try {
		const data: AccessTokenAPIData = await fetch('https://open.spotify.com/get_access_token', {
			headers: {
				...baseHeaders,
				Cookie: dc
			}
		}).then((res) => res.json());
		if (data.accessToken) {
			AuthData = data;
		}
	} catch (e) {
		console.error(e);
	}
}

export const handle: Handle = async ({ event, resolve }) => {
	if (!AuthData || AuthData.accessTokenExpirationTimestampMs <= Date.now()) {
		await getAccessToken();
	}

	if (AuthData?.accessToken) {
		event.locals.accessToken = AuthData.accessToken;
	}
	if (AuthData?.accessTokenExpirationTimestampMs) {
		event.locals.accessTokenExpiration = AuthData.accessTokenExpirationTimestampMs;
	}

	const response = await resolve(event);
	response.headers.append('Access-Control-Allow-Origin', '*');
	response.headers.append('Access-Control-Allow-Methods', 'GET, OPTIONS');
	response.headers.append('Access-Control-Allow-Headers', 'Content-Type');
	return response;
};
