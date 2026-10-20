"use client";

import AdminForm, { AdminSaveButton } from "../common/AdminForm";

import { useState } from "react";
import FileUploader from "../FileUploader";
import NestedItemsEditor from "../common/NestedItemsEditor";
import OrderField from "../common/OrderField";

import { Skillset } from "../types/skillset";

interface SkillsetFormProps {
  itemCount: number;
  formData: Skillset;
  editingId: string | null;
  showSkillInput: boolean;
  tempSkillName: string;
  onFormChange: (data: Partial<Skillset>) => void;
  onSkillNameChange: (name: string) => void;
  onAddSkill: () => void;
  onRemoveSkill: (index: number) => void;
  onShowSkillInput: (show: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function SkillsetForm({
  itemCount,
  formData,
  editingId,
  showSkillInput,
  onFormChange,
  onShowSkillInput,
  onSubmit,
  onCancel,
}: SkillsetFormProps) {
  const [uploading, setUploading] = useState(false);
  return (
    <AdminForm complete={!!formData.image?.trim()} pendingEdits={showSkillInput}
      onSubmit={onSubmit}
      className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-lg p-6 space-y-4"
    >
      <OrderField value={formData.order} maximum={itemCount + (editingId ? 0 : 1)} onChange={order => onFormChange({ order })} />
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-900 dark:text-white">
          Skillset Title *
        </label>
        <input
          type="text"
          placeholder="e.g., Frontend Development, Backend Development"
          value={formData.title}
          onChange={(e) => onFormChange({ title: e.target.value })}
          className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500"
          required
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-900 dark:text-white">Skillset image *</p>
        <FileUploader imageUrl={formData.image || null} onFieldChange={image => onFormChange({ image })}
          onUploadingChange={setUploading} />
        <p className="text-xs text-slate-500 dark:text-slate-400">An image is required. Replace the placeholder with your own image.</p>
        {formData.image && <button type="button" disabled={uploading} onClick={() => onFormChange({ image: "" })}
          className="text-sm text-red-600 dark:text-red-400">Remove image</button>}
      </div>

      <NestedItemsEditor
        title="Skills" singular="Skill"
        items={formData.skills} fields={[{ key: "name", label: "Skill Name", required: true }]}
        onChange={skills => onFormChange({ skills })}
        onEditingChange={onShowSkillInput}
      />

      <div className="flex gap-2">
        <AdminSaveButton
          type="submit"
          disabled={uploading || !formData.image?.trim()}
          className="disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          {editingId ? "Update" : "Create"} Skillset
        </AdminSaveButton>
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          Cancel
        </button>
      </div>
    </AdminForm>
  );
}
