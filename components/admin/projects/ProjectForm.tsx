"use client";

import FileUploader from "../FileUploader";
import TechnologyInput from "./TechnologyInput";
import FeatureInput from "./FeatureInput";
import ChallengeInput from "./ChallengeInput";

interface Technology {
  name: string;
  icon?: string;
}

interface Feature {
  title: string;
  description: string;
}

interface Challenge {
  challenge: string;
  solution: string;
}

interface Project {
  _id?: string;
  title: string;
  description: string;
  shortDescription: string;
  image: string;
  technologies: Technology[];
  features: Feature[];
  challenges: Challenge[];
  demoUrl?: string;
  githubUrl?: string;
  duration: string;
  teamType: "solo" | "team";
  status: "Live & Maintained" | "In Development" | "Planned";
}

interface ProjectFormProps {
  formData: Project;
  editingId: string | null;
  errorMessage?: string;
  showTechInput: boolean;
  tempTech: { name: string; icon: string };
  showFeatureInput: boolean;
  tempFeature: { title: string; description: string };
  showChallengeInput: boolean;
  tempChallenge: { challenge: string; solution: string };
  onFormDataChange: (data: Project) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onShowTechInput: (show: boolean) => void;
  onTempTechChange: (tech: { name: string; icon: string }) => void;
  onAddTechnology: () => void;
  onShowFeatureInput: (show: boolean) => void;
  onTempFeatureChange: (feature: {
    title: string;
    description: string;
  }) => void;
  onAddFeature: () => void;
  onShowChallengeInput: (show: boolean) => void;
  onTempChallengeChange: (challenge: {
    challenge: string;
    solution: string;
  }) => void;
  onAddChallenge: () => void;
}

export default function ProjectForm({
  formData,
  editingId,
  errorMessage,
  showTechInput,
  tempTech,
  showFeatureInput,
  tempFeature,
  showChallengeInput,
  tempChallenge,
  onFormDataChange,
  onSubmit,
  onCancel,
  onShowTechInput,
  onTempTechChange,
  onAddTechnology,
  onShowFeatureInput,
  onTempFeatureChange,
  onAddFeature,
  onShowChallengeInput,
  onTempChallengeChange,
  onAddChallenge,
}: ProjectFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-lg p-6 space-y-6"
    >
      {/* Basic Information */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
          Basic Information
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-900 dark:text-white">
              Title *
            </label>
            <input
              type="text"
              placeholder="Project title"
              value={formData.title}
              onChange={(e) =>
                onFormDataChange({ ...formData, title: e.target.value })
              }
              className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-900 dark:text-white">
              Short Description *
            </label>
            <input
              type="text"
              placeholder="Brief description"
              value={formData.shortDescription}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  shortDescription: e.target.value,
                })
              }
              className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-900 dark:text-white">
              Project Screenshot *
            </label>
            <FileUploader
              imageUrl={formData.image}
              onFieldChange={(url) =>
                onFormDataChange({ ...formData, image: url })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-900 dark:text-white">
              Duration
            </label>
            <input
              type="text"
              placeholder="e.g., 3 months"
              value={formData.duration}
              onChange={(e) =>
                onFormDataChange({ ...formData, duration: e.target.value })
              }
              className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-900 dark:text-white">
              Team Type *
            </label>
            <select
              value={formData.teamType}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  teamType: e.target.value as "solo" | "team",
                })
              }
              className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-slate-900 dark:text-white dark:border-white/20 dark:focus:ring-purple-500 appearance-none cursor-pointer"
              required
            >
              <option value="solo">Solo Project</option>
              <option value="team">Team Project</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-900 dark:text-white">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  status: e.target.value as
                    | "Live & Maintained"
                    | "In Development"
                    | "Planned",
                })
              }
              className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-slate-900 dark:text-white dark:border-white/20 dark:focus:ring-purple-500 appearance-none cursor-pointer"
              required
            >
              <option value="Live & Maintained">Live & Maintained</option>
              <option value="In Development">In Development</option>
              <option value="Planned">Planned</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-900 dark:text-white">
              Demo URL
            </label>
            <input
              type="url"
              placeholder="https://demo.example.com"
              value={formData.demoUrl}
              onChange={(e) =>
                onFormDataChange({ ...formData, demoUrl: e.target.value })
              }
              className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-900 dark:text-white">
              GitHub URL
            </label>
            <input
              type="url"
              placeholder="https://github.com/username/repo"
              value={formData.githubUrl}
              onChange={(e) =>
                onFormDataChange({ ...formData, githubUrl: e.target.value })
              }
              className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-900 dark:text-white">
            Full Description *
          </label>
          <textarea
            placeholder="Detailed project description"
            value={formData.description}
            onChange={(e) =>
              onFormDataChange({ ...formData, description: e.target.value })
            }
            className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500"
            rows={4}
            required
          />
        </div>
      </div>

      {/* Technologies */}
      <TechnologyInput
        technologies={formData.technologies}
        showInput={showTechInput}
        tempTech={tempTech}
        onShowInput={onShowTechInput}
        onTempTechChange={onTempTechChange}
        onAddTechnology={onAddTechnology}
        onRemoveTechnology={(index) => {
          const newTechs = formData.technologies.filter((_, i) => i !== index);
          onFormDataChange({ ...formData, technologies: newTechs });
        }}
      />

      {/* Features */}
      <FeatureInput
        features={formData.features}
        showInput={showFeatureInput}
        tempFeature={tempFeature}
        onShowInput={onShowFeatureInput}
        onTempFeatureChange={onTempFeatureChange}
        onAddFeature={onAddFeature}
        onRemoveFeature={(index) => {
          const newFeatures = formData.features.filter((_, i) => i !== index);
          onFormDataChange({ ...formData, features: newFeatures });
        }}
      />

      {/* Challenges */}
      <ChallengeInput
        challenges={formData.challenges}
        showInput={showChallengeInput}
        tempChallenge={tempChallenge}
        onShowInput={onShowChallengeInput}
        onTempChallengeChange={onTempChallengeChange}
        onAddChallenge={onAddChallenge}
        onRemoveChallenge={(index) => {
          const newChallenges = formData.challenges.filter(
            (_, i) => i !== index
          );
          onFormDataChange({ ...formData, challenges: newChallenges });
        }}
      />

      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500 text-red-600 dark:text-red-400 px-4 py-3 rounded">
          {errorMessage}
        </div>
      )}

      <div className="flex gap-2 border-t border-slate-300 dark:border-white/10 pt-4">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          {editingId ? "Update" : "Create"} Project
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
