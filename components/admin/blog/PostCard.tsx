"use client";

import Image from "next/image";
import { CalendarClock } from "lucide-react";
import { ItemActionButtons } from "../common";
import { BlogPost } from "../types/blogPost";

interface PostCardProps {
  post: BlogPost;
  showForm: boolean;
  editingId: string | null;
  onEdit: () => void;
  onDelete: () => void;
}

function formatDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PostCard({
  post,
  showForm,
  editingId,
  onEdit,
  onDelete,
}: PostCardProps) {
  return (
    <div className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-lg p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row items-start gap-3">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg border border-slate-200 dark:border-white/10 shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          {post.imageUrl ? (
            <Image
              width={80}
              height={80}
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-slate-400 text-2xl">🖼️</div>
          )}
        </div>

        <div className="flex-1 min-w-0 w-full">
          <h4 className="text-slate-900 dark:text-white font-semibold text-sm sm:text-base mb-1">
            {post.title}
          </h4>
          <p className="text-slate-700 dark:text-gray-300 text-xs sm:text-sm line-clamp-2 mb-2">
            {post.content}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-gray-500">
            <span className="inline-flex items-center gap-1">
              <CalendarClock size={14} />
              Created {formatDate(post.createdAt)}
            </span>
            <span className="inline-flex items-center gap-1">
              <CalendarClock size={14} />
              Updated {formatDate(post.updatedAt)}
            </span>
          </div>
        </div>

        <ItemActionButtons
          onEdit={onEdit}
          onDelete={onDelete}
          disabled={showForm && !editingId}
        />
      </div>
    </div>
  );
}
