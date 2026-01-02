"use client";

import { Comment } from "../types/comment";
import CommentCard from "./CommentCard";

interface CommentListProps {
  comments: Comment[];
  editingId: string | null;
  showForm: boolean;
  onEdit: (comment: Comment) => void;
  onDelete: (id: string) => void;
}

export default function CommentList({
  comments,
  editingId,
  showForm,
  onEdit,
  onDelete,
}: CommentListProps) {
  if (!comments || comments.length === 0) {
    return (
      <div className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-lg p-8 text-center">
        <p className="text-slate-600 dark:text-gray-400 text-lg">
          No comments yet. Click &quot;Add&quot; to create one.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {comments
        .filter((c) => c._id !== editingId)
        .map((comment, index) => (
          <CommentCard
            key={comment._id || `comment-${index}`}
            comment={comment}
            showForm={showForm}
            editingId={editingId}
            onEdit={() => onEdit(comment)}
            onDelete={() => onDelete(comment._id!)}
          />
        ))}
    </div>
  );
}
