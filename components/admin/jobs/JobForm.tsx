"use client";

import { Job } from "../types/job";
import FileUploader from "../FileUploader";
import SkillInput from "./SkillInput";
import ResponsibilityInput from "./ResponsibilityInput";
import DatePicker from "../ui/DatePicker";

interface JobFormProps {
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
  formData,
  editingId,
  showSkillInput,
  showResponsibilityInput,
  tempSkill,
  tempSkillImage,
  tempResponsibility,
  onFormChange,
  onSkillChange,
  onSkillImageChange,
  onAddSkill,
  onRemoveSkill,
  onShowSkillInput,
  onResponsibilityChange,
  onAddResponsibility,
  onRemoveResponsibility,
  onShowResponsibilityInput,
  onSubmit,
  onCancel,
}: JobFormProps) {
  return (
    <form
      onSubmit={onSubmit}
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
            Company Logo
          </label>
          <FileUploader
            imageUrl={formData.logo || ""}
            onFieldChange={(url) => onFormChange({ logo: url })}
          />
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

      <SkillInput
        skills={formData.skills}
        tempSkill={tempSkill}
        tempSkillImage={tempSkillImage}
        showSkillInput={showSkillInput}
        onSkillChange={onSkillChange}
        onSkillImageChange={onSkillImageChange}
        onAddSkill={onAddSkill}
        onRemoveSkill={onRemoveSkill}
        onShowSkillInput={onShowSkillInput}
      />

      <ResponsibilityInput
        responsibilities={formData.responsibilities}
        tempResponsibility={tempResponsibility}
        showResponsibilityInput={showResponsibilityInput}
        onResponsibilityChange={onResponsibilityChange}
        onAddResponsibility={onAddResponsibility}
        onRemoveResponsibility={onRemoveResponsibility}
        onShowResponsibilityInput={onShowResponsibilityInput}
      />

      <div className="flex gap-2">
        <button
          type="submit"
          className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          {editingId ? "Update" : "Create"} Job
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
