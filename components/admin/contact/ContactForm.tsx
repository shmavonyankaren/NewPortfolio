"use client";

import CVUploader from "../CVUploader";

interface Contact {
  _id?: string;
  email: string;
  phone: string;
  location: string;
  linkedIn?: string;
  github?: string;
  twitter?: string;
  website?: string;
  cvUrl?: string;
}

interface ContactFormProps {
  formData: Contact;
  editingId: string | null;
  onFormDataChange: (data: Contact) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function ContactForm({
  formData,
  editingId,
  onFormDataChange,
  onSubmit,
  onCancel,
}: ContactFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-lg p-6 space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-900 dark:text-white">
            Email *
          </label>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              onFormDataChange({ ...formData, email: e.target.value })
            }
            className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-900 dark:text-white">
            Phone *
          </label>
          <input
            type="tel"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) =>
              onFormDataChange({ ...formData, phone: e.target.value })
            }
            className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-900 dark:text-white">
            Location *
          </label>
          <input
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={(e) =>
              onFormDataChange({ ...formData, location: e.target.value })
            }
            className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-900 dark:text-white">
            Portfolio Website
          </label>
          <input
            type="url"
            placeholder="Portfolio website"
            value={formData.website}
            onChange={(e) =>
              onFormDataChange({ ...formData, website: e.target.value })
            }
            className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-900 dark:text-white">
            CV (PDF)
          </label>
          <CVUploader
            fileUrl={formData.cvUrl || ""}
            onUrlChange={(url) => onFormDataChange({ ...formData, cvUrl: url })}
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-900 dark:text-white">
            LinkedIn Profile
          </label>
          <input
            type="url"
            placeholder="LinkedIn Profile"
            value={formData.linkedIn}
            onChange={(e) =>
              onFormDataChange({ ...formData, linkedIn: e.target.value })
            }
            className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-900 dark:text-white">
            GitHub Profile
          </label>
          <input
            type="url"
            placeholder="GitHub Profile"
            value={formData.github}
            onChange={(e) =>
              onFormDataChange({ ...formData, github: e.target.value })
            }
            className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-900 dark:text-white">
            Twitter Profile
          </label>
          <input
            type="url"
            placeholder="Twitter Profile"
            value={formData.twitter}
            onChange={(e) =>
              onFormDataChange({ ...formData, twitter: e.target.value })
            }
            className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          {editingId ? "Update" : "Create"} Contact
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
