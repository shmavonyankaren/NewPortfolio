"use client";

import Image from "next/image";
import Link from "next/link";

function getFilenameFromUrl(url: string, fallback: string) {
  try {
    const pathname = new URL(
      url,
      typeof window !== "undefined" ? window.location.href : "http://localhost"
    ).pathname;
    const last = pathname.split("/").filter(Boolean).pop();
    if (last && last.includes(".")) return last;
    return fallback;
  } catch {
    return fallback;
  }
}

interface AboutHeroProps {
  generalInfo?: {
    fullName?: string;
    shortAbout?: string;
    fullDescription?: string;
    userPhoto?: string;
  } | null;
  cvUrl: string;
}

const AboutHero = ({ generalInfo, cvUrl }: AboutHeroProps) => {
  const description =
    generalInfo?.fullDescription ||
    "Hi! I'm Karen, a passionate full-stack developer with a keen interest in creating beautiful and functional web applications. With over 5 years of experience in web development, I've worked with startups and established companies to bring their visions to life.";
  const userPhoto =
    generalInfo?.userPhoto && generalInfo.userPhoto.trim() !== ""
      ? generalInfo.userPhoto
      : "/assets/images/image6.png";

  const handleDownload = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const downloadUrl = cvUrl;
    const filename = getFilenameFromUrl(downloadUrl, "Karen_Shmavonyan_CV.pdf");
    try {
      const res = await fetch(downloadUrl);
      if (!res.ok) throw new Error("Failed to fetch CV");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed, opening in new tab", err);
      window.open(downloadUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section className="pt-30 py-12 sm:py-16 sm:pt-33 md:py-20 md:pt-36 min-h-screen flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Image */}
        <div className="flex justify-center">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-2xl border-2 border-purple-500/30">
            <Image
              src={userPhoto}
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          <h1 className="heading text-3xl sm:text-4xl md:text-5xl">
            <div className="inline-block">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-linear-to-r from-purple-600 via-purple-500 to-pink-500 dark:from-purple-400 dark:via-purple-300 dark:to-pink-400 bg-clip-text text-transparent">
                About Me
              </h1>
              <div className="h-1 w-full bg-linear-to-r from-purple-600 via-purple-500 to-pink-500 dark:from-purple-400 dark:via-purple-300 dark:to-pink-400 rounded-full"></div>
            </div>
          </h1>
          <p className="text-base sm:text-lg text-gray-700 dark:text-[#bec1dd] leading-relaxed whitespace-pre-line">
            {description}
          </p>
          <div className="pt-4 md:pt-6 flex gap-3 md:gap-4 flex-wrap">
            <a
              href={cvUrl || "/assets/resume/Karen_Shmavonyan_Resume.pdf"}
              onClick={handleDownload}
              className="px-6 sm:px-8 py-2 sm:py-3 bg-purple-600 dark:bg-purple-500 hover:bg-purple-700 dark:hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors inline-block text-sm sm:text-base"
            >
              Download Resume
            </a>
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
