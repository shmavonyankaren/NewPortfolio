import Image from "next/image";
import { Fragment } from "react";

type BlogPost = {
  _id?: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

const normalizePost = (data: Partial<BlogPost> = {}): BlogPost => ({
  _id: data._id ? String(data._id) : undefined,
  title: data.title ?? "",
  content: data.content ?? "",
  imageUrl: data.imageUrl ?? "",
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
});

const formatDate = (value?: string) => {
  if (!value) return "—";
  const d = new Date(value);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

async function getPosts(): Promise<BlogPost[]> {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    }/api/admin/posts`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    console.error("Failed to fetch posts", res.status);
    return [];
  }

  const data = await res.json();
  return Array.isArray(data) ? data.map((item) => normalizePost(item)) : [];
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <article className="p-5 group rounded-2xl border border-slate-200/70 dark:border-white/10 bg-white dark:bg-slate-900/60 shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
      <div className="relative space-y-4 md:space-y-3 md:after:content-[''] md:after:block md:after:clear-both">
        <div className="relative w-full aspect-4/3 max-h-64 sm:max-h-72 overflow-hidden rounded-2xl border border-slate-200/80 dark:border-white/10 bg-linear-to-br from-slate-100 via-white to-slate-200 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 shadow-inner mb-3 md:mb-0 md:float-left md:w-64 md:mr-6 md:shadow-md">
          {post.imageUrl ? (
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              sizes="(min-width: 640px) 240px, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-slate-400 dark:text-slate-500">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/70 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-3xl">
                🖼️
              </span>
            </div>
          )}
        </div>
        <div className="space-y-3 wrap-break-words min-w-0 text-left">
          <div className="flex items-center text-xs font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-300/90">
            <span>{formatDate(post.createdAt)}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white leading-tight">
            {post.title}
          </h3>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 whitespace-pre-line">
            {post.content}
          </p>
        </div>
      </div>
    </article>
  );
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <main className="pt-15 relative min-h-screen overflow-hidden bg-linear-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute right-[-10%] top-32 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute bottom-10 left-1/4 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
        <header className="space-y-3 text-center">
          <h1 className="heading text-3xl sm:text-4xl md:text-5xl">
            <div className="inline-block">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-linear-to-r from-purple-600 via-purple-500 to-pink-500 dark:from-purple-400 dark:via-purple-300 dark:to-pink-400 bg-clip-text text-transparent">
                Posts
              </h1>
              <div className="h-1 w-full bg-linear-to-r from-purple-600 via-purple-500 to-pink-500 dark:from-purple-400 dark:via-purple-300 dark:to-pink-400 rounded-full"></div>
            </div>
          </h1>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Fresh insights, updates, and stories
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
            Dive into project retrospectives, behind-the-scenes notes, and ideas
            we are exploring. Posts sync automatically from the admin.
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 px-6 py-12 text-center space-y-3 shadow-sm backdrop-blur">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              No posts yet
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              When new posts are published, they will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-15">
            {posts.map((post, idx) => (
              <Fragment key={post._id || post.title}>
                <PostCard post={post} />
                {idx < posts.length - 1 && (
                  <div className="h-px w-full bg-slate-900/10 dark:bg-purple-400/50" />
                )}
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
