"use client";

import { GeneralInfo } from "../types/generalInfo";
import { ItemActionButtons } from "../common";
import Image from "next/image";
import { User } from "lucide-react";

interface GeneralInfoDisplayProps {
  info: GeneralInfo;
  onEdit: () => void;
  onDelete: () => void;
  isLoading?: boolean;
}

export default function GeneralInfoDisplay({
  info,
  onEdit,
  onDelete,
  isLoading = false,
}: GeneralInfoDisplayProps) {
  return (
    <div className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-lg p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Photo Section */}
        <div className="shrink-0">
          {info.userPhoto ? (
            <Image
              width={120}
              height={120}
              src={info.userPhoto}
              alt={info.fullName}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-purple-600"
            />
          ) : (
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center border-4 border-purple-600">
              <User size={48} className="text-white" />
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="flex-1 space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {info.fullName}
            </h2>
            <p className="text-slate-600 dark:text-gray-400">
              {info.shortAbout}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
              About
            </h3>
            <p className="text-slate-700 dark:text-gray-300 text-sm whitespace-pre-wrap">
              {info.fullDescription}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex gap-2">
            <ItemActionButtons
              onEdit={onEdit}
              onDelete={onDelete}
              editLoading={isLoading}
              deleteLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
