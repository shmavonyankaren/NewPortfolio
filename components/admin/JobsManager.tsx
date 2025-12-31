"use client";

import { useState, useEffect } from "react";
import { Trash2, Edit2, Plus, Trash } from "lucide-react";
import FileUploader from "./FileUploader";
import ConfirmDialog from "./ConfirmDialog";

interface Job {
  _id?: string;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate?: string;
  isCurrentlyWorking: boolean;
  skills: string[];
  logo?: string;
}

export default function JobsManager() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Job>({
    company: "",
    position: "",
    description: "",
    startDate: "",
    endDate: "",
    isCurrentlyWorking: false,
    skills: [],
    logo: "",
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/admin/jobs");
      const data = await res.json();
      setJobs(data);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/jobs/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const updated = await res.json();
        setJobs(jobs.map((j) => (j._id === editingId ? updated : j)));
      } else {
        const res = await fetch("/api/admin/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const newJob = await res.json();
        setJobs([...jobs, newJob]);
      }
      resetForm();
    } catch (error) {
      console.error("Failed to save job:", error);
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Job",
      message:
        "Are you sure you want to delete this job? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await fetch(`/api/admin/jobs/${id}`, { method: "DELETE" });
          setJobs(jobs.filter((j) => j._id !== id));
        } catch (error) {
          console.error("Failed to delete job:", error);
        }
      },
    });
  };

  const handleDeleteAll = async () => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete All Jobs",
      message: `Are you sure you want to delete all ${jobs.length} jobs? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await Promise.all(
            jobs.map((job) =>
              fetch(`/api/admin/jobs/${job._id}`, { method: "DELETE" })
            )
          );
          setJobs([]);
        } catch (error) {
          console.error("Failed to delete all jobs:", error);
        }
      },
    });
  };

  const handleEdit = (job: Job) => {
    setFormData(job);
    setEditingId(job._id || null);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      company: "",
      position: "",
      description: "",
      startDate: "",
      endDate: "",
      isCurrentlyWorking: false,
      skills: [],
      logo: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading)
    return (
      <div className="text-slate-900 dark:text-white">Loading jobs...</div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
          Jobs Management
        </h3>
        <div className="flex gap-2">
          {jobs.length > 0 && (
            <button
              onClick={handleDeleteAll}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              <Trash size={20} />
              Delete All
            </button>
          )}
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            <Plus size={20} />
            Add Job
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
                Company *
              </label>
              <input
                type="text"
                placeholder="Company name"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
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
                placeholder="e.g., Senior Developer"
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
                disabled={formData.isCurrentlyWorking}
                className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:focus:ring-purple-500"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-900 dark:text-white">
                Company Logo
              </label>
              <FileUploader
                imageUrl={formData.logo || ""}
                onFieldChange={(url) => setFormData({ ...formData, logo: url })}
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-slate-900 dark:text-white pb-2">
                <input
                  type="checkbox"
                  checked={formData.isCurrentlyWorking}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isCurrentlyWorking: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
                Currently Working
              </label>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-900 dark:text-white">
              Description *
            </label>
            <textarea
              placeholder="Detailed job description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500"
              rows={4}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-900 dark:text-white">
              Skills
            </label>
            <input
              type="text"
              placeholder="React, TypeScript, Node.js (comma-separated)"
              value={formData.skills.join(", ")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  skills: e.target.value.split(",").map((s) => s.trim()),
                })
              }
              className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              {editingId ? "Update" : "Create"} Job
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
        {jobs.length === 0 ? (
          <div className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-lg p-8 text-center">
            <p className="text-slate-600 dark:text-gray-400 text-lg">
              No jobs yet. Click &quot;Add Job&quot; to create one.
            </p>
          </div>
        ) : (
          jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex-1">
                <h4 className="text-slate-900 dark:text-white font-semibold">
                  {job.position} at {job.company}
                </h4>
                <p className="text-slate-600 dark:text-gray-400 text-sm">
                  {job.description}
                </p>
                {job.skills.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-purple-600/20 text-purple-700 dark:text-purple-300 text-xs px-2 py-1 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(job)}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(job._id!)}
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
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
