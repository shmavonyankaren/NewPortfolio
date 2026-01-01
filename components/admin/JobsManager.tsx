"use client";

import { useState, useEffect } from "react";
import ConfirmDialog from "./ConfirmDialog";
import JobHeader from "./jobs/JobHeader";
import JobForm from "./jobs/JobForm";
import JobList from "./jobs/JobList";
import { Job } from "./types/job";

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
    responsibilities: [],
    logo: "",
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [tempSkill, setTempSkill] = useState("");
  const [tempSkillImage, setTempSkillImage] = useState("");
  const [showResponsibilityInput, setShowResponsibilityInput] = useState(false);
  const [tempResponsibility, setTempResponsibility] = useState("");

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
      // Prepare data with proper date formatting
      const dataToSubmit = {
        ...formData,
        startDate: formData.startDate
          ? new Date(formData.startDate).toISOString()
          : new Date().toISOString(),
        endDate: formData.endDate
          ? new Date(formData.endDate).toISOString()
          : undefined,
      };

      console.log("Submitting job data:", dataToSubmit);

      if (editingId) {
        const res = await fetch(`/api/admin/jobs/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSubmit),
        });

        const responseData = await res.json();

        if (!res.ok) {
          console.error(
            "Failed to update job. Status:",
            res.status,
            "Response:",
            responseData
          );
          alert(`Error updating job: ${responseData.error || "Unknown error"}`);
          return;
        }

        console.log("Job updated successfully:", responseData);
        setJobs(jobs.map((j) => (j._id === editingId ? responseData : j)));
      } else {
        const res = await fetch("/api/admin/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSubmit),
        });

        const responseData = await res.json();

        if (!res.ok) {
          console.error(
            "Failed to create job. Status:",
            res.status,
            "Response:",
            responseData
          );
          alert(`Error creating job: ${responseData.error || "Unknown error"}`);
          return;
        }

        console.log("Job created successfully:", responseData);
        setJobs([...jobs, responseData]);
      }
      resetForm();
    } catch (error) {
      console.error("Error during job submission:", error);
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
          const res = await fetch("/api/admin/jobs", { method: "DELETE" });
          if (!res.ok) {
            throw new Error("Failed to delete all jobs");
          }
          setJobs([]);
          console.log("All jobs deleted successfully");
        } catch (error) {
          console.error("Failed to delete all jobs:", error);
          alert("Error deleting all jobs");
        }
      },
    });
  };

  const handleEdit = (job: Job) => {
    // Format dates for date input fields (YYYY-MM-DD)
    const formatDate = (date: string | Date | undefined): string => {
      if (!date) return "";
      const d = new Date(date);
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${d.getFullYear()}-${month}-${day}`;
    };

    setFormData({
      ...job,
      startDate: formatDate(job.startDate),
      endDate: formatDate(job.endDate),
      skills: (job.skills || []).map((s) =>
        typeof s === "string" ? { name: s } : s
      ),
      responsibilities: job.responsibilities || [],
    });
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
      responsibilities: [],
      logo: "",
    });
    setEditingId(null);
    setShowForm(false);
    setShowSkillInput(false);
    setTempSkill("");
    setTempSkillImage("");
    setShowResponsibilityInput(false);
    setTempResponsibility("");
  };

  const handleAddSkill = () => {
    if (tempSkill.trim()) {
      setFormData({
        ...formData,
        skills: [
          ...formData.skills,
          { name: tempSkill.trim(), image: tempSkillImage },
        ],
      });
      setTempSkill("");
      setTempSkillImage("");
      setShowSkillInput(false);
    }
  };

  const handleRemoveSkill = (index: number) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index),
    });
  };

  const handleAddResponsibility = () => {
    if (tempResponsibility.trim()) {
      setFormData({
        ...formData,
        responsibilities: [
          ...formData.responsibilities,
          { name: tempResponsibility.trim() },
        ],
      });
      setTempResponsibility("");
      setShowResponsibilityInput(false);
    }
  };

  const handleRemoveResponsibility = (index: number) => {
    setFormData({
      ...formData,
      responsibilities: formData.responsibilities.filter((_, i) => i !== index),
    });
  };

  if (loading)
    return (
      <div className="text-slate-900 dark:text-white">Loading jobs...</div>
    );

  return (
    <div className="space-y-6">
      <JobHeader
        jobCount={jobs.length}
        showForm={showForm}
        editingId={editingId}
        onAddClick={() => {
          if (showForm && !editingId) {
            resetForm();
          } else {
            setShowForm(true);
          }
        }}
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
        <JobForm
          formData={formData}
          editingId={editingId}
          showSkillInput={showSkillInput}
          showResponsibilityInput={showResponsibilityInput}
          tempSkill={tempSkill}
          tempSkillImage={tempSkillImage}
          tempResponsibility={tempResponsibility}
          onFormChange={(data) => setFormData({ ...formData, ...data })}
          onSkillChange={setTempSkill}
          onSkillImageChange={setTempSkillImage}
          onAddSkill={handleAddSkill}
          onRemoveSkill={handleRemoveSkill}
          onShowSkillInput={setShowSkillInput}
          onResponsibilityChange={setTempResponsibility}
          onAddResponsibility={handleAddResponsibility}
          onRemoveResponsibility={handleRemoveResponsibility}
          onShowResponsibilityInput={setShowResponsibilityInput}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      )}

      <JobList
        jobs={jobs}
        editingId={editingId}
        showForm={showForm}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
