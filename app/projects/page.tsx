import RecentProjects from "@/components/RecentProjects";
import React from "react";

function MyProjects() {
  return (
    <div className="min-h-screen flex flex-col items-center pt-20 pb-10 bg-[linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)] dark:bg-[#000319] text-gray-900 dark:text-white">
      <div className="w-full h-full md:px-20 px-5">
        <RecentProjects />
      </div>
    </div>
  );
}

export default MyProjects;
