export type LyricsUnsynced = {
	syncType: 'UNSYNCED';
	lines: {
		opposite: boolean;
		text: string;
	}[];
};

export type LyricsLineSynced = {
	syncType: 'LINE_SYNCED';
	lines: {
		opposite: boolean;
		start: number;
		text: string;
		end: number;
	}[];
};

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
		background?: {
			groups: SyllableLyricGroup[];
			start: number;
			end: number;
		}[];
		end: number;
	}[];
};

export type Lyrics = LyricsUnsynced | LyricsLineSynced | LyricsSyllableSynced;
