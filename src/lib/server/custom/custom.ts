import type { Lyrics } from '$lib/types/Lyrics';

export const custom = Object.fromEntries(
	Object.entries(
		import.meta.glob('./songs/*.json', {
			eager: true,
			import: 'default'
		}) as Record<string, Lyrics>
	).map(([key, value]) => [key.replace(/\.json$/, '').replace(/\.\/songs\//, ''), value])
);
