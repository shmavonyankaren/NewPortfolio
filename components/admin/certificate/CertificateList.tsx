"use client";

import { Certificate } from "../types/certificate";
import CertificateCard from "./CertificateCard";

interface CertificateListProps {
  certificates: Certificate[];
  editingId: string | null;
  showForm: boolean;
  onEdit: (certificate: Certificate) => void;
  onDelete: (id: string) => void;
}

export default function CertificateList({
  certificates,
  editingId,
  showForm,
  onEdit,
  onDelete,
}: CertificateListProps) {
  if (!certificates || certificates.length === 0) {
    return (
      <div className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-lg p-8 text-center">
        <p className="text-slate-600 dark:text-gray-400 text-lg">
          No certificates yet. Click &quot;Add&quot; to create one.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {certificates
        .filter((c) => c._id !== editingId)
        .map((certificate, index) => (
          <CertificateCard
            key={certificate._id || `certificate-${index}`}
            certificate={certificate}
            showForm={showForm}
            editingId={editingId}
            onEdit={() => onEdit(certificate)}
            onDelete={() => onDelete(certificate._id!)}
          />
        ))}
    </div>
  );
}
