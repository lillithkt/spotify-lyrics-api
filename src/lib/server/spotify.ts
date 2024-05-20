import type { Lyrics, LyricsLineSynced } from '$lib/types/Lyrics';
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
				const endTimesLines: LyricsLineSynced['lines'] = [];
				let i = 0;
				for (const line of raw.lyrics.lines as Omit<
					(typeof raw.lyrics.lines)[number],
					'endTimeMs'
				>[]) {
					let endTime = -1;
					if (i < raw.lyrics.lines.length - 1) {
						endTime = Number(raw.lyrics.lines[i + 1].startTimeMs);
					}
					endTimesLines.push({
						opposite: false,
						start: Number(line.startTimeMs),
						text: line.words === '' ? '♪' : line.words,
						end: endTime
					});
					i++;
				}
				return {
					syncType: 'LINE_SYNCED',
					lines: endTimesLines
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
