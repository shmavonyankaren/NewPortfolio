"use client";

import { useState, useEffect } from "react";
import { Trash2, Edit2, Plus, Trash, User } from "lucide-react";
import Image from "next/image";
import FileUploader from "./FileUploader";
import ConfirmDialog from "./ConfirmDialog";

interface Insight {
  _id?: string;
  name: string;
  position: string;
  insight: string;
  image?: string;
}

export default function InsightsManager() {
  const [comments, setComments] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Insight>({
    name: "",
    position: "",
    insight: "",
    image: "",
  });
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
      const res = await fetch("/api/admin/comments");
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
        const res = await fetch(`/api/admin/comments/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const updated = await res.json();
        setComments(comments.map((c) => (c._id === editingId ? updated : c)));
      } else {
        const res = await fetch("/api/admin/comments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
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
      title: "Delete Insight",
      message:
        "Are you sure you want to delete this insight? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await fetch(`/api/admin/comments/${id}`, { method: "DELETE" });
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
      title: "Delete All Insights",
      message: `Are you sure you want to delete all ${comments.length} insights? This action cannot be undone and will permanently remove all insights.`,
      onConfirm: async () => {
        try {
          await fetch("/api/admin/comments", { method: "DELETE" });
          setComments([]);
        } catch (error) {
          console.error("Failed to delete all comments:", error);
        }
      },
    });
  };

  const handleEdit = (comment: Insight) => {
    setFormData(comment);
    setEditingId(comment._id || null);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      position: "",
      insight: "",
      image: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading)
    return (
      <div className="text-slate-900 dark:text-white">Loading comments...</div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Insights
        </h3>
        <div className="flex gap-2 w-full sm:w-auto">
          {comments.length > 0 && (
            <button
              onClick={handleDeleteAll}
              className="flex items-center justify-center gap-1 sm:gap-2 bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors flex-1 sm:flex-initial"
              title="Delete All"
            >
              <Trash size={18} className="sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Delete All</span>
            </button>
          )}
          <button
            onClick={() => {
              if (showForm && !editingId) {
                resetForm();
              } else {
                setShowForm(true);
              }
            }}
            className="flex items-center justify-center gap-1 sm:gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors flex-1 sm:flex-initial"
            title={showForm && !editingId ? "Close" : "Add Insight"}
          >
            {showForm && !editingId ? (
              <>
                <Plus size={18} className="rotate-45 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Close</span>
              </>
            ) : (
              <>
                <Plus size={18} className="sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Delete"
      />

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-lg p-6 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-900 dark:text-white">
                Name *
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-900 dark:text-white">
                Position *
              </label>
              <input
                type="text"
                placeholder="CEO at Company"
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-900 dark:text-white">
                Image
              </label>
              <FileUploader
                imageUrl={formData.image || ""}
                onFieldChange={(url) =>
                  setFormData({ ...formData, image: url })
                }
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-900 dark:text-white">
              Insight *
            </label>
            <textarea
              placeholder="Share an insight or testimonial..."
              value={formData.insight}
              onChange={(e) =>
                setFormData({ ...formData, insight: e.target.value })
              }
              className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500"
              rows={4}
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              {editingId ? "Update" : "Create"} Insight
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4">
        {comments.length === 0 ? (
          <div className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-lg p-8 text-center">
            <p className="text-slate-600 dark:text-gray-400 text-lg">
              No insights yet. Click &quot;Add Insight&quot; to create one.
            </p>
          </div>
        ) : (
          comments
            .filter((c) => c._id !== editingId)
            .map((comment) => (
              <div
                key={comment._id}
                className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-lg p-3 sm:p-4"
              >
                <div className="flex flex-col sm:flex-row items-start gap-3">
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      {comment.image ? (
                        <Image
                          width={40}
                          height={40}
                          src={comment.image}
                          alt={comment.name}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center shrink-0">
                          <User
                            size={16}
                            className="text-white sm:w-5 sm:h-5"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="text-slate-900 dark:text-white font-semibold text-sm sm:text-base wrap-break-words">
                          {comment.name}
                        </h4>
                        <p className="text-slate-600 dark:text-gray-400 text-xs sm:text-sm truncate">
                          {comment.position}
                        </p>
                      </div>
                    </div>
                    <p className="text-slate-700 dark:text-gray-300 text-xs sm:text-sm italic mt-2">
                      &quot;{comment.insight}&quot;
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleEdit(comment)}
                      disabled={showForm && !editingId}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
                      title="Edit"
                    >
                      <Edit2 size={16} className="sm:w-4.5 sm:h-4.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(comment._id!)}
                      disabled={showForm && !editingId}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-600"
                      title="Delete"
                    >
                      <Trash2 size={16} className="sm:w-4.5 sm:h-4.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
