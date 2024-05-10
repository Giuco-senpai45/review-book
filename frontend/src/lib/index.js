const API_URL = "http://localhost:80/reviews"

export async function createReview(author, comment, file) {
  const formData = new FormData();
  const reviewJson = JSON.stringify({ author, comment });
  formData.append("review", reviewJson);
  formData.append("image", file);

  console.log(formData);
  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to create review");
  }

  return response.json();
}

export async function getReviews() {
  console.log("Fetching reviews");
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to load reviews");
  }

  return response.json();
}
