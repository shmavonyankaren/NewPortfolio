"use client";

import type { ReactNode } from "react";

import ReorderableList from "../common/ReorderableList";

import { BlogPost } from "../types/blogPost";
import PostCard from "./PostCard";

interface PostListProps {
  posts: BlogPost[];
  editForm: ReactNode;
  editingId: string | null;
  showForm: boolean;
  onReordered: () => Promise<void>;
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string) => void;
}

export default function PostList({
  posts,
  editForm,
  editingId,
  showForm,
  onReordered,
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
    <ReorderableList items={posts} editingId={editingId} editForm={editForm} endpoint="/api/admin/posts" disabled={showForm} onReordered={onReordered}>
      {posts
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
    </ReorderableList>
  );
}
