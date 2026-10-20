"use client";

import AdminForm, { AdminSaveButton } from "../common/AdminForm";

import { useState } from "react";
import NestedItemsEditor from "../common/NestedItemsEditor";
import OrderField from "../common/OrderField";

import { Job } from "../types/job";
import FileUploader from "../FileUploader";
import DatePicker from "../ui/DatePicker";

interface JobFormProps {
  itemCount: number;
  formData: Job;
  editingId: string | null;
  showSkillInput: boolean;
  showResponsibilityInput: boolean;
  tempSkill: string;
  tempSkillImage: string;
  tempResponsibility: string;
  onFormChange: (data: Partial<Job>) => void;
  onSkillChange: (skill: string) => void;
  onSkillImageChange: (image: string) => void;
  onAddSkill: () => void;
  onRemoveSkill: (index: number) => void;
  onShowSkillInput: (show: boolean) => void;
  onResponsibilityChange: (responsibility: string) => void;
  onAddResponsibility: () => void;
  onRemoveResponsibility: (index: number) => void;
  onShowResponsibilityInput: (show: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function JobForm({
  itemCount,
  formData,
  editingId,
  showSkillInput,
  showResponsibilityInput,
  onFormChange,
  onShowSkillInput,
  onShowResponsibilityInput,
  onSubmit,
  onCancel,
}: JobFormProps) {
  const [uploadingLogo, setUploadingLogo] = useState(false);
  return (
    <AdminForm complete={!!formData.logo?.trim()} pendingEdits={showSkillInput || showResponsibilityInput}
      onSubmit={onSubmit}
      className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-lg p-6 space-y-4"
    >
      <OrderField value={formData.order} maximum={itemCount + (editingId ? 0 : 1)} onChange={order => onFormChange({ order })} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-900 dark:text-white">
            Company *
          </label>
          <input
            type="text"
            placeholder="Company name"
            value={formData.company}
            onChange={(e) => onFormChange({ company: e.target.value })}
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
            onChange={(e) => onFormChange({ position: e.target.value })}
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
          disabled={formData.isCurrentlyWorking}
        />
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-900 dark:text-white">
            Company Logo *
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
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-slate-900 dark:text-white pb-2">
            <input
              type="checkbox"
              checked={formData.isCurrentlyWorking}
              onChange={(e) =>
                onFormChange({ isCurrentlyWorking: e.target.checked })
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
          onChange={(e) => onFormChange({ description: e.target.value })}
          className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500"
          rows={4}
          required
        />
      </div>

      <NestedItemsEditor
        title="Skills" singular="Skill"
        items={formData.skills} fields={[{ key: "name", label: "Skill Name", required: true }, { key: "image", label: "Icon/Logo", kind: "image" }]}
        onChange={skills => onFormChange({ skills })}
        onEditingChange={onShowSkillInput}
      />

      <NestedItemsEditor
        title="Responsibilities" singular="Responsibility"
        items={formData.responsibilities} fields={[{ key: "name", label: "Responsibility Description", kind: "textarea", required: true }]}
        onChange={responsibilities => onFormChange({ responsibilities })}
        onEditingChange={onShowResponsibilityInput}
      />

      <div className="flex gap-2">
        <AdminSaveButton
          type="submit"
          disabled={uploadingLogo || !formData.logo?.trim()}
          className="disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          {editingId ? "Update" : "Create"} Job
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
