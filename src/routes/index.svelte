<script>
  import {onMount} from "svelte";

  let firbMobile;

  onMount(() => {
    initFirbMobile();
  })

  function initFirbMobile() {
    firbMobile = window.FirbMobile;

  }
</script>

<svelte:head>

  <script src="/firb-mobile-api-bundle.js"></script>
  <script type="text/javascript">
    (function () {
      // mobile info setting!
      const mobileInfo = {
        ios: {
          download: 'https://firb-mobile.herokuapp.com/assets/cybercampus.plist',
          version: '0.0.9',
        },
        android: {
          download: 'https://firb-mobile.herokuapp.com/assets/cybercampus.apk',
          version: '0.0.12',
        }
      };

      FirbMobile.setMobileInfo(mobileInfo);
      FirbMobile.setLogger({
        log: (...args) => console.log(...args, 'kakakakakakakaka')
      });
      FirbMobile.isDebugMode(true);

    })();
  </script>

</svelte:head>

<h1 class="text-4xl text-blue-800">Firstbrains Mobile App DevTools</h1>
<p>Visit <a href="https://www.notion.so/blackpet/Mobile-Native-Interface-892e01854e9148dfbb7601849c1b7830">Notion Page</a> to read the documentation</p>

<div>
  <button class="btn" on:click={firbMobile.request.tokenAndVersion()}>request token and mobile!!</button>
</div>
