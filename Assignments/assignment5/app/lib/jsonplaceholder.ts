export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
};

const API_BASE = "https://jsonplaceholder.typicode.com";

/**
 * Minimal wrapper around fetch for JSONPlaceholder.
 *
 * Using `revalidate` keeps the app fast while still demonstrating
 * server-side fetching (data is retrieved on the server).
 */
async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    // Server-side fetch with incremental revalidation.
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`JSONPlaceholder error: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as T;
}

export async function getPosts(params?: { page?: number; pageSize?: number }) {
  const pageSize = params?.pageSize ?? 10;
  const page = params?.page ?? 1;
  const start = (page - 1) * pageSize;

  // JSONPlaceholder supports _start & _limit query params.
  const posts = await apiFetch<Post[]>(`/posts?_start=${start}&_limit=${pageSize}`);

  // JSONPlaceholder has 100 posts total.
  // (Kept as a constant to avoid an extra request and keep the demo simple.)
  const total = 100;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return { posts, page, pageSize, total, totalPages };
}

export async function getPost(id: number) {
  return apiFetch<Post>(`/posts/${id}`);
}

export async function getUser(id: number) {
  return apiFetch<User>(`/users/${id}`);
}
