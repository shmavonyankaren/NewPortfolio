"use client";

import { useState, useEffect } from "react";
import ConfirmDialog from "./ConfirmDialog";
import { Certificate } from "./types/certificate";
import {
  CertificateHeader,
  CertificateForm,
  CertificateList,
} from "./certificate";

export default function CertificateSectionManager() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Certificate>({
    title: "",
    issuer: "",
    description: "",
    fileUrl: "",
    fileName: "",
    fileType: "",
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await fetch("/api/admin/certificates");
      const data = await res.json();
      setCertificates(data);
    } catch (error) {
      console.error("Failed to fetch certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Submitting certificate data:", formData);

      if (editingId) {
        const res = await fetch(`/api/admin/certificates/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const responseData = await res.json();

        if (!res.ok) {
          console.error(
            "Failed to update certificate. Status:",
            res.status,
            "Response:",
            responseData
          );
          alert(
            `Error updating certificate: ${
              responseData.error || "Unknown error"
            }`
          );
          return;
        }

        console.log("Certificate updated successfully:", responseData);
        setCertificates(
          certificates.map((c) => (c._id === editingId ? responseData : c))
        );
      } else {
        const res = await fetch("/api/admin/certificates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const responseData = await res.json();

        if (!res.ok) {
          console.error(
            "Failed to create certificate. Status:",
            res.status,
            "Response:",
            responseData
          );
          alert(
            `Error creating certificate: ${
              responseData.error || "Unknown error"
            }`
          );
          return;
        }

        console.log("Certificate created successfully:", responseData);
        setCertificates([...certificates, responseData]);
      }
      resetForm();
    } catch (error) {
      console.error("Error during certificate submission:", error);
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
      title: "Delete Certificate",
      message:
        "Are you sure you want to delete this certificate? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await fetch(`/api/admin/certificates/${id}`, { method: "DELETE" });
          setCertificates(certificates.filter((c) => c._id !== id));
        } catch (error) {
          console.error("Failed to delete certificate:", error);
        }
      },
    });
  };

  const handleDeleteAll = async () => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete All Certificates",
      message: `Are you sure you want to delete all ${certificates.length} certificates? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const res = await fetch("/api/admin/certificates", {
            method: "DELETE",
          });
          if (!res.ok) {
            throw new Error("Failed to delete all certificates");
          }
          setCertificates([]);
          console.log("All certificates deleted successfully");
        } catch (error) {
          console.error("Failed to delete all certificates:", error);
          alert("Error deleting all certificates");
        }
      },
    });
  };

  const handleEdit = (certificate: Certificate) => {
    setFormData({
      ...certificate,
    });
    setEditingId(certificate._id || null);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      issuer: "",
      description: "",
      fileUrl: "",
      fileName: "",
      fileType: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleFormChange = (data: Partial<Certificate>) => {
    setFormData({ ...formData, ...data });
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
        Loading certificates...
      </div>
    );

  return (
    <div className="space-y-6">
      <CertificateHeader
        certificateCount={certificates.length}
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
        <CertificateForm
          formData={formData}
          editingId={editingId}
          onFormChange={handleFormChange}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      )}

      <CertificateList
        certificates={certificates}
        editingId={editingId}
        showForm={showForm}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
