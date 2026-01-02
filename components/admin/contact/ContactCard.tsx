"use client";

import { ItemActionButtons } from "../common";

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
  const handleDownloadCV = async () => {
    if (!contact.cvUrl) return;

    try {
      const response = await fetch(contact.cvUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "CV.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback to opening in new tab
      window.open(contact.cvUrl, "_blank");
    }
  };

  return (
    <div className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-lg p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row items-start gap-3">
        <div className="flex-1 min-w-0 w-full">
          <h4 className="text-slate-900 dark:text-white font-semibold text-base sm:text-lg mb-2 sm:mb-3">
            {contact.location}
          </h4>
          <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
            <p className="text-slate-600 dark:text-gray-400 wrap-break-word">
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
                <button
                  onClick={handleDownloadCV}
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold underline cursor-pointer"
                >
                  Download CV (PDF)
                </button>
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
        <ItemActionButtons
          onEdit={onEdit}
          onDelete={onDelete}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
