"use client";

import { useEffect, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import { BlogPost } from "./types/blogPost";
import { PostForm, PostHeader, PostList } from "./blog";

const normalizePost = (data: Partial<BlogPost> = {}): BlogPost => ({
  title: data.title ?? "",
  content: data.content ?? "",
  imageUrl: data.imageUrl ?? "",
  _id: data._id ? String(data._id) : undefined,
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
});

export default function BlogPostManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<BlogPost>(normalizePost());
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/admin/posts");
      const data = await res.json();
      setPosts(
        Array.isArray(data)
          ? data.map((item: Partial<BlogPost>) => normalizePost(item))
          : []
      );
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    const payload = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      imageUrl: formData.imageUrl?.trim() || "",
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/admin/posts/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Update failed");
        const updated = await res.json();
        setPosts(
          posts.map((p) => (p._id === editingId ? normalizePost(updated) : p))
        );
      } else {
        const res = await fetch("/api/admin/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Create failed");
        const newPost = await res.json();
        setPosts([...posts, normalizePost(newPost)]);
      }
      resetForm();
    } catch (error) {
      console.error("Failed to save post:", error);
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Blog Post",
      message:
        "Are you sure you want to delete this blog post? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
          setPosts(posts.filter((p) => p._id !== id));
        } catch (error) {
          console.error("Failed to delete post:", error);
        }
      },
    });
  };

  const handleDeleteAll = async () => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete All Blog Posts",
      message: `Are you sure you want to delete all ${posts.length} blog posts? This action cannot be undone and will permanently remove all posts.`,
      onConfirm: async () => {
        try {
          await fetch("/api/admin/posts", { method: "DELETE" });
          setPosts([]);
        } catch (error) {
          console.error("Failed to delete all posts:", error);
        }
      },
    });
  };

  const handleEdit = (post: BlogPost) => {
    setFormData(normalizePost(post));
    setEditingId(post._id || null);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData(normalizePost());
    setEditingId(null);
    setShowForm(false);
  };

  const handleFormChange = (data: Partial<BlogPost>) => {
    setFormData(normalizePost({ ...formData, ...data }));
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
      <div className="text-slate-900 dark:text-white">
        Loading blog posts...
      </div>
    );

  return (
    <div className="space-y-6">
      <PostHeader
        postCount={posts.length}
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
        <PostForm
          formData={formData}
          editingId={editingId}
          onFormChange={handleFormChange}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      )}

      <PostList
        posts={posts}
        editingId={editingId}
        showForm={showForm}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
