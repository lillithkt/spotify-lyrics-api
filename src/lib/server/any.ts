import type { Lyrics } from '$lib/types/Lyrics';
import type { BeautifulLyrics } from '$lib/types/Lyrics/Beautiful';
import type { RawSpotifyLyrics } from '$lib/types/Lyrics/Spotify';
import getBeautifulLyrics, { getRawBeautifulLyrics } from './beautiful';
import { custom } from './custom/custom';
import getLyrics, { getRawLyrics } from './spotify';

export default async function getAnyLyrics(
	trackId: string,
	accessToken: string
): Promise<Lyrics | null>;
export default async function getAnyLyrics(
	trackId: string,
	accessToken: string,
	raw: boolean
): Promise<Lyrics | RawSpotifyLyrics | BeautifulLyrics | null>;
export default async function getAnyLyrics(
	trackId: string,
	accessToken: string,
	raw: boolean = false
): Promise<Lyrics | RawSpotifyLyrics | BeautifulLyrics | null> {
	if (custom[trackId]) {
		return custom[trackId];
	}
	try {
		if (raw) {
			return await getRawBeautifulLyrics(trackId, accessToken);
		} else {
			return await getBeautifulLyrics(trackId, accessToken);
		}
	} catch (e) {
		try {
			if (raw) {
				return await getRawLyrics(trackId, accessToken);
			} else {
				return await getLyrics(trackId, accessToken);
			}
		} catch (e) {
			return null;
		}
	}
}
