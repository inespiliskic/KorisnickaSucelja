import Link from "next/link";
import { getPost, getUser } from "../../lib/jsonplaceholder";

type Props = {
  params: { id: string };
};

export default async function ObjaveDetalj({ params }: Props) {
  const id = Number(params.id);

  if (!Number.isFinite(id)) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Neispravan ID</h2>
        <Link href="/objave" className="text-purple-900 hover:underline">
          ← Natrag na objave
        </Link>
      </div>
    );
  }

  const post = await getPost(id);
  const author = await getUser(post.userId);

  return (
    <div className="space-y-6">
      <Link href="/objave" className="text-purple-900 hover:underline">
        ← Natrag na objave
      </Link>

      <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>

        <div className="mt-3 text-sm text-gray-600">
          Autor: <span className="font-medium">{author.name}</span> (@{author.username})
          <span className="mx-2">•</span>
          Kontakt: <span className="font-medium">{author.email}</span>
        </div>

        <p className="mt-6 whitespace-pre-line leading-7 text-gray-700">{post.body}</p>
      </article>
    </div>
  );
}
