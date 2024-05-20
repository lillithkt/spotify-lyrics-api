import type { Lyrics, SyllableLyricGroup } from '$lib/types/Lyrics';
import type { BeautifulLyrics, BeautifulLyricsSyllableGroup } from '$lib/types/Lyrics/Beautiful';

export async function getRawBeautifulLyrics(
	trackId: string,
	accessToken: string
): Promise<BeautifulLyrics> {
	const res = await fetch(`https://beautiful-lyrics.socalifornian.live/lyrics/${trackId}`, {
		headers: {
			Authorization: 'Bearer ' + accessToken
		}
	});
	return res.json();
}

function toMs(seconds: number): number {
	return seconds * 1000;
}

function lyricsGroupToLine(group: BeautifulLyricsSyllableGroup): SyllableLyricGroup;
function lyricsGroupToLine(
	group: BeautifulLyricsSyllableGroup,
	type: 'front' | 'back'
): SyllableLyricGroup & { type: 'front' | 'back' };
function lyricsGroupToLine(
	group: BeautifulLyricsSyllableGroup,
	type?: 'front' | 'back'
): SyllableLyricGroup | (SyllableLyricGroup & { type: 'front' | 'back' }) {
	return {
		...{
			words: group.Text,
			part: group.IsPartOfWord,
			start: toMs(group.StartTime),
			end: toMs(group.EndTime)
		},
		...(type ? { type } : {})
	};
}

export default async function getBeautifulLyrics(
	trackId: string,
	accessToken: string
): Promise<Lyrics> {
	const raw = await getRawBeautifulLyrics(trackId, accessToken);
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
				lines: raw.Content.map((line) => ({
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
				lines: raw.Content.map((line) => {
					let posStart = 0;
					let posEnd = 0;
					let start = 0;
					let end = 0;
					if (line.Background?.length) {
						posStart = toMs(line.Background[0].StartTime);
						posEnd = toMs(line.Background[line.Background.length - 1].EndTime);
					}
					if (line.Lead) {
						start = Math.min(toMs(line.Lead.StartTime), posStart);
						end = Math.max(toMs(line.Lead.EndTime), posEnd);
					} else {
						start = posStart;
						end = posEnd;
					}
					return {
						opposite: line.OppositeAligned,
						start,
						lead: line.Lead?.Syllables.map((lead) => lyricsGroupToLine(lead)),
						background: line.Background?.map((background) => ({
							groups: background.Syllables.map((a) => lyricsGroupToLine(a)),
							start: toMs(background.StartTime),
							end: toMs(background.EndTime)
						})),
						end
					};
				})
			};
		}
	}
}
