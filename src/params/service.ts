import type { ParamMatcher } from '@sveltejs/kit';
export const match: ParamMatcher = (param) => {
	return ['spotify', 'beautiful'].includes(param);
};
