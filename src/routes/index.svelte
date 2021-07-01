<script>
  import {onMount, tick} from "svelte";
  import axios from 'axios';

  let firbMobile;
  let logs = [];
  let url = 'http://naver.com';
  let code; // console code panel

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

    const version = await axios.get('/api/version');
    firbMobile.setMobileInfo(version.data);
    firbMobile.isDebugMode(true);
    firbMobile.setLogger({log});
  }

  function getTokenData() {
    firbMobile.request.tokenAndVersion(
      (token, version, os) => log('callback::getTokenData', token, version, os)
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
</script>

<svelte:head>
  <script src="/firb-mobile-api-bundle.js"></script>
</svelte:head>

<div class="container mx-auto">
  <div class="h-[50vh] overflow-hidden overflow-y-scroll overflow-x-scroll">
    <h1 class="text-center">Firstbrains Mobile App DevTools</h1>

    <section>
      <p>Visit <a href="https://www.notion.so/blackpet/Mobile-Native-Interface-892e01854e9148dfbb7601849c1b7830" target="_blank">Notion Page</a> to read the documentation</p>
    </section>

    <section>
      <button class="btn" on:click={getTokenData}>getTokenData</button>
      <p>Request Device Token and App Version</p>
    </section>

    <section>
      <button class="btn" on:click={setAutoLoginData}>setAutoLoginData</button>
      <button class="btn" on:click={getAutoLoginData}>getAutoLoginData</button>
      <p>Save Auto-Login Info | Retrieve Auto-Login Info</p>
    </section>

    <section>
      <div class="pb-2">
        <input type="text"
               class="p-2 rounded w-full"
               bind:value={url} placeholder="URL...">
      </div>
      <button class="btn" on:click={goOutLink} disabled={!url}>goOutLink</button>
      <button class="btn" on:click={newWindow} disabled={!url}>newWindow</button>
      <p>Link External page | Open Browser</p>
    </section>

    <section>
      <button class="btn" on:click={qrcode}>qrcode</button>
      <p>Execute QRCode Reader</p>
    </section>

    <section class="bg-green-600">
      <h2>Response Test</h2>
      <button class="btn" on:click={() => firbMobile.response.tokenAndVersion('token', '0.0.0')}>getTokenData</button>
      <button class="btn" on:click={() => firbMobile.response.userInfo('Y', 'stored user-id', 'stored secret key')}>getAutoLoginData</button>
      <button class="btn" on:click={() => firbMobile.response.qrcode('http://qr-code-url.com')}>qrcode</button>
    </section>
  </div>
</div>

<code class="block w-screen h-[50vh] bg-gray-800 overflow-hidden overflow-y-scroll p-2 text-gray-50 text-xs md:text-base"
      bind:this={code}>
  {#each logs as log, i}
    <pre>#{i}: {log}</pre>
  {:else}
    <pre class="text-center">NO LOGS YET</pre>
  {/each}
</code>
