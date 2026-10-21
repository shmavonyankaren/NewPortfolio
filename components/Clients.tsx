"use client";

import React from "react";

import { companies, testimonials } from "@/data";
import { InfiniteMovingCards } from "./ui/InfiniteCards";
import Image from "next/image";

interface ClientsProps {
  insights?: {
    comment?: string;
    insight?: string;
    name: string;
    position: string;
    image?: string;
  }[];
}

const Clients = ({ insights }: ClientsProps) => {
  // Transform insights/comments from API to match testimonials format
  const insightsData =
    insights && insights.length > 0
      ? insights.map((insight) => ({
          quote: insight.comment?.trim() || insight.insight?.trim() || "",
          name: insight.name,
          title: insight.position,
          img: insight.image || "",
        }))
      : testimonials;

  return (
    <section id="testimonials" className="py-20">
      <h1 className="heading flex  flex-col lg:flex-row justify-center items-center gap-4">
        <Image
          src="/assets/images/NotesIcon.png"
          width={60}
          height={60}
          alt="Insights"
        />
        Insights from
        <span className="text-purple-500 dark:text-purple-300">
          {" "}
          Famous People
        </span>
      </h1>

      <div className="flex flex-col items-center max-lg:mt-10">
        <div
          // remove bg-white dark:bg-black dark:bg-grid-white/[0.05], h-[40rem] to 30rem , md:h-[30rem] are for the responsive design
          className=" md:h-120 rounded-md flex flex-col antialiased  items-center justify-center relative overflow-hidden"
        >
          <InfiniteMovingCards
            items={insightsData}
            direction="right"
            speed="normal"
          />
        </div>
      </div>
    </section>
  );
};

export default Clients;
