"use client";

import { useState, useEffect } from "react";
import ConfirmDialog from "./ConfirmDialog";
import { GeneralInfo } from "./types/generalInfo";
import { GeneralInfoForm, GeneralInfoDisplay } from "./generalInfo";

export default function GeneralInformationManager() {
  const [info, setInfo] = useState<GeneralInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<GeneralInfo>({
    userPhoto: "",
    fullName: "",
    shortAbout: "",
    fullDescription: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  useEffect(() => {
    fetchGeneralInfo();
  }, []);

  const fetchGeneralInfo = async () => {
    try {
      const res = await fetch("/api/admin/general-info");
      const data = await res.json();
      if (data._id) {
        setInfo(data);
        setFormData(data);
      }
    } catch (error) {
      console.error("Failed to fetch general info:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const method = info?._id ? "PUT" : "POST";
      const res = await fetch("/api/admin/general-info", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const updated = await res.json();
      setInfo(updated);
      setFormData(updated);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save general info:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete General Info",
      message:
        "Are you sure you want to delete your general information? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await fetch("/api/admin/general-info", { method: "DELETE" });
          setInfo(null);
          setFormData({
            userPhoto: "",
            fullName: "",
            shortAbout: "",
            fullDescription: "",
          });
          setIsEditing(false);
        } catch (error) {
          console.error("Failed to delete general info:", error);
        }
      },
    });
  };

  const handleFormChange = (data: Partial<GeneralInfo>) => {
    setFormData({ ...formData, ...data });
  };

  if (loading) {
    return (
      <div className="text-slate-900 dark:text-white">
        Loading general info...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Delete"
      />

      {!info || isEditing ? (
        <>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {info ? "Edit" : "Create"} General Information
          </h3>
          <GeneralInfoForm
            formData={formData}
            isEditing={!!info}
            onFormChange={handleFormChange}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsEditing(false);
              setFormData(
                info || {
                  userPhoto: "",
                  fullName: "",
                  shortAbout: "",
                  fullDescription: "",
                }
              );
            }}
            isLoading={isSaving}
          />
        </>
      ) : (
        <div className="space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            General Information
          </h3>
          <GeneralInfoDisplay
            info={info}
            onEdit={() => setIsEditing(true)}
            onDelete={handleDelete}
            isLoading={isSaving}
          />
        </div>
      )}
    </div>
  );
}
