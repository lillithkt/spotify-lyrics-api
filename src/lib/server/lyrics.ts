import filterLyrics from '$lib/lyrics';
import type { Lyrics, LyricsWithMeta, RawLyrics } from '$lib/types/Lyrics';
import baseHeaders from './request/headers';

export async function getRawLyrics(trackId: string, accessToken: string): Promise<RawLyrics> {
	return await fetch(
		`https://spclient.wg.spotify.com/color-lyrics/v2/track/${trackId}?format=json&vocalRemoval=false`,
		{
			headers: {
				...baseHeaders,
				'app-platform': 'WebPlayer',
				authorization: `Bearer ${accessToken}`
			}
		}
	).then((res) => res.json());
}

export default async function getLyrics(trackId: string, accessToken: string): Promise<Lyrics>;
export default async function getLyrics(
	trackId: string,
	accessToken: string,
	keepMeta: true
): Promise<LyricsWithMeta>;
export default async function getLyrics(
	trackId: string,
	accessToken: string,
	keepMeta: false
): Promise<Lyrics>;
export default async function getLyrics(
	trackId: string,
	accessToken: string,
	keepMeta: boolean
): Promise<Lyrics | LyricsWithMeta>;
export default async function getLyrics(
	trackId: string,
	accessToken: string,
	keepMeta: boolean = false
): Promise<Lyrics | LyricsWithMeta> {
	// TypeScript doesn't like the default value being set in the function signature
	return filterLyrics(await getRawLyrics(trackId, accessToken), keepMeta as true);
}
