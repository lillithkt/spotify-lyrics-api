// Get with /lyrics/:trackId/?meta
export type LyricsMeta = {
	lyrics: {
		provider: string;
		providerLyricsId: string;
		providerDisplayName: string;
		syncLyricsUri: string;
		isDenseTypeface: boolean;
		alternatives: unknown[];
		language: string;
		isRtlLanguage: boolean;
		fullscreenAction: 'FULLSCREEN_LYRICS';
		showUpsell: boolean;
		capStatus: 'NONE';
		impressionsRemaining: number;
	};
	colors: {
		background: number;
		text: number;
		highlightText: number;
	};
	hasVocalRemoval: boolean;
};

// Internal use only. Cannot be used in the API.
export type PartialLyricsMeta = {
	lyrics: Partial<LyricsMeta['lyrics']>;
	colors?: Partial<LyricsMeta['colors']>;
	hasVocalRemoval?: boolean;
};

// Internal use only. Cannot be used in the API.
export type RawLyricsNoMeta = {
	lyrics: {
		syncType: 'LINE_SYNCED' | 'UNSYNCED';
		lines: {
			startTimeMs: string;
			words: string;
			syllables: string[];
			endTimeMs: string;
		}[];
	};
};

// /lyrics/:trackId/?rawLyrics
export type RawLyrics = RawLyricsNoMeta & LyricsMeta;

// Currently only used to tell if anything funky happened in the backend
export type Commented = {
	comment?: string;
};

/**
 * The Three below are returned depending on the syncType of the lyrics
 */

// Given when the syncType is 'UNSYNCED'
export type LyricsUnsynced = {
	lyrics: {
		syncType: 'UNSYNCED';
		lines: {
			words: string;
		}[];
	};
} & Commented;

// Given when the syncType is 'LINE_SYNCED' and no endTimeMs is given
export type LyricsLineSyncedNoEndTimes = {
	lyrics: {
		syncType: 'LINE_SYNCED';
		lines: {
			startTimeMs: string;
			words: string;
		}[];
	};
} & Commented;

// Given when the syncType is 'LINE_SYNCED' and endTimeMs is given
export type LyricsLineSyncedEndTimes = {
	lyrics: {
		syncType: 'LINE_SYNCED';
		lines: {
			startTimeMs: string;
			words: string;
			endTimeMs: string;
		}[];
	};
} & Commented;

export type LyricsLineSynced = LyricsLineSyncedNoEndTimes | LyricsLineSyncedEndTimes;

export type Lyrics = LyricsUnsynced | LyricsLineSynced;
export type LyricsWithMeta = Lyrics & LyricsMeta;
