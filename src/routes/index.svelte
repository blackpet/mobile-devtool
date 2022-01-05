<script>
	import { onMount, tick } from 'svelte';
	import { goto } from '$app/navigation';
	import { appInfo, deviceInfo, initAppBridge } from '../libs/nbridge/app-bridge';
	import UAParser from 'ua-parser-js';

	const uap = new UAParser();
	const ua = { ua: uap.getUA(), os: uap.getOS(), browser: uap.getBrowser() };

	let nbridge;
	let logs = [];
	let url = 'http://naver.com';
	let code; // console code panel
	let version;

	let token; // device token
	let pushData = {
		title: '',
		body: '',
		url: ''
	};

	onMount(() => {
		initNbridge();
	});

	async function log(...args) {
		logs = [...logs, JSON.stringify(args)];

		await tick();
		code.scrollTo(0, code.scrollHeight);

		console.log(...args);
	}

	async function initNbridge() {
		try {
			nbridge = window.nbridge;
			initAppBridge(nbridge);
			console.log('nbridge', nbridge);

			nbridge.setDebugMode(true);
			nbridge.setLogger({ log });
		} catch (err) {
			log('error!!!', err);
		}
	}

	async function getAppInfo() {
		const info = await appInfo();
		log(info);
	}
</script>

<svelte:head>
	<script src="/nbridge-bundle.js"></script>
</svelte:head>

<div class="container mx-auto">
	<div class="h-[50vh] overflow-hidden overflow-y-scroll overflow-x-scroll">
		<h1 class="text-center relative">
			ntoworks App DevTools
			<button
				class="absolute right-0 text-blue-600 bg-blue-100 rounded p-1"
				on:click={() => goto('urls')}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
					/>
				</svg>
			</button>
		</h1>

		<!--getSettingData-->
		<section>
			<button class="btn" on:click={getAppInfo}>appInfo</button>
			<p>Request App Version, AutoLoginYn and PushYn</p>
		</section>

		<!--getTokenData-->
		<section>
			<button class="btn" on:click={deviceInfo}>deviceInfo</button>
			<p>Request Device Token and App Version</p>
		</section>

		<section>
			<h2>User Agent</h2>
			<div class="prose max-w-none">
				<ul>
					<li>ua: {ua.ua}</li>
					<li>
						brwoser
						<ul class="!my-0">
							<li>name: {ua.browser.name}</li>
							<li>version: {ua.browser.version}</li>
							<li>major: {ua.browser.major}</li>
						</ul>
					</li>
					<li>
						os
						<ul class="!my-0">
							<li>name: {ua.os.name}</li>
							<li>version: {ua.os.version}</li>
						</ul>
					</li>
				</ul>
			</div>
		</section>
	</div>
</div>

<code
	class="block w-screen h-[50vh] bg-gray-800 overflow-hidden overflow-y-scroll p-2 text-gray-50 text-xs md:text-base"
	bind:this={code}
>
	{#each logs as log, i}
		<code class="block break-all">#{i}: {log}</code>
	{:else}
		<code class="text-center">NO LOGS YET</code>
	{/each}
</code>

<style>
	input {
		@apply p-2 rounded w-full;
	}
</style>
