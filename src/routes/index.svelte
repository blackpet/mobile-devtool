<script>
  import {onMount, tick} from "svelte";
  import {goto} from '$app/navigation';
  import axios from 'axios';
  import UAParser from 'ua-parser-js';

  const uap = new UAParser();
  const ua = {ua: uap.getUA(), os: uap.getOS(), browser: uap.getBrowser()};

  let firbMobile;
  let logs = [];
  let url = 'http://naver.com';
  let code; // console code panel
  let version;

  let token; // device token
  let pushData = {
    title: '',
    body: '',
    url: '',
  }

  onMount(() => {
    initFirbMobile();
  })

  async function log(...args) {
    logs = [...logs, JSON.stringify(args)];

    await tick();
    code.scrollTo(0, code.scrollHeight);

    console.log(...args);
  }

  async function initFirbMobile() {
    firbMobile = window.FirbMobile;
    console.log('firbMobile', firbMobile);

    version = (await axios.get('/api/version')).data;
    console.log(version);
    firbMobile.setMobileInfo(version);
    firbMobile.isDebugMode(true);
    firbMobile.setLogger({log});
  }

  function getTokenData() {
    firbMobile.request.tokenAndVersion(
      (_token, version, os) => {
        log('callback::getTokenData', _token, version, os);
        token = _token;
        log('set token locally. you can test to push notification now!');
      }
    );
  }
  function setAutoLoginData() {
    firbMobile.request.saveUserInfo('Y', 'user1');
  }
  function getAutoLoginData() {
    firbMobile.request.userInfo(
      (autoLoginYn, id, secret) => log('callback::getAutoLoginData', autoLoginYn, id, secret)
    );
  }
  function goOutLink() {
    firbMobile.request.linkTo(url);
  }
  function newWindow() {
    firbMobile.request.openWindow(url);
  }
  function qrcode() {
    firbMobile.request.qrcode(
      (url) => log('callback::qrcode', url)
    );
  }
  function coordinates() {
    firbMobile.request.coordinates(
      (lat, long) => log('callback::coordinates', lat, long)
    );
  }

  async function updateVersion(os) {
    await axios.post('/api/version', {id: os, ...version[os]});
    log(`${os} version info updated!`);
  }

  async function sendPush() {
    // DEBUG
    token ??= 'f6yVeJQwDUK6rCl2Lt0Brh:APA91bFP3JL7N4VAqMQxXLXrd2zGmV7KrgpRB9yLhZ93HQVN1IOjUDKRttThHMPGDV8UpcWogv9NQeSOW9x8g4B0-a1WKxH7x3t3WY75e9RKlQECqetR7k7Hp2k9G2AEy2jAF7xt-Upq';

    const data = {...pushData, token};
    await axios.post('/api/push', data);
    log(data);
  }
</script>

<svelte:head>
  <script src="/firb-mobile-api-bundle.js"></script>
</svelte:head>

<div class="container mx-auto">
  <div class="h-[50vh] overflow-hidden overflow-y-scroll overflow-x-scroll">
    <h1 class="text-center relative">
      Firb App DevTools
      <button class="absolute right-0 text-blue-600 bg-blue-100 rounded p-1" on:click={() => goto('urls')}>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
      </button>
    </h1>

    <!--Documentation-->
    <section>
      <p>Visit <a href="https://www.notion.so/blackpet/Mobile-Native-Interface-892e01854e9148dfbb7601849c1b7830" target="_blank">Notion Page</a> to read the documentation</p>
    </section>

    <!--getTokenData-->
    <section>
      <button class="btn" on:click={getTokenData}>getTokenData</button>
      <p>Request Device Token and App Version</p>
    </section>

    {#if !token}
      <section class="bg-green-400">
        <h2>Push Test</h2>
        <div class="space-y-1 sm:space-y-0 sm:gap-2 sm:grid sm:grid-cols-3">
          <input type="text" bind:value={pushData.title} placeholder="Title...">
          <input type="text" bind:value={pushData.body} placeholder="Body...">
          <input type="text" bind:value={pushData.url} placeholder="Target URL...">
        </div>
        <div class="flex justify-between mt-4">
          <div>
            <a href on:click|preventDefault={() => pushData.url = 'http://naver.com'}>네이버</a> |
            <a href on:click|preventDefault={() => pushData.url = 'https://firb-mobile.vercel.app/'}>DevTool</a> |
            <a href on:click|preventDefault={() => pushData.url = ''}>직접입력</a>
          </div>
          <div>
            <button class="btn" on:click={sendPush}>Send</button>
          </div>
        </div>
      </section>
    {/if}

    <!--autoLoginData-->
    <section>
      <button class="btn" on:click={setAutoLoginData}>setAutoLoginData</button>
      <button class="btn" on:click={getAutoLoginData}>getAutoLoginData</button>
      <p>Save Auto-Login Info | Retrieve Auto-Login Info</p>
    </section>

    <!--goOutLink / newWindow-->
    <section>
      <div class="pb-2">
        <input type="text" bind:value={url} placeholder="URL...">
      </div>
      <button class="btn" on:click={goOutLink} disabled={!url}>goOutLink</button>
      <button class="btn" on:click={newWindow} disabled={!url}>newWindow</button>
      <p>Link External page | Open Browser</p>
    </section>

    <!--QRCode-->
    <section>
      <button class="btn" on:click={qrcode}>qrcode</button>
      <p>Execute QRCode Reader</p>
    </section>


    <!--GEO coordinates-->
    <section>
      <button class="btn" on:click={coordinates}>coordinates</button>
      <p>Request GPS Coordinates</p>
    </section>


    <section class="bg-green-400">
      <h2>Response Test</h2>
      <button class="btn" on:click={() => firbMobile.response.tokenAndVersion('token', '0.0.0')}>getTokenData</button>
      <button class="btn" on:click={() => firbMobile.response.userInfo('Y', 'stored user-id', 'stored secret key')}>getAutoLoginData</button>
      <button class="btn" on:click={() => firbMobile.response.qrcode('http://qr-code-url.com')}>qrcode</button>
      <button class="btn" on:click={() => firbMobile.response.coordinates(123.45, 567.89)}>coordinates</button>
    </section>

    {#if version}
      <section class="bg-red-400">
        <div class="flex">
          <h2>iOS Version</h2>
          <button class="btn" on:click={() => updateVersion('ios')}>update</button>
        </div>

        <div class="flex flex-col md:flex-row md:justify-between">
          <div class="p-2 flex-1">
            Download URL: <input type="text" bind:value={version.ios.download} placeholder="iOS Download URL...">
          </div>
          <div class="p-2 flex-1">
            Version: <input type="text" bind:value={version.ios.version} placeholder="iOS Version...">
          </div>
        </div>
      </section>

      <section class="bg-red-400">
        <div class="flex">
          <h2>Android Version</h2>
          <button class="btn" on:click={() => updateVersion('android')}>update</button>
        </div>

        <div class="flex flex-col md:flex-row md:justify-between">
          <div class="p-2 flex-1">
            Download URL: <input type="text" bind:value={version.android.download} placeholder="Android Download URL...">
          </div>
          <div class="p-2 flex-1">
            Version: <input type="text" bind:value={version.android.version} placeholder="Android Version...">
          </div>
        </div>
      </section>
    {/if}

    <section>
      <h2>User Agent</h2>
      <div class="prose max-w-none">
        <ul>
          <li>ua: {ua.ua}</li>
          <li>brwoser
            <ul class="!my-0">
              <li>name: {ua.browser.name}</li>
              <li>version: {ua.browser.version}</li>
              <li>major: {ua.browser.major}</li>
            </ul>
          </li>
          <li>os
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

<code class="block w-screen h-[50vh] bg-gray-800 overflow-hidden overflow-y-scroll p-2 text-gray-50 text-xs md:text-base"
      bind:this={code}>
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
