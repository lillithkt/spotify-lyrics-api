import type { Lyrics } from '$lib/types/Lyrics';
import type { BeautifulLyrics } from '$lib/types/Lyrics/Beautiful';

export async function getRawBeautifulLyrics(isrc: string): Promise<BeautifulLyrics> {
	const res = await fetch(`https://beautiful-lyrics.socalifornian.live/lyrics/${isrc}`);
	return res.json();
}

function toMs(seconds: number): number {
	return seconds * 1000;
}

export default async function getBeautifulLyrics(isrc: string): Promise<Lyrics> {
	const raw = await getRawBeautifulLyrics(isrc);
	switch (raw.Type) {
		case 'Static':
			return {
				syncType: 'UNSYNCED',
				lines: raw.Lines.map((line) => ({
					opposite: false,
					text: line.Text === '' ? '♪' : line.Text
				}))
			};

		case 'Line': {
			return {
				syncType: 'LINE_SYNCED',
				lines: raw.VocalGroups.map((line) => ({
					opposite: line.OppositeAligned,
					start: toMs(line.StartTime),
					text: line.Text,
					end: toMs(line.EndTime)
				}))
			};
		}

		case 'Syllable': {
			return {
				syncType: 'SYLLABLE_SYNCED',
				lines: raw.VocalGroups.map((line) => ({
					opposite: line.OppositeAligned,
					start: toMs(line.StartTime),
					lead: line.Lead?.map((group) => ({
						words: group.Text,
						part: group.IsPartOfWord,
						start: toMs(group.StartTime),
						end: toMs(group.EndTime)
					})),
					background: line.Background?.map((group) => ({
						words: group.Text,
						part: group.IsPartOfWord,
						start: toMs(group.StartTime),
						end: toMs(group.EndTime)
					})),
					end: toMs(line.EndTime)
				}))
			};
		}
	}
}
