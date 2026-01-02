"use client";

import { Education } from "../types/education";
import FileUploader from "../FileUploader";
import SkillInput from "./SkillInput";

interface EducationFormProps {
  formData: Education;
  editingId: string | null;
  showSkillInput: boolean;
  tempSkill: string;
  tempSkillImage: string;
  onFormChange: (data: Partial<Education>) => void;
  onSkillChange: (skill: string) => void;
  onSkillImageChange: (image: string) => void;
  onAddSkill: () => void;
  onRemoveSkill: (index: number) => void;
  onShowSkillInput: (show: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function EducationForm({
  formData,
  editingId,
  showSkillInput,
  tempSkill,
  tempSkillImage,
  onFormChange,
  onSkillChange,
  onSkillImageChange,
  onAddSkill,
  onRemoveSkill,
  onShowSkillInput,
  onSubmit,
  onCancel,
}: EducationFormProps) {
  const toDisplayDate = (value: string) => {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    if (!year || !month || !day) return value;
    return `${day}/${month}/${year}`;
  };

  const fromDisplayDate = (value: string) => {
    const [day, month, year] = value.split("/");
    if (!day || !month || !year) return value;
    return `${year}-${month}-${day}`;
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-lg p-6 space-y-4"
    >
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
            value={formData.degree}
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
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-900 dark:text-white">
            Start Date *
          </label>
          <input
            type="text"
            inputMode="numeric"
            pattern="\\d{2}/\\d{2}/\\d{4}"
            placeholder="DD/MM/YYYY"
            value={toDisplayDate(formData.startDate)}
            onChange={(e) =>
              onFormChange({ startDate: fromDisplayDate(e.target.value) })
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
            type="text"
            inputMode="numeric"
            pattern="\\d{2}/\\d{2}/\\d{4}"
            placeholder="DD/MM/YYYY"
            value={toDisplayDate(formData.endDate || "")}
            onChange={(e) =>
              onFormChange({ endDate: fromDisplayDate(e.target.value) })
            }
            disabled={formData.isCurrentlyStudying}
            className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:focus:ring-purple-500"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-900 dark:text-white">
            Institution Logo
          </label>
          <FileUploader
            imageUrl={formData.logo || ""}
            onFieldChange={(url) => onFormChange({ logo: url })}
          />
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

      <div className="flex gap-2">
        <button
          type="submit"
          className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          {editingId ? "Update" : "Create"} Education
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
