export type BeautifulLyricsStatic = {
	Type: 'Static';
	Lines: {
		Text: string;
	}[];
};

export type BeautifulLyricsLine = {
	StartTime: number;
	EndTime: number;
	Type: 'Line';
	Content: {
		Type: 'Vocal';
		OppositeAligned: boolean;
		Text: string;
		StartTime: number;
		EndTime: number;
	}[];
};

export type BeautifulLyricsSyllableGroup = {
	Text: string;
	IsPartOfWord: boolean;
	StartTime: number;
	EndTime: number;
};

export type BeautifulLyricsSyllable = {
	StartTime: number;
	EndTime: number;
	Type: 'Syllable';
	Content: {
		Type: 'Vocal';
		OppositeAligned: boolean;
		Lead?: {
			Syllables: BeautifulLyricsSyllableGroup[];
			StartTime: number;
			EndTime: number;
		};
		Background?: {
			Syllables: BeautifulLyricsSyllableGroup[];
			StartTime: number;
			EndTime: number;
		}[]; // Yes, this is an array. Yes, lead is not an array. Why? who knows
	}[];
};

export type BeautifulLyrics = BeautifulLyricsStatic | BeautifulLyricsLine | BeautifulLyricsSyllable;
