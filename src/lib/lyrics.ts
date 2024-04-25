import type {
	Commented,
	Lyrics,
	LyricsLineSyncedEndTimes,
	LyricsLineSyncedNoEndTimes,
	LyricsWithMeta,
	PartialLyricsMeta,
	RawLyrics,
	RawLyricsNoMeta
} from './types/Lyrics';

type SomewhatRawLyrics = (RawLyrics & Commented) | Lyrics | LyricsWithMeta;

export function filterMeta(lyrics: RawLyrics): RawLyricsNoMeta {
	const workingLyrics: RawLyricsNoMeta & PartialLyricsMeta = lyrics;
	delete workingLyrics.lyrics.provider;
	delete workingLyrics.lyrics.providerLyricsId;
	delete workingLyrics.lyrics.providerDisplayName;
	delete workingLyrics.lyrics.syncLyricsUri;
	delete workingLyrics.lyrics.isDenseTypeface;
	delete workingLyrics.lyrics.alternatives;
	delete workingLyrics.lyrics.language;
	delete workingLyrics.lyrics.isRtlLanguage;
	delete workingLyrics.lyrics.fullscreenAction;
	delete workingLyrics.lyrics.showUpsell;
	delete workingLyrics.lyrics.capStatus;
	delete workingLyrics.lyrics.impressionsRemaining;

	delete workingLyrics.colors;
	delete workingLyrics.hasVocalRemoval;
	return lyrics;
}

export default function filterLyrics(lyrics: RawLyrics): Lyrics;
export default function filterLyrics(lyrics: RawLyrics, keepMeta: false): Lyrics;
export default function filterLyrics(lyrics: RawLyrics, keepMeta: true): LyricsWithMeta;
export default function filterLyrics(lyrics: RawLyrics, keepMeta: boolean): Lyrics | LyricsWithMeta;
export default function filterLyrics(
	lyrics: RawLyrics,
	keepMeta: boolean = false
): Lyrics | LyricsWithMeta {
	let workingLyrics: SomewhatRawLyrics = lyrics;

	if (!keepMeta) {
		workingLyrics = filterMeta(workingLyrics) as Lyrics;
	}

	switch (lyrics.lyrics.syncType) {
		case 'UNSYNCED': {
			workingLyrics.lyrics.lines = workingLyrics.lyrics.lines.map((line) => ({
				words: line.words
			}));
			break;
		}
		case 'LINE_SYNCED': {
			const hasEndTimes = lyrics.lyrics.lines.reduce(
				(acc, line) => acc && line.endTimeMs !== '0',
				true
			);
			if (hasEndTimes) {
				workingLyrics.lyrics.lines = (workingLyrics as LyricsLineSyncedEndTimes).lyrics.lines.map(
					(line) => ({
						startTimeMs: line.startTimeMs,
						words: line.words,
						endTimeMs: line.endTimeMs
					})
				);
			} else {
				workingLyrics.lyrics.lines = (workingLyrics as LyricsLineSyncedNoEndTimes).lyrics.lines.map(
					(line) => ({
						startTimeMs: line.startTimeMs,
						words: line.words
					})
				);
			}
			break;
		}

		default: {
			workingLyrics.comment =
				'Unknown sync type. Please report this to imlvna on github with the song id so i can impliment it!';
			break;
		}
	}

	return workingLyrics as Lyrics | LyricsWithMeta;
}
