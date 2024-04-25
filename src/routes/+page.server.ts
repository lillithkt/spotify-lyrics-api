import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	return {
		accessToken: !!locals.accessToken,
		accessTokenExpiration: locals.accessTokenExpiration
	};
};
