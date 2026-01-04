"use client";

import { BlogPost } from "../types/blogPost";
import PostCard from "./PostCard";

interface PostListProps {
  posts: BlogPost[];
  editingId: string | null;
  showForm: boolean;
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string) => void;
}

export default function PostList({
  posts,
  editingId,
  showForm,
  onEdit,
  onDelete,
}: PostListProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-lg p-8 text-center">
        <p className="text-slate-600 dark:text-gray-400 text-lg">
          No blog posts yet. Click &quot;Add&quot; to create one.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {posts
        .filter((p) => p._id !== editingId)
        .map((post, index) => (
          <PostCard
            key={post._id || `post-${index}`}
            post={post}
            showForm={showForm}
            editingId={editingId}
            onEdit={() => onEdit(post)}
            onDelete={() => onDelete(post._id!)}
          />
        ))}
    </div>
  );
}
