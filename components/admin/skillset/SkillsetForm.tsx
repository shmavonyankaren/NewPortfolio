"use client";

import { Skillset } from "../types/skillset";
import SkillItemInput from "./SkillItemInput";

interface SkillsetFormProps {
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
  formData,
  editingId,
  showSkillInput,
  tempSkillName,
  onFormChange,
  onSkillNameChange,
  onAddSkill,
  onRemoveSkill,
  onShowSkillInput,
  onSubmit,
  onCancel,
}: SkillsetFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-lg p-6 space-y-4"
    >
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

      <SkillItemInput
        skills={formData.skills}
        tempSkillName={tempSkillName}
        showSkillInput={showSkillInput}
        onSkillNameChange={onSkillNameChange}
        onAddSkill={onAddSkill}
        onRemoveSkill={onRemoveSkill}
        onShowSkillInput={onShowSkillInput}
      />

      <div className="flex gap-2">
        <button
          type="submit"
          className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          {editingId ? "Update" : "Create"} Skillset
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
