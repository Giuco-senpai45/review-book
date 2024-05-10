<script>
  import { createReview } from "$lib/index";
  import { store } from "$lib/store";

  const MAX_NAME_SIZE = 25;
  const MAX_COMMENT_SIZE = 200;

  let currentFile = [];
  let valid = false;
  let author = "";
  let comment = "";
  let progress = 0;

  const authorRules = [
    (v) => !!v || "Name is required",
    (v) =>
      v.length <= MAX_NAME_SIZE ||
      `Name must be less than ${MAX_NAME_SIZE} characters`,
  ];

  const commentRules = [
    (v) => !!v || "Comment is required",
    (v) =>
      v.length <= MAX_COMMENT_SIZE ||
      `Comment must be less than ${MAX_COMMENT_SIZE} characters`,
  ];

  async function onSubmit() {
    if (!currentFile.length) {
      return;
    }

    try {
      await createReview(author, comment, currentFile[0]);
    } catch (error) {
      progress = 0;
      currentFile = [];
      author = "";
      comment = "";
      store.loadReviews();
    }
  }
  function validateAuthor(value) {
    return authorRules.every((rule) => rule(value));
  }

  function validateComment(value) {
    return commentRules.every((rule) => rule(value));
  }

  $: valid = validateAuthor(author) && validateComment(comment) && currentFile.length > 0;
</script>

<div class="flex justify-center">
  <div class="card p-10 w-96 bg-base-300 shadow-xl">
    <form class="space-y-4" on:submit|preventDefault={onSubmit}>
      <div class="form-control">
        <label for="author" class="label">Name</label>
        <input
          id="author"
          bind:value={author}
          class="input input-bordered w-full max-w-xs"
          required
        />
        <p class="text-sm text-error">
          {author.length > MAX_NAME_SIZE
            ? `Name must be less than ${MAX_NAME_SIZE} characters`
            : ""}
        </p>
      </div>
      <div class="form-control">
        <label for="comment" class="label">Comment</label>
        <textarea
          id="comment"
          bind:value={comment}
          class="textarea textarea-bordered max-w-xs"
          required
        ></textarea>
        <p class="text-sm text-error">
          {comment.length > MAX_COMMENT_SIZE
            ? `Comment must be less than ${MAX_COMMENT_SIZE} characters`
            : ""}
        </p>
      </div>
      <div class="form-control">
        <label for="file" class="label">Image</label>
        <input
          id="file"
          type="file"
          bind:files={currentFile}
          class="file-input file-input-bordered file-input-primary w-full max-w-xs"
          accept="image/*"
        />
      </div>
      <div class="flex pt-5 justify-center">
        <button type="submit" class="btn btn-primary self-center w-36" disabled={!valid}>Send</button>
      </div>
    </form>
  </div>
</div>


