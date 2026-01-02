"use client";

import { Trash2 } from "lucide-react";

interface Challenge {
  challenge: string;
  solution: string;
}

interface ChallengeInputProps {
  challenges: Challenge[];
  showInput: boolean;
  tempChallenge: { challenge: string; solution: string };
  onShowInput: (show: boolean) => void;
  onTempChallengeChange: (challenge: {
    challenge: string;
    solution: string;
  }) => void;
  onAddChallenge: () => void;
  onRemoveChallenge: (index: number) => void;
}

export default function ChallengeInput({
  challenges,
  showInput,
  tempChallenge,
  onShowInput,
  onTempChallengeChange,
  onAddChallenge,
  onRemoveChallenge,
}: ChallengeInputProps) {
  return (
    <div className="space-y-4 border-t border-slate-300 dark:border-white/10 pt-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
          Challenges & Solutions
        </h4>
        <button
          type="button"
          onClick={() => onShowInput(true)}
          disabled={showInput}
          className=" cursor-pointer bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-3 py-2.5 rounded text-sm font-semibold transition-colors"
        >
          + Add Challenge
        </button>
      </div>

      {showInput && (
        <div className="w-full flex justify-end">
          <div className="w-full max-w-125 space-y-2 bg-slate-50 dark:bg-white/5 p-5 rounded">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600 dark:text-gray-400">
                Challenge
              </label>
              <textarea
                placeholder="Describe the challenge faced"
                value={tempChallenge.challenge}
                onChange={(e) =>
                  onTempChallengeChange({
                    ...tempChallenge,
                    challenge: e.target.value,
                  })
                }
                className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500"
                rows={2}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600 dark:text-gray-400">
                Solution
              </label>
              <textarea
                placeholder="Describe how you solved it"
                value={tempChallenge.solution}
                onChange={(e) =>
                  onTempChallengeChange({
                    ...tempChallenge,
                    solution: e.target.value,
                  })
                }
                className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500"
                rows={2}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onAddChallenge}
                className=" cursor-pointer flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2.5 rounded transition-colors text-sm font-semibold"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  onShowInput(false);
                  onTempChallengeChange({ challenge: "", solution: "" });
                }}
                className="cursor-pointer flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2.5 rounded transition-colors text-sm font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {challenges.map((item, index) => (
          <div
            key={`challenge-${index}-${item.challenge}`}
            className="flex gap-2 items-start bg-slate-50 dark:bg-white/5 p-3 rounded"
          >
            <div className="flex-1 space-y-1">
              <p className="text-xs font-medium text-slate-600 dark:text-gray-400">
                Challenge:
              </p>
              <p className="text-sm text-slate-900 dark:text-white">
                {item.challenge}
              </p>
              <p className="text-xs font-medium text-slate-600 dark:text-gray-400 mt-2">
                Solution:
              </p>
              <p className="text-sm text-slate-900 dark:text-white">
                {item.solution}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onRemoveChallenge(index)}
              className="cursor-pointer bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors shrink-0 mt-6"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
