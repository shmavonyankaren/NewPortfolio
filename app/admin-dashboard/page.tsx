"use client";

import { logoutAdmin } from "@/lib/actions/admin.actions";
import { LogOut } from "lucide-react";
import { useState } from "react";
import ProjectsManager from "@/components/admin/ProjectsManager";
import JobsManager from "@/components/admin/JobsManager";
import EducationManager from "@/components/admin/EducationManager";
import ContactManager from "@/components/admin/ContactManager";
import CommentsManager from "@/components/admin/CommentsManager";

export default function AdminDashboard() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "projects" | "jobs" | "education" | "contact" | "comments"
  >("projects");

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logoutAdmin();
  };

  const tabs = [
    { id: "projects", label: "Projects" },
    { id: "jobs", label: "Jobs" },
    { id: "education", label: "Education" },
    { id: "contact", label: "Contact Info" },
    { id: "comments", label: "Client Comments" },
  ] as const;

  return (
    <div className="min-h-screen px-5 md:px-10 lg:px-20 py-10 text-slate-900 dark:text-white bg-linear-to-r from-slate-50 to-slate-100 dark:bg-[linear-gradient(90deg,rgba(4,7,29,1)_0%,rgba(12,14,35,1)_100%)]">
      <div className="lg:mt-0 mt-17 max-w-7xl mx-auto">
        {/* Header with Logout Button */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-slate-600 dark:text-gray-400 mt-2">
              Manage your portfolio content
            </p>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
          >
            <LogOut size={20} />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 dark:border-white/10 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-purple-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/5 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-8">
          {activeTab === "projects" && <ProjectsManager />}
          {activeTab === "jobs" && <JobsManager />}
          {activeTab === "education" && <EducationManager />}
          {activeTab === "contact" && <ContactManager />}
          {activeTab === "comments" && <CommentsManager />}
        </div>
      </div>
    </div>
  );
}
