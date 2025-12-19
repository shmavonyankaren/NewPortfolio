import React from "react";
import Image from "next/image";
import Link from "next/link";

const AboutHero = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 min-h-screen flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Image */}
        <div className="flex justify-center">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-2xl border-2 border-purple-500/30">
            <Image
              src="/assets/images/image6.png"
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          <h1 className="heading text-3xl sm:text-4xl md:text-5xl">
            About <span className="text-purple-300">Me</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-700 dark:text-[#bec1dd] leading-relaxed">
            Hi! I&apos;m Karen, a passionate full-stack developer with a keen
            interest in creating beautiful and functional web applications. With
            over 5 years of experience in web development, I&apos;ve worked with
            startups and established companies to bring their visions to life.
          </p>
          <p className="text-base sm:text-lg text-gray-700 dark:text-[#bec1dd] leading-relaxed">
            I believe in writing clean, maintainable code and creating user
            experiences that delight. When I&apos;m not coding, you can find me
            exploring new technologies, contributing to open-source projects, or
            sharing my knowledge with the developer community.
          </p>
          <div className="pt-4 md:pt-6 flex gap-3 md:gap-4 flex-wrap">
            <Link
              href="/assets/CV.pdf"
              download="Karen-Resume.pdf"
              className="px-6 sm:px-8 py-2 sm:py-3 bg-purple-600 dark:bg-purple-500 hover:bg-purple-700 dark:hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors inline-block text-sm sm:text-base"
            >
              Download Resume
            </Link>
            <Link
              href="/contact"
              className="px-6 sm:px-8 py-2 sm:py-3 border-2 border-purple-600 dark:border-purple-500 text-purple-600 dark:text-purple-300 hover:bg-purple-600/10 rounded-lg font-semibold transition-colors inline-block text-sm sm:text-base"
            >
              Contact Me
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
