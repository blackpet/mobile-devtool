<script lang="ts">
  import axios from "axios";
  import {onMount} from 'svelte';
  import {goto} from '$app/navigation';

  let urlInput;
  let urls;

  onMount(() => loadUrls());

  function loadUrls() {
    return axios.get('/api/url').then(res => urls = res.data);
  }

  function access() {
    location.href = urlInput;
  }

  async function addToList() {
    const res = await axios.post('/api/url', {url: urlInput});

    // update state
    urls = [...urls, res.data];
  }
</script>

<div class="container mx-auto">
  <h1 class="text-center relative">
    Access URLs
    <button class="absolute right-0 text-blue-600 bg-blue-100 rounded p-1" on:click={() => goto('/')}>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </button>
  </h1>

  <section>
    <div class="pb-2">
      <input type="text"
             class="p-2 rounded w-full"
             bind:value={urlInput} placeholder="URL...">
    </div>
    <div class="flex justify-center items-center gap-4">
      <button class="btn bg-blue-500 text-gray-50" on:click={access} disabled={!urlInput}>Access</button>
      <button class="btn flex items-center gap-1 bg-red-400 text-gray-50" on:click={addToList} disabled={!urlInput}>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add to List
      </button>
    </div>
  </section>

  <section class="prose max-w-none prose-red">
    <h2>URL List</h2>

    {#if urls}
      <ul>
        {#each urls as url}
          <li class="py-1">
            <a href on:click={() => urlInput = url.url}>
              <span>{url.url}</span>
            </a>
            {#if url.name}
              <span class="bg-indigo-400 text-gray-50 p-2 rounded ml-2">{url.name}</span>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}

  </section>
</div>
