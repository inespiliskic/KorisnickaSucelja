import Link from "next/link";
import { getPosts, type Post } from "../lib/jsonplaceholder";

type Props = {
  searchParams?: Promise<{ page?: string }>;
};

export default async function ObjavePage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const page = Number(sp.page ?? "1");

  const { posts, totalPages } = await getPosts({ page });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Objave</h1>

      <ul className="space-y-4">
        {posts.map((post: Post) => (
          <li
            key={post.id}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              {post.title}
            </h2>
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {post.body}
            </p>

            <Link
              href={`/objave/${post.id}`}
              className="mt-3 inline-block text-sm font-semibold text-purple-900 hover:underline"
            >
              Pročitaj više →
            </Link>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Link
          href={`/objave?page=${page - 1}`}
          className={`rounded-xl px-4 py-2 text-sm font-semibold ${
            page <= 1
              ? "pointer-events-none bg-gray-100 text-gray-400"
              : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"
          }`}
        >
          ← Prethodna
        </Link>

        <span className="text-sm text-gray-600">
          Stranica {page} od {totalPages}
        </span>

        <Link
          href={`/objave?page=${page + 1}`}
          className={`rounded-xl px-4 py-2 text-sm font-semibold ${
            page >= totalPages
              ? "pointer-events-none bg-gray-100 text-gray-400"
              : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"
          }`}
        >
          Sljedeća →
        </Link>
      </div>
    </div>
  );
}
