"use client";

import type { ReactNode } from "react";

import ReorderableList from "../common/ReorderableList";

import { Comment } from "../types/comment";
import CommentCard from "./CommentCard";

interface CommentListProps {
  comments: Comment[];
  editForm: ReactNode;
  editingId: string | null;
  showForm: boolean;
  onReordered: () => Promise<void>;
  onEdit: (comment: Comment) => void;
  onDelete: (id: string) => void;
}

export default function CommentList({
  comments,
  editForm,
  editingId,
  showForm,
  onReordered,
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
    <ReorderableList items={comments} editingId={editingId} editForm={editForm} endpoint="/api/admin/comments-section" disabled={showForm} onReordered={onReordered}>
      {comments
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
    </ReorderableList>
  );
}
