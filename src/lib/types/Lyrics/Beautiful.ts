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
	VocalGroups: {
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
	VocalGroups: {
		Type: 'Vocal';
		OppositeAligned: boolean;
		StartTime: number;
		EndTime: number;
		Lead?: BeautifulLyricsSyllableGroup[];
		Background?: BeautifulLyricsSyllableGroup[];
	}[];
};

export type BeautifulLyrics = BeautifulLyricsStatic | BeautifulLyricsLine | BeautifulLyricsSyllable;
