"use client";

import { useState, useEffect } from "react";
import ConfirmDialog from "./ConfirmDialog";
import { Education } from "./types/education";
import { EducationHeader, EducationForm, EducationList } from "./education";

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
    logo: "",
    isCurrentlyStudying: false,
    skills: [],
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

      console.log("Submitting education data:", dataToSubmit);
      console.log("Skills in submission:", dataToSubmit.skills);

      if (editingId) {
        const res = await fetch(`/api/admin/educations/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSubmit),
        });

        const responseData = await res.json();

        if (!res.ok) {
          console.error(
            "Failed to update education. Status:",
            res.status,
            "Response:",
            responseData
          );
          alert(
            `Error updating education: ${responseData.error || "Unknown error"}`
          );
          return;
        }

        console.log("Education updated successfully:", responseData);
        setEducations(
          educations.map((e) => (e._id === editingId ? responseData : e))
        );
      } else {
        const res = await fetch("/api/admin/educations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSubmit),
        });

        const responseData = await res.json();

        if (!res.ok) {
          console.error(
            "Failed to create education. Status:",
            res.status,
            "Response:",
            responseData
          );
          alert(
            `Error creating education: ${responseData.error || "Unknown error"}`
          );
          return;
        }

        console.log("Education created successfully:", responseData);
        setEducations([...educations, responseData]);
      }
      resetForm();
    } catch (error) {
      console.error("Error during education submission:", error);
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
      title: "Delete Education",
      message:
        "Are you sure you want to delete this education? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await fetch(`/api/admin/educations/${id}`, { method: "DELETE" });
          setEducations(educations.filter((e) => e._id !== id));
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
    const formatDate = (date: string | Date | undefined): string => {
      if (!date) return "";
      const d = new Date(date);
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${d.getFullYear()}-${month}-${day}`;
    };

    setFormData({
      ...education,
      startDate: formatDate(education.startDate),
      endDate: formatDate(education.endDate),
      skills: education.skills || [],
    });
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
      logo: "",
      isCurrentlyStudying: false,
      skills: [],
    });
    setEditingId(null);
    setShowForm(false);
    setShowSkillInput(false);
    setTempSkill("");
    setTempSkillImage("");
  };

  const handleFormChange = (data: Partial<Education>) => {
    setFormData({ ...formData, ...data });
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
        Loading educations...
      </div>
    );

  return (
    <div className="space-y-6">
      <EducationHeader
        educationCount={educations.length}
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
        <EducationForm
          formData={formData}
          editingId={editingId}
          showSkillInput={showSkillInput}
          tempSkill={tempSkill}
          tempSkillImage={tempSkillImage}
          onFormChange={handleFormChange}
          onSkillChange={setTempSkill}
          onSkillImageChange={setTempSkillImage}
          onAddSkill={handleAddSkill}
          onRemoveSkill={handleRemoveSkill}
          onShowSkillInput={setShowSkillInput}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      )}

      <EducationList
        educations={educations}
        editingId={editingId}
        showForm={showForm}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
