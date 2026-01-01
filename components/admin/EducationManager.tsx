"use client";

import { useState, useEffect } from "react";
import { Trash2, Edit2, Plus, Trash } from "lucide-react";
import FileUploader from "./FileUploader";
import ConfirmDialog from "./ConfirmDialog";

interface Education {
  _id?: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  description: string;
  gpa?: number;
  logo?: string;
}

export default function EducationManager() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Education>({
    institution: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    description: "",
    gpa: undefined,
    logo: "",
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  useEffect(() => {
    fetchEducations();
  }, []);

  const fetchEducations = async () => {
    try {
      const res = await fetch("/api/admin/educations");
      const data = await res.json();
      setEducations(data);
    } catch (error) {
      console.error("Failed to fetch educations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/educations/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const updated = await res.json();
        setEducations(
          educations.map((ed) => (ed._id === editingId ? updated : ed))
        );
      } else {
        const res = await fetch("/api/admin/educations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const newEducation = await res.json();
        setEducations([...educations, newEducation]);
      }
      resetForm();
    } catch (error) {
      console.error("Failed to save education:", error);
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Education",
      message:
        "Are you sure you want to delete this education? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await fetch(`/api/admin/educations/${id}`, { method: "DELETE" });
          setEducations(educations.filter((ed) => ed._id !== id));
        } catch (error) {
          console.error("Failed to delete education:", error);
        }
      },
    });
  };

  const handleDeleteAll = async () => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete All Educations",
      message: `Are you sure you want to delete all ${educations.length} educations? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const res = await fetch("/api/admin/educations", {
            method: "DELETE",
          });
          if (!res.ok) {
            throw new Error("Failed to delete all educations");
          }
          setEducations([]);
          console.log("All educations deleted successfully");
        } catch (error) {
          console.error("Failed to delete all educations:", error);
          alert("Error deleting all educations");
        }
      },
    });
  };

  const handleEdit = (education: Education) => {
    setFormData(education);
    setEditingId(education._id || null);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      description: "",
      gpa: undefined,
      logo: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading)
    return (
      <div className="text-slate-900 dark:text-white">
        Loading educations...
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
          Education Management
        </h3>
        <div className="flex gap-2">
          {educations.length > 0 && (
            <button
              onClick={handleDeleteAll}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              <Trash size={20} />
              Delete All
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
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            {showForm && !editingId ? (
              <>
                <Plus size={20} className="rotate-45" />
                Close
              </>
            ) : (
              <>
                <Plus size={20} />
                Add Education
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-900 dark:text-white">
                Institution *
              </label>
              <input
                type="text"
                placeholder="University or School name"
                value={formData.institution}
                onChange={(e) =>
                  setFormData({ ...formData, institution: e.target.value })
                }
                className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-900 dark:text-white">
                Degree *
              </label>
              <input
                type="text"
                placeholder="e.g., Bachelor, Master"
                value={formData.degree}
                onChange={(e) =>
                  setFormData({ ...formData, degree: e.target.value })
                }
                className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-900 dark:text-white">
                Field of Study *
              </label>
              <input
                type="text"
                placeholder="e.g., Computer Science"
                value={formData.field}
                onChange={(e) =>
                  setFormData({ ...formData, field: e.target.value })
                }
                className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-900 dark:text-white">
                Start Date *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:focus:ring-purple-500"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-900 dark:text-white">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:focus:ring-purple-500"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-900 dark:text-white">
                GPA
              </label>
              <input
                type="number"
                placeholder="e.g., 3.8"
                step="0.01"
                min="0"
                max="4"
                value={formData.gpa || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gpa: e.target.value
                      ? parseFloat(e.target.value)
                      : undefined,
                  })
                }
                className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-900 dark:text-white">
                Institution Logo
              </label>
              <FileUploader
                imageUrl={formData.logo || null}
                onFieldChange={(url) => setFormData({ ...formData, logo: url })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-900 dark:text-white">
              Description *
            </label>
            <textarea
              placeholder="Detailed description of your education"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
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
              {editingId ? "Update" : "Create"} Education
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
        {educations.length === 0 ? (
          <div className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-lg p-8 text-center">
            <p className="text-slate-600 dark:text-gray-400 text-lg">
              No education records yet. Click &quot;Add Education&quot; to
              create one.
            </p>
          </div>
        ) : (
          educations
            .filter((e) => e._id !== editingId)
            .map((education) => (
              <div
                key={education._id}
                className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <h4 className="text-slate-900 dark:text-white font-semibold">
                    {education.degree} in {education.field}
                  </h4>
                  <p className="text-slate-600 dark:text-gray-400 text-sm">
                    {education.institution}
                  </p>
                  <p className="text-slate-500 dark:text-gray-500 text-xs mt-1">
                    {education.description}
                  </p>
                  {education.gpa && (
                    <p className="text-slate-600 dark:text-gray-400 text-sm mt-1">
                      GPA: {education.gpa}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(education)}
                    disabled={showForm && !editingId}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(education._id!)}
                    disabled={showForm && !editingId}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
