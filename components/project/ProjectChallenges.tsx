import React from "react";
import { FaLightbulb } from "react-icons/fa";

type Challenge = {
  title: string;
  description: string;
};

type ProjectChallengesProps = {
  challenges: Challenge[];
};

export function ProjectChallenges({ challenges }: ProjectChallengesProps) {
  return (
    <div className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <FaLightbulb className="text-3xl text-purple-600 dark:text-purple-400" />
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
          Challenges & Solutions
        </h2>
      </div>
      <div className="space-y-6">
        {challenges.map((challenge, index) => (
          <div key={index} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-300"></div>
            <div className="relative bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {challenge.title}
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {challenge.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
