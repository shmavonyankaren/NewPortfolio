import React from "react";

type ProjectStatsProps = {
  stats: {
    duration: string;
    team: string;
    status: string;
  };
};

export function ProjectStats({ stats }: ProjectStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
      {Object.entries(stats).map(([key, value]) => (
        <div key={key} className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
          <div className="relative bg-white dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-white/10 shadow-lg">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 capitalize">
              {key}
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
