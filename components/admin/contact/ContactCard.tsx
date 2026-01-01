"use client";

import { Edit2, Trash2 } from "lucide-react";

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

interface ContactCardProps {
  contact: Contact;
  onEdit: () => void;
  onDelete: () => void;
  disabled?: boolean;
}

export default function ContactCard({
  contact,
  onEdit,
  onDelete,
  disabled = false,
}: ContactCardProps) {
  return (
    <div className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-lg p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row items-start gap-3">
        <div className="flex-1 min-w-0 w-full">
          <h4 className="text-slate-900 dark:text-white font-semibold text-base sm:text-lg mb-2 sm:mb-3">
            {contact.location}
          </h4>
          <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
            <p className="text-slate-600 dark:text-gray-400 break-words">
              <span className="text-slate-900 dark:text-white font-semibold">
                Email:{" "}
              </span>
              {contact.email}
            </p>
            <p className="text-slate-600 dark:text-gray-400">
              <span className="text-slate-900 dark:text-white font-semibold">
                Phone:{" "}
              </span>
              {contact.phone}
            </p>
            {contact.website && (
              <p className="text-slate-600 dark:text-gray-400 break-all">
                <span className="text-slate-900 dark:text-white font-semibold">
                  Website:{" "}
                </span>
                {contact.website}
              </p>
            )}
            {contact.cvUrl && (
              <p className="text-slate-600 dark:text-gray-400 mt-2 sm:mt-3">
                <a
                  href={contact.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
                >
                  Download CV (PDF)
                </a>
              </p>
            )}
          </div>
          {(contact.github || contact.linkedIn || contact.twitter) && (
            <div className="flex flex-wrap gap-2 mt-2 sm:mt-3">
              {contact.github && (
                <a
                  href={contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs sm:text-sm"
                >
                  GitHub
                </a>
              )}
              {contact.linkedIn && (
                <a
                  href={contact.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs sm:text-sm"
                >
                  LinkedIn
                </a>
              )}
              {contact.twitter && (
                <a
                  href={contact.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 text-xs sm:text-sm"
                >
                  Twitter
                </a>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={onEdit}
            disabled={disabled}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
            title="Edit"
          >
            <Edit2 size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
          <button
            onClick={onDelete}
            disabled={disabled}
            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-600"
            title="Delete"
          >
            <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
