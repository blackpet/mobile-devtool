<script>
	import {onMount, tick} from 'svelte';
	import {goto} from '$app/navigation';
	import {
		appInfo,
		clearCache,
		deviceInfo,
		exit,
		goSettings,
		initAppBridge
	} from '../libs/nbridge/app-bridge';
	import UAParser from 'ua-parser-js';
	import {initLinkBridge, openBrowser} from '../libs/nbridge/link-bridge';
	import {
		getPreference,
		initPreferenceBridge,
		removePreference,
		setPreference
	} from '../libs/nbridge/preference-bridge';
	import axios from 'axios';

	const uap = new UAParser();
	const ua = {ua: uap.getUA(), os: uap.getOS(), browser: uap.getBrowser()};

	let nbridge;
	let logs = [];
	let url = 'http://naver.com';

	let code; // console code panel
	let version;

	let token; // device token
	let pushData = {
		message: '',
		foo: '',
		bar: ''
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
			initLinkBridge(nbridge);
			initPreferenceBridge(nbridge);
			console.log('nbridge', nbridge);

			nbridge.setDebugMode(true);
			nbridge.setLogger({log});

			version = (await axios.get('/api/version')).data;
			log('version loaded', version);
		} catch (err) {
			log('error!!!', err);
		}
	}

	async function callNbridge(fn, option = null) {
		const res = await fn(option);
		log('callNbridge', res);
	}

	function linkExternal() {
		window.open(url);
	}

	// preference bridge
	let preferenceKey, preferenceValue, preferenceValueInput, preferenceAction;

	async function callGetPreference(defaultValue) {
		preferenceAction = 'GET';
		preferenceValue = await getPreference(preferenceKey, defaultValue);
		log('getPreference', preferenceKey, preferenceValue);
	}

	async function callSetPreference() {
		preferenceAction = 'SET';
		await setPreference(preferenceKey, preferenceValueInput);
		log('setPreference', preferenceKey, preferenceValueInput);
		preferenceValueInput = '';
	}

	async function callRemovePreference() {
		preferenceAction = 'REMOVE';
		await removePreference(preferenceKey);
		log('removePreference', preferenceKey);
	}

	async function callGetToken() {
		preferenceAction = 'GET';
		preferenceKey = 'notification_token';
		preferenceValue = await getPreference(preferenceKey, 'NO_TOKEN_VALUE');

		if (preferenceValue) {
			token = preferenceValue;
			log('callGetToken', preferenceKey, preferenceValue);
			log('store token value');
		}
	}

	function reload() {
		location.reload();
	}

	async function sendPush() {
		// DEBUG
		//
		token ??=
						'fP-GTzM0P0rYpHAi95fEer:APA91bHKJ3wTRgyHxfvIRKRh1M37M2B7HjDDN18FvKh7NbYbHg11CVo3WNma9mWIE579W6AmMEhXF2mXyHI6lZ2nrtBvebpi9RfTw8PIt9YX4sOdd7Z835UJJq0v7lAth8eao0zW-oTT';

		const data = {...pushData, token, os: ua.os.name.toLowerCase()};
		const res = await axios.post('/api/push', data);
		log(res.data);
	}

	async function updateVersion(os) {
		await axios.post('/api/version', {id: os, ...version[os]});
		log(`${os} version info updated!`);
	}

	function download(url) {
		location.href = url;
	}
</script>

<svelte:head>
	<script src="/nbridge-bundle.js"></script>
</svelte:head>

<div class="container mx-auto">
	<div class="h-[50vh] overflow-hidden overflow-y-scroll overflow-x-scroll">
		<h1 class="text-center relative">
			App DevTools
			<button class="absolute left-0 text-blue-600 bg-blue-100 rounded p-1" on:click={reload}>
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
									d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
					/>
				</svg>
			</button>
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

		<section>
			<h2>App Bridge</h2>
			<button class="btn" on:click={() => callNbridge(appInfo)}>appInfo</button>
			<button class="btn" on:click={() => callNbridge(deviceInfo)}>deviceInfo</button>
			<button class="btn" on:click={() => callNbridge(exit)}>exit</button>
			<button class="btn" on:click={() => callNbridge(goSettings)}>goSettings</button>
			<button class="btn" on:click={() => callNbridge(clearCache)}>clearCache</button>
		</section>

		<section>
			<h2>Link Bridge</h2>
			<div class="pb-2">
				<input type="text" bind:value={url} placeholder="URL..."/>
			</div>
			<button class="btn" on:click={() => callNbridge(openBrowser, url)} disabled={!url}
			>Open Browser
			</button>
			<button
							class="btn"
							on:click={linkExternal}
							disabled={!url}
			>Link External
			</button>
			<p>Open Browser | Link External page</p>
		</section>

		<section>
			<h2>Preference Bridge</h2>
			<div class="pb-2 grid grid-cols-1 gap-2 lg:grid-cols-2">
				<input type="text" bind:value={preferenceKey} placeholder="Key"/>
				<input type="text" bind:value={preferenceValue} placeholder="Value"/>
			</div>
			<button
							class="btn"
							on:click={() => callGetPreference('DEFAULT_VALUE')}
							disabled={!preferenceKey}
			>Get Preference
			</button>
			<button
							class="btn"
							on:click={() => callSetPreference()}
							disabled={!preferenceKey || !preferenceValue}
			>Set Preference
			</button>
			<button class="btn" on:click={() => callRemovePreference()} disabled={!preferenceKey}
			>Remove Preference
			</button>
			<button class="btn" on:click={() => callGetToken()}>Get Token</button>
			<p class="break-all">[{preferenceAction}] {preferenceKey}={preferenceValue}</p>
		</section>

		{#if token}
			<section class="bg-green-400">
				<h2>Push Test</h2>
				<div class="space-y-1 sm:space-y-0 sm:gap-2 sm:grid sm:grid-cols-3">
					<input type="text" bind:value={pushData.message} placeholder="Push Message..."/>
					<input type="text" bind:value={pushData.foo} placeholder="Custom Param: foo..."/>
					<input type="text" bind:value={pushData.bar} placeholder="Custom Param: bar..."/>
				</div>
				<div class="flex justify-between mt-4">
					<div>
						<button class="btn" on:click={sendPush}>Send</button>
					</div>
				</div>
			</section>
		{/if}

		{#if version}
			<section class="bg-red-400">
				<div class="flex gap-2">
					<h2>iOS Version</h2>
					<button class="btn" on:click={() => updateVersion('ios')}>update</button>
					<button class="btn" on:click={() => download(version.ios.download)}>download</button>
				</div>

				<div class="flex flex-col md:flex-row md:justify-between">
					<div class="p-2 flex-1">
						Download URL: <input
									type="text"
									bind:value={version.ios.download}
									placeholder="iOS Download URL..."
					/>
					</div>
					<div class="p-2 flex-1">
						Version: <input
									type="text"
									bind:value={version.ios.version}
									placeholder="iOS Version..."
					/>
					</div>
				</div>
			</section>

			<section class="bg-red-400">
				<div class="flex gap-2">
					<h2>Android Version</h2>
					<button class="btn" on:click={() => updateVersion('android')}>update</button>
					<button class="btn" on:click={() => download(version.android.download)}>download</button>
				</div>

				<div class="flex flex-col md:flex-row md:justify-between">
					<div class="p-2 flex-1">
						Download URL: <input
									type="text"
									bind:value={version.android.download}
									placeholder="Android Download URL..."
					/>
					</div>
					<div class="p-2 flex-1">
						Version: <input
									type="text"
									bind:value={version.android.version}
									placeholder="Android Version..."
					/>
					</div>
				</div>
			</section>
		{/if}

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
	{#each logs as log, i (i)}
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
