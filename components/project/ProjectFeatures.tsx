import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

type ProjectFeaturesProps = {
  features: string[];
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
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-start gap-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
          >
            <FaCheckCircle className="text-purple-600 dark:text-purple-400 mt-1 flex-shrink-0" />
            <p className="text-slate-700 dark:text-slate-300">{feature}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
