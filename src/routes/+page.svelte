<script lang="ts">
	import type { PageServerData } from './$types';
	import regexes from '$lib/regex?raw';

	export let data: PageServerData;

	const dummySongId = '5hVghJ4KaYES3BFUATCYn0';

	const paths = {
		Lyrics: ['/lyrics/songId', `/lyrics/${dummySongId}`],
		'Lyrics (keep metadata)': ['/lyrics/songId?meta', `/lyrics/${dummySongId}?meta`],
		'Lyrics (raw data from spotify)': [
			'/lyrics/songId?rawLyrics',
			`/lyrics/${dummySongId}?rawLyrics`
		]
	};
</script>

<div class="root">
	<h1>Access Token Exists:</h1>
	<p>{data.accessToken ? 'Yes' : 'No'}</p>
	<h1>Expiration:</h1>
	<p>{data.accessTokenExpiration}</p>
	<br />
	<br />

	<h1>Paths:</h1>
	{#each Object.entries(paths) as [name, [path, example]]}
		<h2>{name}</h2>
		<p>{path}</p>
		<a href={example}>Example</a>
	{/each}

	<h1>songId Parameter</h1>
	<p>SongId can match a song's id, a song's spotify url, and a song's media player url</p>
	<p>The regexes used to match these are the following:</p>
	<code
		>{#each regexes.split('\n') as line}
			<pre>{line}</pre>
		{/each}
	</code>

	<a href="/types"><h1>Server Response Types</h1></a>
</div>
