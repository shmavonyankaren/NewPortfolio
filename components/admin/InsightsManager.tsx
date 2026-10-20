"use client";

import { useState, useEffect } from "react";
import ConfirmDialog from "./ConfirmDialog";
import { Insight } from "./types/insight";
import { InsightHeader, InsightForm, InsightList } from "./insights";

export default function InsightsManager() {
  const [insights, setInsights] = useState<Insight[]>([]);
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
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const res = await fetch("/api/admin/comments");
      const data = await res.json();
      setInsights(data);
    } catch (error) {
      console.error("Failed to fetch insights:", error);
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
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || "Failed to save item");
        await fetchInsights();
      } else {
        const res = await fetch("/api/admin/comments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || "Failed to save item");
        await fetchInsights();
      }
      resetForm();
    } catch (error) {
      console.error("Failed to save insight:", error);
      alert(error instanceof Error ? error.message : "Failed to save item");
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
          await fetchInsights();
        } catch (error) {
          console.error("Failed to delete insight:", error);
        }
      },
    });
  };

  const handleDeleteAll = async () => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete All Insights",
      message: `Are you sure you want to delete all ${insights.length} insights? This action cannot be undone and will permanently remove all insights.`,
      onConfirm: async () => {
        try {
          await fetch("/api/admin/comments", { method: "DELETE" });
          setInsights([]);
        } catch (error) {
          console.error("Failed to delete all insights:", error);
        }
      },
    });
  };

  const handleEdit = (insight: Insight) => {
    setFormData(insight);
    setEditingId(insight._id || null);
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

  const handleFormChange = (data: Partial<Insight>) => {
    setFormData({ ...formData, ...data });
  };

  const handleAddClick = () => {
    if (showForm && !editingId) {
      resetForm();
    } else {
      resetForm();
      setShowForm(true);
    }
  };

  const form = (
    <InsightForm
      itemCount={insights.length}
      formData={formData}
      editingId={editingId}
      onFormChange={handleFormChange}
      onSubmit={handleSubmit}
      onCancel={resetForm}
    />
  );

  if (loading)
    return (
      <div className="text-slate-900 dark:text-white">Loading insights...</div>
    );

  return (
    <div className="space-y-6">
      <InsightHeader
        insightCount={insights.length}
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

      {showForm && !editingId && form}

      <InsightList
        editForm={showForm ? form : null}
        onReordered={fetchInsights}
        insights={insights}
        editingId={editingId}
        showForm={showForm}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
