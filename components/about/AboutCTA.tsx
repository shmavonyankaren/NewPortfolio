import Link from "next/link";
import React from "react";

const AboutCTA = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="bg-linear-to-r from-purple-600 to-purple-800 dark:from-purple-500 dark:to-purple-700 rounded-2xl md:rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          Let&apos;s Work Together
        </h2>
        <p className="text-base sm:text-lg mb-6 md:mb-8 text-purple-100 max-w-2xl mx-auto">
          I&apos;m always interested in hearing about new projects and
          opportunities. Feel free to reach out!
        </p>
        <div className="flex gap-3 md:gap-4 justify-center flex-wrap">
          <Link
            href="/assets/resume/Karen_Shmavonyan_Resume.pdf"
            download="Karen_Shmavonyan_Resume.pdf"
            className="px-6 sm:px-8 py-2 sm:py-3 bg-white text-purple-600 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-linear-to-r hover:from-white hover:to-purple-50 text-sm sm:text-base"
          >
            Download Resume
          </Link>
          <Link
            href="/contact"
            className="px-6 sm:px-8 py-2 sm:py-3 border-2 border-white text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xltext-sm sm:text-base"
          >
            Contact Me
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutCTA;
