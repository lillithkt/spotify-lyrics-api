<script lang="ts">
	import types from '$lib/types/Lyrics?raw';
	import { onMount } from 'svelte';
</script>

<div class="root">
	{#each types.split('\n') as type}
		<pre>{type}</pre>
	{/each}
</div>
