<script>
  import { Circle2 } from "svelte-loading-spinners";

  export let author = "";
  export let comment = "";
  export let thumbnailUrl = "";
  export let imageUrl = "";
  export let timestamp = new Date();

  const displayFullPic = (element) => {
    element.setAttribute('src', imageUrl);
  }

  const displayThumbnail= (element) => {
    element.setAttribute('src', thumbnailUrl);
  }
</script>

<li class="card p-5 w-80 border-2 border-black">
  <div class="grid grid-cols-2">
    {#if !thumbnailUrl}
      <div class="flex justify-center items-center">
        <Circle2
          size="3"
          colorOuter="#ef9995"
          colorCenter="#00cbcc"
          unit="rem"
          durationInner="4s"
          durationOuter="6s"
        />
      </div>
    {:else}
      <img class="mx-auto my-auto" alt="thumbnail" src={thumbnailUrl} on:mouseover={() => displayFullPic(event.target)} on:mouseleave={() => displayThumbnail(event.target)} />
    {/if}
    <div class="grid grid-cols-2">
      <p class="col-span-2 text-lg font-bold text-center">{author}</p>
      <p class="col-span-2 text-base border-2 p-2 border-black rounded-lg">{comment}</p>
    </div>
    <p class="col-span-2 text-sm text-gray-600">{new Date(timestamp).toLocaleString('de-DE')}</p>
  </div>
</li>
