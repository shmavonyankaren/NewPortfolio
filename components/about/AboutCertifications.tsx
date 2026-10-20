"use client";

import ContentLogo from "@/components/ContentLogo";
import Image from "next/image";

interface AboutCertificationsProps {
  certificates?: {
    _id?: string;
    logo?: string;
    description?: string;
    title: string;
    issuer: string;
    dateIssued: string;
    fileUrl: string;
  }[];
}

const AboutCertifications = ({ certificates }: AboutCertificationsProps) => {
  const fallbackCertifications: {
    id?: string;
    logo?: string;
    title: string;
    issuer: string;
    date: string;
    file: string;
    description?: string;
  }[] = [
    {
      title: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services",
      date: "2023",
      file: "/assets/certificates/aws-certified-cloud-practitioner.pdf",
    },
    {
      title: "Google UX Design Professional Certificate",
      issuer: "Google via Coursera",
      date: "2022",
      file: "/assets/certificates/google-ux-design.pdf",
    },
    {
      title: "JavaScript Algorithms & Data Structures",
      issuer: "FreeCodeCamp",
      date: "2021",
      file: "/assets/certificates/javascript-algorithms.pdf",
    },
    {
      title: "React Developer Specialization",
      issuer: "Udemy",
      date: "2021",
      file: "/assets/certificates/react-developer.pdf",
    },
  ];

  const certificationsData =
    certificates && certificates.length > 0
      ? certificates.map((cert) => ({
          id: cert._id,
          logo: cert.logo,
          description: cert.description?.trim() || "",
          title: cert.title,
          issuer: cert.issuer,
          date: new Date(cert.dateIssued).getFullYear().toString(),
          file: cert.fileUrl,
        }))
      : fallbackCertifications;

  const handleDownload = async (fileUrl: string, certTitle: string) => {
    try {
      const safeTitle = certTitle.replace(/[^\w.-]+/g, "_") || "certificate";
      const desiredFilename = `${safeTitle}.pdf`;
      const res = await fetch(fileUrl);
      if (!res.ok) throw new Error("Failed to fetch certificate");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = desiredFilename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Certificate download failed, opening in new tab", err);
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="space-y-8 md:space-y-12">
        <h2 className="heading text-2xl! sm:text-3xl! md:text-4xl!">
          <span className="flex justify-center items-center text-center gap-3 text-purple-500 dark:text-purple-300">
            <Image
              src="/assets/images/CertificatesIcon.png"
              width={60}
              height={60}
              alt="Certificates"
            />
            Certifications
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {certificationsData.map((cert, idx) => {
            const isLastOdd =
              certificationsData.length % 2 !== 0 &&
              idx === certificationsData.length - 1;

            return (
              <div
                key={cert.id ?? idx}
                className={`
          bg-white dark:bg-[#1a1f3a]
          p-6 rounded-xl shadow-lg
          hover:shadow-xl transition-shadow
          border border-gray-200 dark:border-purple-500/20
          flex flex-col h-full
          ${
            isLastOdd
              ? "md:col-span-2 md:w-[calc(50%-1rem)] md:justify-self-center"
              : ""
          }
        `}
              >
                {/* Certificate header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                  <ContentLogo src={cert.logo} alt={cert.issuer + " logo"} />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                      {cert.title}
                    </h3>
                    <p className="text-gray-600 dark:text-purple-400 text-xs sm:text-sm mt-1">
                      {cert.issuer}
                    </p>
                  </div>

                  <span className="self-start px-3 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap">
                    {cert.date}
                  </span>
                </div>

                {/* Certificate description */}
                {cert.description && (
                  <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300 whitespace-pre-line break-words">
                    {cert.description}
                  </p>
                )}

                {/* Certificate actions */}
                <div className="mt-auto flex gap-2 md:gap-3 flex-wrap pt-5">
                  <button
                    type="button"
                    onClick={() => handleDownload(cert.file, cert.title)}
                    className="cursor-pointer px-3 md:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition-colors"
                  >
                    Download certificate
                  </button>

                  <a
                    href={cert.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 md:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg border border-purple-600 text-purple-700 hover:bg-purple-50 dark:border-purple-400 dark:text-purple-200 dark:hover:bg-purple-500/10 transition-colors"
                  >
                    View online
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutCertifications;
