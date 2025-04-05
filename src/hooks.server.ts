import { SPOTIFY_COOKIE } from '$env/static/private';
import baseHeaders from '$lib/server/request/headers';
import type { Handle } from '@sveltejs/kit';

interface AuthData {
	granted_token: {
		token: string;
		expires_after_seconds: number;
		refresh_after_seconds: number;
	};
}
let authData: AuthData | null = null;
const dc = SPOTIFY_COOKIE.startsWith('sp_dc=') ? SPOTIFY_COOKIE : `sp_dc=${SPOTIFY_COOKIE}`;

async function getAccessToken() {
	try {
		const res = await fetch('https://clienttoken.spotify.com/v1/clienttoken', {
			method: 'POST',
			headers: {
				...baseHeaders,
				Cookie: dc
			},
			body: JSON.stringify({
				client_data: {
					client_version: '1.2.62.80.g300c7ef2',
					client_id: 'd8a5ed958d274c2e8ee717e6a4b0971d',
					js_sdk_data: {
						device_brand: 'unknown',
						device_model: 'unknown',
						os: 'windows',
						os_version: 'NT 10.0',
						device_id: '6c7ab6d7708f322663beca112550b45a',
						device_type: 'computer'
					}
				}
			})
		});
		const text = await res.text();
		console.log(text, res.status, res.statusText, res.headers);
		const data: AuthData = JSON.parse(text);
		if (data.granted_token?.token) {
			authData = data;
			setTimeout(() => {
				getAccessToken();
			}, data.granted_token.expires_after_seconds * 1000);
		} else {
			console.error('Failed to get access token');
			console.error(data);
		}
	} catch (e) {
		console.error(e);
	}
}

export const handle: Handle = async ({ event, resolve }) => {
	if (!authData) {
		await getAccessToken();
	}

	if (authData?.granted_token.token) {
		event.locals.accessToken = authData.granted_token.token;
	}
	const response = await resolve(event);
	response.headers.append('Access-Control-Allow-Origin', '*');
	response.headers.append('Access-Control-Allow-Methods', 'GET, OPTIONS');
	response.headers.append('Access-Control-Allow-Headers', 'Content-Type');
	return response;
};
