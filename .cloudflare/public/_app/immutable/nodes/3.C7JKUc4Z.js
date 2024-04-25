import{s as m,n as o}from"../chunks/scheduler.BUtQ6AGX.js";import{S as h,i as L,e as l,c as y,d as p,g as c,n as g,j as d,o as u,b as _,f as N,k as f}from"../chunks/index.COp9-3vz.js";import{e as E}from"../chunks/each.D6YF6ztN.js";const T=`// Get with /lyrics/:trackId/?meta
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
`;function S(i,e,s){const t=i.slice();return t[0]=e[s],t}function b(i){let e,s;return{c(){e=l("pre"),s=_(i[0])},l(t){e=y(t,"PRE",{});var n=p(e);s=N(n,i[0]),n.forEach(c)},m(t,n){d(t,e,n),f(e,s)},p:o,d(t){t&&c(e)}}}function v(i){let e,s=E(T.split(`
`)),t=[];for(let n=0;n<s.length;n+=1)t[n]=b(S(i,s,n));return{c(){e=l("div");for(let n=0;n<t.length;n+=1)t[n].c();this.h()},l(n){e=y(n,"DIV",{class:!0});var a=p(e);for(let r=0;r<t.length;r+=1)t[r].l(a);a.forEach(c),this.h()},h(){g(e,"class","root")},m(n,a){d(n,e,a);for(let r=0;r<t.length;r+=1)t[r]&&t[r].m(e,null)},p:o,i:o,o,d(n){n&&c(e),u(t,n)}}}class w extends h{constructor(e){super(),L(this,e,null,v,m,{})}}export{w as component};
