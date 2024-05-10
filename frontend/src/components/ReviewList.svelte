<script>
  import ReviewItem from "./ReviewItem.svelte";
  import { Circle2 } from "svelte-loading-spinners";
  import { store } from "$lib/store";
  import { PUBLIC_SAS_KEY } from '$env/static/public'

  let loading = false;
  let reviews = [];

  let token = PUBLIC_SAS_KEY

  store.subscribe((value) => {
    loading = value.loading;
    reviews = value.reviews;
  });
</script>

{#if loading}
  <div class="flex mt-20 justify-center items-center">
    <Circle2
      size="10"
      colorOuter="#ef9995"
      colorCenter="#00cbcc"
      unit="rem"
      durationInner="4s"
      durationOuter="6s"
    />
  </div>
{:else}
  <ul class="grid grid-cols-2 justify-items-center gap-4">
    {#each reviews as review}
    <ReviewItem
      author={review.author}
      comment={review.comment}
      thumbnailUrl={review.thumbnailUrl + token}
      imageUrl={review.image + token}
      timestamp={review.timestamp}
    />
  {/each}
  </ul>
{/if}
