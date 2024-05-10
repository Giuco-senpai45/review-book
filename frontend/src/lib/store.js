// store.js
import { writable } from 'svelte/store';
import { getReviews } from '$lib/index';

const createReviewStore = () => {
  const { subscribe, set, update } = writable({
    loading: false,
    reviews: [],
  });
  console.log("Creating store");

  return {
    subscribe,
    loadReviews: async () => {
      update(store => ({ ...store, loading: true }));
      const reviews = await getReviews();
      set({ loading: false, reviews });
    },
  };
};

export const store = createReviewStore();