// Get with /lyrics/:trackId/?meta
export type SpotifyLyricsMeta = {
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
export type PartialSpotifyLyricsMeta = {
	lyrics: Partial<SpotifyLyricsMeta['lyrics']>;
	colors?: Partial<SpotifyLyricsMeta['colors']>;
	hasVocalRemoval?: boolean;
};

// Internal use only. Cannot be used in the API.
export type RawSpotifyLyricsNoMeta = {
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
export type RawSpotifyLyrics = RawSpotifyLyricsNoMeta & SpotifyLyricsMeta;
