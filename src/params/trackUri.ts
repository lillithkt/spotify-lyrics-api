import { TrackUriRegex } from '$lib/regex';
import type { ParamMatcher } from '@sveltejs/kit';
export const match: ParamMatcher = (param) => {
	return TrackUriRegex.test(param);
};
