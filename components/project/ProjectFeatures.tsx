import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

type Feature =
  | {
      title?: string;
      description?: string;
      icon?: string;
    }
  | string;

type ProjectFeaturesProps = {
  features: Feature[];
};

export function ProjectFeatures({ features }: ProjectFeaturesProps) {
  return (
    <div className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <HiSparkles className="text-3xl text-purple-600 dark:text-purple-400" />
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
          Key Features
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => {
          const isString = typeof feature === "string";
          const title = isString ? feature : feature.title || "";
          const description = isString ? "" : feature.description || "";

          return (
            <div
              key={index}
              className="flex items-start gap-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              <FaCheckCircle className="text-purple-600 dark:text-purple-400 mt-1 shrink-0" />
              <div>
                <p className="text-slate-900 dark:text-white font-semibold">
                  {title}
                </p>
                {description && (
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                    {description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
