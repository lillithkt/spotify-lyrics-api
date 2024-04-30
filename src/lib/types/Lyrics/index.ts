export type LyricsUnsynced = {
	syncType: 'UNSYNCED';
	lines: {
		opposite: boolean;
		text: string;
	}[];
};

export type LyricsLineSyncedNoEndTimes = {
	syncType: 'LINE_SYNCED';
	lines: {
		opposite: boolean;
		start: number;
		text: string;
	}[];
};

// Given when the syncType is 'LINE_SYNCED' and endTimeMs is given
export type LyricsLineSyncedEndTimes = {
	syncType: 'LINE_SYNCED';
	lines: {
		opposite: boolean;
		start: number;
		text: string;
		end: number;
	}[];
};

export type LyricsLineSynced = LyricsLineSyncedNoEndTimes | LyricsLineSyncedEndTimes;

export type SyllableLyricGroup = {
	words: string;
	part: boolean;
	start: number;
	end: number;
};

export type LyricsSyllableSynced = {
	syncType: 'SYLLABLE_SYNCED';
	lines: {
		opposite: boolean;
		start: number;
		lead?: SyllableLyricGroup[];
		background?: SyllableLyricGroup[];
		end: number;
	}[];
};

export type Lyrics = LyricsUnsynced | LyricsLineSynced | LyricsSyllableSynced;
