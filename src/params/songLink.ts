import { SongLinkRegex } from '$lib/regex';
import type { ParamMatcher } from '@sveltejs/kit';
export const match: ParamMatcher = (param) => {
	return SongLinkRegex.test(param);
};
