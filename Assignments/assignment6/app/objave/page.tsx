import Link from "next/link";
import { getPosts } from "../lib/jsonplaceholder";

type Props = {
  searchParams?: { page?: string };
};

export default async function ObjaveIndex({ searchParams }: Props) {
  const page = Math.max(1, Number(searchParams?.page ?? "1") || 1);
  const { posts, totalPages } = await getPosts({ page, pageSize: 10 });

  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < totalPages ? page + 1 : null;

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-gray-900">Objave</h2>
        <p className="text-gray-600">
          Dinamičke rute + server-side dohvat podataka (JSONPlaceholder).
        </p>
      </header>

      <ul className="space-y-3">
        {posts.map((post) => (
          <li
            key={post.id}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <Link
              href={`/objave/${post.id}`}
              className="text-lg font-semibold text-purple-900 hover:underline"
            >
              {post.title}
            </Link>
            <p className="mt-2 text-gray-600">
              {post.body.length > 120 ? `${post.body.slice(0, 120)}...` : post.body}
            </p>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Stranica <span className="font-semibold">{page}</span> / {totalPages}
        </div>

        <div className="flex gap-2">
          {prevPage ? (
            <Link
              href={`/objave?page=${prevPage}`}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
            >
              ← Prethodna
            </Link>
          ) : (
            <span className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-400">
              ← Prethodna
            </span>
          )}

          {nextPage ? (
            <Link
              href={`/objave?page=${nextPage}`}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
            >
              Sljedeća →
            </Link>
          ) : (
            <span className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-400">
              Sljedeća →
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
