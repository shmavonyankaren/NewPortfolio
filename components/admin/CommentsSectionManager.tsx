"use client";

import { useState, useEffect } from "react";
import ConfirmDialog from "./ConfirmDialog";
import { Comment } from "./types/comment";
import { CommentHeader, CommentForm, CommentList } from "./comments";

export default function CommentsSectionManager() {
  const normalizeComment = (data: Partial<Comment> = {}): Comment => ({
    _id: data._id,
    name: data.name ?? "",
    position: data.position ?? "",
    comment: data.comment ?? "",
    image: data.image ?? "",
  });

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Comment>(normalizeComment());
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await fetch("/api/admin/comments-section");
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/comments-section/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(normalizeComment(formData)),
        });
        const updated = await res.json();
        setComments(comments.map((c) => (c._id === editingId ? updated : c)));
      } else {
        const res = await fetch("/api/admin/comments-section", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(normalizeComment(formData)),
        });
        const newComment = await res.json();
        setComments([...comments, newComment]);
      }
      resetForm();
    } catch (error) {
      console.error("Failed to save comment:", error);
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Comment",
      message:
        "Are you sure you want to delete this comment? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await fetch(`/api/admin/comments-section/${id}`, {
            method: "DELETE",
          });
          setComments(comments.filter((c) => c._id !== id));
        } catch (error) {
          console.error("Failed to delete comment:", error);
        }
      },
    });
  };

  const handleDeleteAll = async () => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete All Comments",
      message: `Are you sure you want to delete all ${comments.length} comments? This action cannot be undone and will permanently remove all comments.`,
      onConfirm: async () => {
        try {
          await fetch("/api/admin/comments-section", { method: "DELETE" });
          setComments([]);
        } catch (error) {
          console.error("Failed to delete all comments:", error);
        }
      },
    });
  };

  const handleEdit = (comment: Comment) => {
    setFormData(normalizeComment(comment));
    setEditingId(comment._id || null);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData(normalizeComment());
    setEditingId(null);
    setShowForm(false);
  };

  const handleFormChange = (data: Partial<Comment>) => {
    setFormData(normalizeComment({ ...formData, ...data }));
  };

  const handleAddClick = () => {
    if (showForm && !editingId) {
      resetForm();
    } else {
      setShowForm(true);
    }
  };

  if (loading)
    return (
      <div className="text-slate-900 dark:text-white">Loading comments...</div>
    );

  return (
    <div className="space-y-6">
      <CommentHeader
        commentCount={comments.length}
        showForm={showForm}
        editingId={editingId}
        onAddClick={handleAddClick}
        onDeleteAll={handleDeleteAll}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Delete"
      />

      {showForm && (
        <CommentForm
          formData={formData}
          editingId={editingId}
          onFormChange={handleFormChange}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      )}

      <CommentList
        comments={comments}
        editingId={editingId}
        showForm={showForm}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
