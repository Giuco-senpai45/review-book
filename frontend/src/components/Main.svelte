<script>
  import { onMount } from "svelte";
  import { store } from "$lib/store";
  import ReviewList from "../components/ReviewList.svelte";
  import ReviewForm from "../components/ReviewForm.svelte";

  onMount(async () => {
    await store.loadReviews();
  });
</script>

<main class="p-10">
  <ReviewList />
  <div class="p-10"></div>
  <ReviewForm />
</main>
