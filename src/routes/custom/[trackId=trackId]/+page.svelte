<script lang="ts">
	import { page } from '$app/stores';
	import type { Lyrics, LyricsLineSynced, LyricsUnsynced } from '$lib/types/Lyrics';
	import { onMount } from 'svelte';

	let lyricsError: Error | null = $state(null);
	let textLyricsRequired: boolean = $state(false);
	let textLyrics = $state('');
	let origLyrics: Lyrics | null = $state(null);
	let modifiedLyrics: Lyrics | null = $state(null);

	let mp3File: File | null = $state(null);
	let mp3FileUrl = $derived.by(() => {
		return mp3File ? URL.createObjectURL(mp3File) : null;
	});
	let audioElement: HTMLAudioElement | null = $state(null);

	let lineIndex = $state(0);

	let startCountdownNumber = $state(3);
	let startingCountdown = $state(false);
	let started = $state(false);

	let done = $state(false);

	function handleFileChange(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (file && file.type === 'audio/mpeg') {
			mp3File = file;
		} else {
			alert('Please upload a valid MP3 file.');
		}
	}

	function convertUnsyncedToSynced() {
		if (origLyrics) {
			const lines = (origLyrics as LyricsUnsynced).lines.map((line) => ({
				text: line.text,
				opposite: false
			}));
			origLyrics = {
				syncType: 'LINE_SYNCED',
				lines: lines.map((line) => ({ text: line.text, opposite: false, start: 0, end: 0 }))
			};
			modifiedLyrics = JSON.parse(JSON.stringify(origLyrics));
		}
	}

	onMount(async () => {
		document.addEventListener('keydown', (event) => {
			if (event.key === ' ') {
				onSpacePress();
				document.querySelector('.current')?.scrollIntoView();
				event.preventDefault();
			}
		});
		try {
			const res = await fetch(`/lyrics/${$page.params.trackId}`);
			const data = await res.json();
			if (!data) {
				textLyricsRequired = true;
				return;
			}
			origLyrics = data;
			convertUnsyncedToSynced();
		} catch (error) {
			lyricsError = error as Error;
		}
	});

	function reset() {
		if (audioElement) {
			audioElement.pause();
			audioElement.currentTime = 0;
		}
		done = false;
		started = false;
		startingCountdown = false;
		startCountdownNumber = 3;
		lineIndex = 0;
	}
	function start() {
		if (audioElement) {
			startingCountdown = true;

			const int = setInterval(() => {
				if (startCountdownNumber > 0) {
					startCountdownNumber--;
				} else {
					clearInterval(int);
					started = true;
					audioElement?.play();
				}
			}, 1000);
		}
	}

	function stop() {
		if (audioElement) {
			audioElement.pause();
			reset();
			done = true;
		}
	}

	function onSpacePress() {
		if (audioElement && started) {
			// as milliseconds
			lineIndex++;
			(modifiedLyrics as LyricsLineSynced).lines[lineIndex].start = Math.floor(
				audioElement.currentTime * 1000
			);
		}
	}
</script>

<div>
	{#if textLyricsRequired && !origLyrics}
		<p>Text lyrics required</p>
		<textarea bind:value={textLyrics}></textarea>
		<button
			onclick={() => {
				origLyrics = {
					syncType: 'UNSYNCED',
					lines: textLyrics.split('\n').map((line) => ({ text: line, opposite: false }))
				};
				convertUnsyncedToSynced();
			}}>Save</button
		>
	{:else if origLyrics}
		<p>Lyrics loaded</p>
		{#if origLyrics?.syncType !== 'UNSYNCED'}
			<p>These lyrics are already synced</p>
		{/if}
		<p>Changing from unsynced lyrics to line synced</p>
		<p>Input MP3</p>
		<input type="file" accept="audio/mp3" onchange={handleFileChange} />
		{#if mp3FileUrl}
			<p>Audio file ready to play:</p>
			<audio bind:this={audioElement}>
				<source src={mp3FileUrl} type="audio/mpeg" />
			</audio>

			{#if !started && !startingCountdown}
				<button onclick={start}>Start</button>
			{:else if startingCountdown}
				<p>Starting in {startCountdownNumber}...</p>
			{/if}
			<button onclick={reset}>Reset</button>
			{#if started}
				<button onclick={stop}>Stop</button>
			{/if}
			{#if !done}
				<div class="lyrics">
					{#each (origLyrics as LyricsUnsynced).lines as line, i}
						<div class:current={i === lineIndex}>
							{line.text}
						</div>
					{/each}
				</div>
			{:else}
				<p>Done!</p>
				<p>Here is your finished lyrics json:</p>
				<pre>{JSON.stringify(modifiedLyrics, null, 2)}</pre>
			{/if}
		{/if}
	{:else if lyricsError}
		<p>{lyricsError.message}</p>
		<pre>{lyricsError.stack}</pre>
	{:else}
		<p>Loading lyrics...</p>
	{/if}
</div>

<style>
	.lyrics {
		display: flex;
		flex-direction: column;
	}
	.lyrics div {
		padding: 0.5rem;
	}
	.lyrics div.current {
		background-color: #f0f0f0;
	}
	.lyrics div.ongoing {
		background-color: #f0f000;
	}
</style>
