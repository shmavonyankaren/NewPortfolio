"use client";

import { Calendar } from "lucide-react";
import { type ChangeEvent, useState } from "react";

interface DatePickerProps {
  label: string;
  value: string;
  onChange: (isoDate: string) => void;
  disabled?: boolean;
  required?: boolean;
}

// Basic date picker using native input[type=date] for accessibility and consistency
export default function DatePicker({
  label,
  value,
  onChange,
  disabled = false,
  required = false,
}: DatePickerProps) {
  const [isFocused, setIsFocused] = useState(false);

  const toInputValue = (v: string) => {
    if (!v) return "";
    // already ISO YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
    // attempt to parse DD/MM/YYYY fallback
    const parts = v.split("/");
    if (parts.length === 3) {
      const [dd, mm, yyyy] = parts;
      if (dd && mm && yyyy)
        return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
    }
    return "";
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value; // YYYY-MM-DD
    onChange(next);
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-slate-900 dark:text-white">
        {label}
      </label>
      <div className={`relative flex items-center`}>
        <input
          type="date"
          value={toInputValue(value)}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          required={required}
          className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500 disabled:opacity-50"
        />
        <Calendar
          className={`w-4 h-4 absolute right-3 text-slate-500 dark:text-slate-400 pointer-events-none transition-opacity ${
            isFocused ? "opacity-100" : "opacity-70"
          }`}
        />
      </div>
    </div>
  );
}
