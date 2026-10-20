"use client";

import AdminForm, { AdminSaveButton } from "../common/AdminForm";

import { useState } from "react";
import NestedItemsEditor from "../common/NestedItemsEditor";
import OrderField from "../common/OrderField";

import { Education } from "../types/education";
import FileUploader from "../FileUploader";
import DatePicker from "../ui/DatePicker";

interface EducationFormProps {
  itemCount: number;
  formData: Education;
  editingId: string | null;
  showSkillInput: boolean;
  tempSkill: string;
  tempSkillImage: string;
  tempSkillDescription: string;
  editingSkillIndex: number | null;
  onUpdateSkill: () => void;
  onCancelEditSkill: () => void;
  onEditSkill: (index: number) => void;
  onFormChange: (data: Partial<Education>) => void;
  onSkillChange: (skill: string) => void;
  onSkillImageChange: (image: string) => void;
  onSkillDescriptionChange: (description: string) => void;
  onAddSkill: () => void;
  onRemoveSkill: (index: number) => void;
  onShowSkillInput: (show: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function EducationForm({
  itemCount,
  formData,
  editingId,
  showSkillInput,
  editingSkillIndex,
  onFormChange,
  onShowSkillInput,
  onSubmit,
  onCancel,
}: EducationFormProps) {
  const [uploadingLogo, setUploadingLogo] = useState(false);
  return (
    <AdminForm complete={!!formData.logo?.trim()} pendingEdits={showSkillInput || editingSkillIndex !== null}
      onSubmit={onSubmit}
      className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-lg p-6 space-y-4"
    >
      <OrderField value={formData.order} maximum={itemCount + (editingId ? 0 : 1)} onChange={order => onFormChange({ order })} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-900 dark:text-white">
            Institution *
          </label>
          <input
            type="text"
            placeholder="University or School name"
            value={formData.institution}
            onChange={(e) => onFormChange({ institution: e.target.value })}
            className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-900 dark:text-white">
            Degree
          </label>
          <input
            type="text"
            placeholder="e.g., Bachelor of Science"
            value={formData.degree || ""}
            onChange={(e) => onFormChange({ degree: e.target.value })}
            className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500"
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
            onChange={(e) => onFormChange({ field: e.target.value })}
            className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500"
            required
          />
        </div>
        <DatePicker
          label="Start Date *"
          value={formData.startDate}
          onChange={(date) => onFormChange({ startDate: date })}
          required
        />
        <DatePicker
          label="End Date"
          value={formData.endDate || ""}
          onChange={(date) => onFormChange({ endDate: date })}
          disabled={formData.isCurrentlyStudying}
        />
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-900 dark:text-white">
            Institution Logo *
          </label>
          <FileUploader
            imageUrl={formData.logo || ""}
            onFieldChange={(url) => onFormChange({ logo: url })}
            onUploadingChange={setUploadingLogo}
          />
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">A logo is required. Replace the placeholder with your own image.</p>
          {formData.logo && <button type="button" disabled={uploadingLogo} onClick={() => onFormChange({ logo: "" })}
            className="mt-2 text-sm text-red-600 dark:text-red-400">Remove logo</button>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isCurrentlyStudying"
          checked={formData.isCurrentlyStudying}
          onChange={(e) =>
            onFormChange({ isCurrentlyStudying: e.target.checked })
          }
          className="w-4 h-4"
        />
        <label
          htmlFor="isCurrentlyStudying"
          className="text-sm font-medium text-slate-900 dark:text-white"
        >
          Currently Studying
        </label>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-900 dark:text-white">
          Description *
        </label>
        <textarea
          placeholder="Detailed education description"
          value={formData.description}
          onChange={(e) => onFormChange({ description: e.target.value })}
          className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500"
          rows={4}
          required
        />
      </div>

      <NestedItemsEditor
        title="Skills" singular="Skill"
        items={formData.skills} fields={[{ key: "name", label: "Skill Name", required: true }, { key: "image", label: "Icon/Logo", kind: "image" }, { key: "description", label: "Description", kind: "textarea" }]}
        onChange={skills => onFormChange({ skills })}
        onEditingChange={onShowSkillInput}
      />

      <div className="flex gap-2">
        <AdminSaveButton
          type="submit"
          disabled={uploadingLogo || !formData.logo?.trim()}
          className="disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          {editingId ? "Update" : "Create"} Education
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
