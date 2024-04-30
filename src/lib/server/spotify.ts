import type { Lyrics } from '$lib/types/Lyrics';
import type { RawSpotifyLyrics } from '$lib/types/Lyrics/Spotify';
import baseHeaders from './request/headers';

export async function getSong(id: string, accessToken: string) {
	return await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
		headers: {
			...baseHeaders,
			authorization: `Bearer ${accessToken}`
		}
	}).then((res) => res.json());
}

export async function getISRC(id: string, accessToken: string) {
	const song = await getSong(id, accessToken);
	return song.external_ids.isrc;
}

export async function getRawLyrics(
	trackId: string,
	accessToken: string
): Promise<RawSpotifyLyrics> {
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

export default async function getLyrics(trackId: string, accessToken: string): Promise<Lyrics> {
	const raw = await getRawLyrics(trackId, accessToken);
	if (['UNSYNCED', 'LINE_SYNCED'].includes(raw.lyrics.syncType)) {
		raw.lyrics.syncType = 'LINE_SYNCED';
	}
	switch (raw.lyrics.syncType) {
		case 'UNSYNCED':
			return {
				syncType: 'UNSYNCED',
				lines: raw.lyrics.lines.map((line) => {
					return {
						opposite: false,
						text: line.words === '' ? '♪' : line.words
					};
				})
			};

		case 'LINE_SYNCED': {
			const hasEndTimes = raw.lyrics.lines.every((line) => line.endTimeMs !== '0');
			if (!hasEndTimes) {
				return {
					syncType: 'LINE_SYNCED',
					lines: raw.lyrics.lines.map((line) => {
						return {
							opposite: false,
							start: Number(line.startTimeMs),
							text: line.words === '' ? '♪' : line.words
						};
					})
				};
			} else {
				return {
					syncType: 'LINE_SYNCED',
					lines: raw.lyrics.lines.map((line) => {
						return {
							opposite: false,
							start: Number(line.startTimeMs),
							text: line.words === '' ? '♪' : line.words,
							end: Number(line.endTimeMs)
						};
					})
				};
			}
		}
	}
}

export async function isrcToSpotify(isrc: string, accessToken: string) {
	const res = await fetch('https://api.spotify.com/v1/search?type=track&q=isrc:' + isrc, {
		headers: {
			Authorization: 'Bearer ' + accessToken
		}
	});
	if (!res.ok) {
		return null;
	}
	const data = await res.json();
	if (data?.tracks?.items?.length) {
		return data.tracks.items[0].id;
	}
	return null;
}
