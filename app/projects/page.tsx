import RecentProjects from "@/components/RecentProjects";
import React from "react";

function MyProjects() {
  return (
    <div className="min-h-screen flex flex-col items-center pt-20 pb-10 bg-[#0a0e1c]">
      <div className="w-full h-full md:px-20 px-5">
        <RecentProjects />
      </div>
    </div>
  );
}

export default MyProjects;
