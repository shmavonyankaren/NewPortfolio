"use client";

import { useState, useEffect } from "react";
import ConfirmDialog from "./ConfirmDialog";
import { Skillset } from "./types/skillset";
import { SkillsetHeader, SkillsetForm, SkillsetList } from "./skillset";

export default function SkillsAndExpertiseManager() {
  const [skillsets, setSkillsets] = useState<Skillset[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Skillset>({
    title: "",
    skills: [],
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [tempSkillName, setTempSkillName] = useState("");

  useEffect(() => {
    fetchSkillsets();
  }, []);

  const fetchSkillsets = async () => {
    try {
      const res = await fetch("/api/admin/skillsets");
      const data = await res.json();
      setSkillsets(data);
    } catch (error) {
      console.error("Failed to fetch skillsets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Submitting skillset data:", formData);

      if (editingId) {
        const res = await fetch(`/api/admin/skillsets/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const responseData = await res.json();

        if (!res.ok) {
          console.error(
            "Failed to update skillset. Status:",
            res.status,
            "Response:",
            responseData
          );
          alert(
            `Error updating skillset: ${responseData.error || "Unknown error"}`
          );
          return;
        }

        console.log("Skillset updated successfully:", responseData);
        setSkillsets(
          skillsets.map((s) => (s._id === editingId ? responseData : s))
        );
      } else {
        const res = await fetch("/api/admin/skillsets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const responseData = await res.json();

        if (!res.ok) {
          console.error(
            "Failed to create skillset. Status:",
            res.status,
            "Response:",
            responseData
          );
          alert(
            `Error creating skillset: ${responseData.error || "Unknown error"}`
          );
          return;
        }

        console.log("Skillset created successfully:", responseData);
        setSkillsets([...skillsets, responseData]);
      }
      resetForm();
    } catch (error) {
      console.error("Error during skillset submission:", error);
      alert(
        `Error: ${
          error instanceof Error ? error.message : "Unknown error occurred"
        }`
      );
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Skillset",
      message:
        "Are you sure you want to delete this skillset? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await fetch(`/api/admin/skillsets/${id}`, { method: "DELETE" });
          setSkillsets(skillsets.filter((s) => s._id !== id));
        } catch (error) {
          console.error("Failed to delete skillset:", error);
        }
      },
    });
  };

  const handleDeleteAll = async () => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete All Skillsets",
      message: `Are you sure you want to delete all ${skillsets.length} skillsets? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const res = await fetch("/api/admin/skillsets", {
            method: "DELETE",
          });
          if (!res.ok) {
            throw new Error("Failed to delete all skillsets");
          }
          setSkillsets([]);
          console.log("All skillsets deleted successfully");
        } catch (error) {
          console.error("Failed to delete all skillsets:", error);
          alert("Error deleting all skillsets");
        }
      },
    });
  };

  const handleEdit = (skillset: Skillset) => {
    setFormData({
      ...skillset,
      skills: skillset.skills || [],
    });
    setEditingId(skillset._id || null);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      skills: [],
    });
    setEditingId(null);
    setShowForm(false);
    setShowSkillInput(false);
    setTempSkillName("");
  };

  const handleFormChange = (data: Partial<Skillset>) => {
    setFormData({ ...formData, ...data });
  };

  const handleAddSkill = () => {
    if (tempSkillName.trim()) {
      setFormData({
        ...formData,
        skills: [...formData.skills, { name: tempSkillName.trim() }],
      });
      setTempSkillName("");
      setShowSkillInput(false);
    }
  };

  const handleRemoveSkill = (index: number) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index),
    });
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
      <div className="text-slate-900 dark:text-white">Loading skillsets...</div>
    );

  return (
    <div className="space-y-6">
      <SkillsetHeader
        skillsetCount={skillsets.length}
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
        <SkillsetForm
          formData={formData}
          editingId={editingId}
          showSkillInput={showSkillInput}
          tempSkillName={tempSkillName}
          onFormChange={handleFormChange}
          onSkillNameChange={setTempSkillName}
          onAddSkill={handleAddSkill}
          onRemoveSkill={handleRemoveSkill}
          onShowSkillInput={setShowSkillInput}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      )}

      <SkillsetList
        skillsets={skillsets}
        editingId={editingId}
        showForm={showForm}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
