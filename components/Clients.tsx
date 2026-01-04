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
      <h1 className="heading">
        🌟 Insights from
        <span className="text-purple-500 dark:text-purple-300">
          {" "}
          Famous People
        </span>
      </h1>

      <div className="flex flex-col items-center max-lg:mt-10">
        <div
          // remove bg-white dark:bg-black dark:bg-grid-white/[0.05], h-[40rem] to 30rem , md:h-[30rem] are for the responsive design
          className="h-[50vh] md:h-120 rounded-md flex flex-col antialiased  items-center justify-center relative overflow-hidden"
        >
          <InfiniteMovingCards
            items={insightsData}
            direction="right"
            speed="normal"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-16 max-lg:mt-10">
          {companies.map((company) => (
            <React.Fragment key={company.id}>
              <div className="flex md:max-w-60 max-w-32 gap-2">
                {company.img && company.img.trim() !== "" && (
                  <Image
                    width={50}
                    height={50}
                    src={company.img}
                    alt={company.name}
                    className={"md:w-10 w-5 " + (company.className || "")}
                  />
                )}
                {company.nameImg && company.nameImg.trim() !== "" && (
                  <Image
                    height={50}
                    src={company.nameImg}
                    alt={company.name}
                    width={company.id === 4 || company.id === 5 ? 100 : 150}
                    className="md:w-24 w-20 brightness-0  dark:invert dark:sepia dark:saturate-[3] dark:hue-rotate-240"
                  />
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Clients;
